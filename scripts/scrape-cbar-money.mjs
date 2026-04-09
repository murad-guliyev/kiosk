/**
 * One-time data acquisition from cbar.az
 * Fetches list pages, detail pages (AZ + EN), downloads images,
 * and produces money.families.json + money.versions.json
 */

import { load } from 'cheerio';
import { writeFileSync, mkdirSync, existsSync, createWriteStream } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import http from 'http';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'src', 'data');
const ASSETS_DIR = join(__dirname, '..', 'src', 'assets', 'money');
const BASE_URL = 'https://cbar.az';

mkdirSync(DATA_DIR, { recursive: true });
mkdirSync(ASSETS_DIR, { recursive: true });

// Rate limiting
function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function httpGet(url, encoding) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; CbarCatalogScraper/1.0)',
        'Accept': 'text/html,application/xhtml+xml,image/*',
        'Accept-Language': 'az,en;q=0.9',
      },
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const loc = res.headers.location.startsWith('http')
          ? res.headers.location
          : `${new URL(url).origin}${res.headers.location}`;
        return httpGet(loc, encoding).then(resolve, reject);
      }
      if (res.statusCode !== 200) {
        res.resume();
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      if (encoding === 'binary') {
        resolve(res); // return the stream
      } else {
        const chunks = [];
        res.setEncoding('utf8');
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => resolve(chunks.join('')));
        res.on('error', reject);
      }
    });
    req.on('error', reject);
    req.setTimeout(30000, () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

async function fetchPage(url) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      return await httpGet(url);
    } catch (err) {
      console.warn(`  Attempt ${attempt + 1} failed for ${url}: ${err.message}`);
      if (attempt < 2) await delay(2000);
    }
  }
  console.error(`  FAILED to fetch: ${url}`);
  return null;
}

async function downloadImage(imageUrl, filename) {
  const filepath = join(ASSETS_DIR, filename);
  if (existsSync(filepath)) return `/src/assets/money/${filename}`;
  try {
    const stream = await httpGet(imageUrl, 'binary');
    const ws = createWriteStream(filepath);
    await new Promise((resolve, reject) => {
      stream.pipe(ws);
      ws.on('finish', resolve);
      ws.on('error', reject);
      stream.on('error', reject);
    });
    return `/src/assets/money/${filename}`;
  } catch (err) {
    console.warn(`  Failed to download image: ${imageUrl} - ${err.message}`);
    return null;
  }
}

// ---- STEP 1: Parse list pages to get items with detail IDs ----

const LIST_PAGES = [
  { type: 'banknotes', categoryId: 1, url: `${BASE_URL}/moneymarks/banknotes?category=1` },
  { type: 'coins', categoryId: 1, url: `${BASE_URL}/moneymarks/coins?category=1` },
  { type: 'banknotes', categoryId: 2, url: `${BASE_URL}/moneymarks/banknotes?category=2` },
  { type: 'coins', categoryId: 2, url: `${BASE_URL}/moneymarks/coins?category=2` },
  { type: 'banknotes', categoryId: 3, url: `${BASE_URL}/moneymarks/banknotes?category=3` },
  { type: 'coins', categoryId: 3, url: `${BASE_URL}/moneymarks/coins?category=3` },
];

async function parseListPage(page) {
  console.log(`Fetching list: ${page.type} category=${page.categoryId}`);
  const html = await fetchPage(page.url);
  if (!html) return [];

  const $ = load(html);
  const items = [];

  // Items use <div class="gallery-item" data-href="/moneymarks/TYPE/detail/ID">
  // with background-image style and <div class="caption marks"><p>Title</p>
  $('.gallery-item[data-href]').each((_, el) => {
    const href = $(el).attr('data-href');
    const match = href.match(/\/moneymarks\/(?:banknotes|coins)\/detail\/(\d+)/);
    if (!match) return;

    const detailId = match[1];
    const titleText = $(el).find('.caption p').first().text().trim().replace(/\s+/g, ' ');
    // Background image is in style attribute of .image div
    const style = $(el).find('.image').attr('style') || '';
    const imgMatch = style.match(/url\(([^)]+)\)/);
    const img = imgMatch ? imgMatch[1] : '';

    items.push({
      detailId,
      type: page.type,
      categoryId: page.categoryId,
      titleAz: titleText || '',
      listImageUrl: img || '',
      detailUrl: `${BASE_URL}/moneymarks/${page.type}/detail/${detailId}`,
    });
  });

  // Deduplicate by detailId
  const seen = new Set();
  return items.filter((item) => {
    if (seen.has(item.detailId)) return false;
    seen.add(item.detailId);
    return true;
  });
}

// ---- STEP 2: Parse detail pages (AZ + EN) ----

function parseDetailPage(html, lang) {
  const $ = load(html);
  const result = {
    title: '',
    frontImage: null,
    rearImage: null,
    description: '',
    attributes: [],
    securityElements: [],
    overview: [],
    brochureUrl: null,
  };

  // Title from .content_title or .manat_title
  result.title = $('.content_title').first().text().trim() ||
    $('h1').first().text().trim() || '';

  // Images: <img src="https://uploads.cbar.az/money-marks/..."> (not video thumbnails)
  const images = [];
  $('img').each((_, el) => {
    const src = $(el).attr('src') || '';
    if (src.includes('uploads.cbar.az/money-marks') && !$(el).hasClass('play-button')) {
      images.push(src);
    }
  });
  if (images.length >= 1) result.frontImage = images[0];
  if (images.length >= 2) result.rearImage = images[1];

  // The page has tabs_content sections in order:
  // 1. Main features (table + description)
  // 2. Security elements
  // 3. Video (ignore)
  const tabContents = $('.tabs_content');

  // Tab 1: Main features — contains a table and description paragraphs
  const mainTab = tabContents.eq(0);
  if (mainTab.length) {
    // Technical attributes from table
    mainTab.find('table tr').each((_, row) => {
      const cells = $(row).find('td');
      if (cells.length >= 2) {
        const label = $(cells[0]).text().trim();
        const value = $(cells[1]).text().trim();
        if (label && value) {
          result.attributes.push({ label, value });
        }
      }
    });

    // Description/overview paragraphs
    mainTab.find('.money_tabs_content > p, .money_tabs_content p').each((_, el) => {
      const text = $(el).text().trim();
      if (text && text.length > 10) {
        result.overview.push(text);
      }
    });
  }

  // Tab 2: Security elements
  const secTab = tabContents.eq(1);
  if (secTab.length) {
    secTab.find('li').each((_, el) => {
      const text = $(el).text().trim();
      if (text && text.length > 5) {
        result.securityElements.push(text);
      }
    });
    // Some pages use paragraphs instead of lists for security
    if (result.securityElements.length === 0) {
      secTab.find('p').each((_, el) => {
        const text = $(el).text().trim();
        if (text && text.length > 10) {
          result.securityElements.push(text);
        }
      });
    }
  }

  // Brochure PDF links (anywhere on page)
  $('a[href*=".pdf"]').each((_, el) => {
    const href = $(el).attr('href');
    if (href && href.includes('money-marks')) {
      result.brochureUrl = href.startsWith('http') ? href : `${BASE_URL}${href}`;
    }
  });

  return result;
}

// ---- STEP 3: Grouping logic ----

function extractDenomination(title) {
  // Try to extract the denomination part for grouping
  // e.g., "1 AZN (2006)" -> "1 AZN"
  // e.g., "1000 manat - 1993 il" -> "1000 manat"
  // e.g., "50 qəpik - Nikel - AZM" -> "50 qəpik"
  // e.g., "1 Qəpik (2006)" -> "1 Qəpik"

  let denom = title;

  // Remove year in parens: "1 AZN (2006)" -> "1 AZN"
  denom = denom.replace(/\s*\(\d{4}\)\s*/g, '').trim();

  // Remove " - YYYY il" pattern: "1000 manat - 1993 il" -> "1000 manat"
  denom = denom.replace(/\s*-\s*\d{4}\s*il\s*/gi, '').trim();

  // Remove material suffixes: " - Nikel - AZM" -> keep denomination only
  // Split on " - " and keep just the denomination part
  const parts = denom.split(/\s*-\s*/);
  if (parts.length > 1) {
    // Keep just the first part (denomination)
    denom = parts[0].trim();
  }

  return denom;
}

function buildFamilyKey(item, categoryId) {
  // For investment/commemorative (cat 2), keep 1:1 with source title
  if (categoryId === 2) {
    return `cat${categoryId}-${item.type}-${item.detailId}`;
  }

  // For circulation (cat 1) and withdrawn (cat 3), group by denomination
  const denom = extractDenomination(item.titleAz);
  return `cat${categoryId}-${item.type}-${denom.toLowerCase().replace(/\s+/g, '-')}`;
}

// ---- STEP 4: Determine year from title ----

function extractYear(title) {
  // Try "(YYYY)" pattern first
  const parenMatch = title.match(/\((\d{4})\)/);
  if (parenMatch) return parseInt(parenMatch[1], 10);

  // Try "YYYY il" pattern
  const ilMatch = title.match(/(\d{4})\s*il/i);
  if (ilMatch) return parseInt(ilMatch[1], 10);

  // Try standalone 4-digit year
  const yearMatch = title.match(/\b(19\d{2}|20\d{2})\b/);
  if (yearMatch) return parseInt(yearMatch[1], 10);

  return null;
}

// ---- MAIN ----

async function main() {
  console.log('=== CBAR Money Scraper ===\n');

  // Step 1: Fetch all list pages
  const allItems = [];
  for (const page of LIST_PAGES) {
    const items = await parseListPage(page);
    console.log(`  Found ${items.length} items`);
    allItems.push(...items);
    await delay(500);
  }

  console.log(`\nTotal items from list pages: ${allItems.length}\n`);

  // Step 2: Fetch detail pages (AZ + EN) for each item
  const detailResults = [];
  for (let i = 0; i < allItems.length; i++) {
    const item = allItems[i];
    console.log(`[${i + 1}/${allItems.length}] Fetching detail: ${item.type}/detail/${item.detailId} ...`);

    // Fetch AZ version
    const azHtml = await fetchPage(item.detailUrl);
    const azDetail = azHtml ? parseDetailPage(azHtml, 'az') : null;
    await delay(300);

    // Fetch EN version
    const enUrl = `${item.detailUrl}?language=en`;
    const enHtml = await fetchPage(enUrl);
    const enDetail = enHtml ? parseDetailPage(enHtml, 'en') : null;
    await delay(300);

    detailResults.push({
      ...item,
      titleAz: azDetail?.title || item.titleAz,
      titleEn: enDetail?.title || '',
      azDetail,
      enDetail,
    });
  }

  // Step 3: Download images
  console.log('\n=== Downloading images ===\n');
  let imgCount = 0;
  for (const item of detailResults) {
    const az = item.azDetail;
    if (!az) continue;

    // Download front image
    if (az.frontImage) {
      const ext = az.frontImage.match(/\.(jpg|jpeg|png|gif|webp)/i)?.[1] || 'jpg';
      const filename = `${item.type}_${item.detailId}_front.${ext}`;
      const localPath = await downloadImage(az.frontImage, filename);
      item.localFrontImage = localPath;
      if (localPath) imgCount++;
      await delay(200);
    }

    // Download rear image
    if (az.rearImage) {
      const ext = az.rearImage.match(/\.(jpg|jpeg|png|gif|webp)/i)?.[1] || 'jpg';
      const filename = `${item.type}_${item.detailId}_rear.${ext}`;
      const localPath = await downloadImage(az.rearImage, filename);
      item.localRearImage = localPath;
      if (localPath) imgCount++;
      await delay(200);
    }

    // Download list/thumbnail image if different
    if (item.listImageUrl && item.listImageUrl !== az.frontImage) {
      const ext = item.listImageUrl.match(/\.(jpg|jpeg|png|gif|webp)/i)?.[1] || 'png';
      const filename = `${item.type}_${item.detailId}_thumb.${ext}`;
      const localPath = await downloadImage(item.listImageUrl, filename);
      item.localThumbImage = localPath;
      if (localPath) imgCount++;
      await delay(200);
    }
  }
  console.log(`Downloaded ${imgCount} images\n`);

  // Step 4: Group into families
  console.log('=== Building families ===\n');
  const familyMap = new Map();

  for (const item of detailResults) {
    const key = buildFamilyKey(item, item.categoryId);

    if (!familyMap.has(key)) {
      const denom = item.categoryId === 2
        ? (item.titleAz || item.azDetail?.title || '')
        : extractDenomination(item.titleAz || item.azDetail?.title || '');
      const denomEn = item.categoryId === 2
        ? (item.titleEn || item.enDetail?.title || '')
        : extractDenomination(item.titleEn || item.enDetail?.title || '');

      familyMap.set(key, {
        familyId: key,
        categoryId: item.categoryId,
        subcategory: item.type,
        title: { az: denom, en: denomEn || denom },
        thumbnailImage: item.localThumbImage || item.localFrontImage || '',
        versionCount: 0,
        sourceUrls: [],
        versions: [],
      });
    }

    const family = familyMap.get(key);
    family.versionCount++;
    family.sourceUrls.push(item.detailUrl);

    // Build version
    const az = item.azDetail || {};
    const en = item.enDetail || {};

    const version = {
      versionId: `${item.type}-${item.detailId}`,
      familyId: key,
      title: {
        az: item.titleAz || az.title || '',
        en: item.titleEn || en.title || '',
      },
      year: extractYear(item.titleAz || az.title || ''),
      frontImage: item.localFrontImage || null,
      rearImage: item.localRearImage || null,
      description: null,
      attributes: [],
      securityElements: [],
      overview: [],
      brochureUrl: az.brochureUrl || en.brochureUrl || null,
      sourceUrl: item.detailUrl,
    };

    // Try to get year from detail attributes if not in title
    if (!version.year) {
      const yearAttr = [...(az.attributes || []), ...(en.attributes || [])].find(
        (a) => a.label.toLowerCase().includes('il') || a.label.toLowerCase().includes('year') || a.label.toLowerCase().includes('issue')
      );
      if (yearAttr) {
        const y = yearAttr.value.match(/(19\d{2}|20\d{2})/);
        if (y) version.year = parseInt(y[1], 10);
      }
    }

    // Merge attributes (AZ and EN)
    const azAttrs = az.attributes || [];
    const enAttrs = en.attributes || [];
    const maxAttrs = Math.max(azAttrs.length, enAttrs.length);
    for (let i = 0; i < maxAttrs; i++) {
      version.attributes.push({
        label: {
          az: azAttrs[i]?.label || '',
          en: enAttrs[i]?.label || azAttrs[i]?.label || '',
        },
        value: {
          az: azAttrs[i]?.value || '',
          en: enAttrs[i]?.value || azAttrs[i]?.value || '',
        },
      });
    }

    // Security elements
    const azSec = az.securityElements || [];
    const enSec = en.securityElements || [];
    const maxSec = Math.max(azSec.length, enSec.length);
    for (let i = 0; i < maxSec; i++) {
      version.securityElements.push({
        az: azSec[i] || '',
        en: enSec[i] || azSec[i] || '',
      });
    }

    // Overview paragraphs
    const azOverview = az.overview || [];
    const enOverview = en.overview || [];
    const maxOver = Math.max(azOverview.length, enOverview.length);
    for (let i = 0; i < maxOver; i++) {
      version.overview.push({
        az: azOverview[i] || '',
        en: enOverview[i] || azOverview[i] || '',
      });
    }

    family.versions.push(version);
  }

  // Step 5: Output JSON files
  const families = [];
  const versions = [];

  for (const family of familyMap.values()) {
    const { versions: fVersions, ...familyData } = family;
    // Update thumbnail to first version's front image if needed
    if (!familyData.thumbnailImage && fVersions.length > 0) {
      familyData.thumbnailImage = fVersions[0].frontImage || '';
    }
    families.push(familyData);
    versions.push(...fVersions);
  }

  writeFileSync(join(DATA_DIR, 'money.families.json'), JSON.stringify(families, null, 2));
  writeFileSync(join(DATA_DIR, 'money.versions.json'), JSON.stringify(versions, null, 2));

  console.log(`Families: ${families.length}`);
  console.log(`Versions: ${versions.length}`);
  console.log('\nData files written to src/data/');
  console.log('Image assets written to src/assets/money/');
  console.log('\nDone!');
}

main().catch(console.error);
