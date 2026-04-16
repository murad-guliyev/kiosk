import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join } from 'path';

const DIR = 'public/assets/money';
const MAX_WIDTH = 800;
const JPEG_QUALITY = 80;
const PNG_QUALITY = 80;

async function optimizeImage(filePath) {
  const ext = filePath.split('.').pop().toLowerCase();
  if (!['jpg', 'jpeg', 'png'].includes(ext)) return null;

  const before = (await stat(filePath)).size;
  const image = sharp(filePath);
  const metadata = await image.metadata();

  let pipeline = sharp(filePath);

  if (metadata.width > MAX_WIDTH) {
    pipeline = pipeline.resize(MAX_WIDTH, null, { withoutEnlargement: true });
  }

  let buffer;
  if (ext === 'png') {
    buffer = await pipeline.png({ quality: PNG_QUALITY, compressionLevel: 9 }).toBuffer();
  } else {
    buffer = await pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toBuffer();
  }

  await sharp(buffer).toFile(filePath);
  const after = (await stat(filePath)).size;

  return { filePath, before, after };
}

async function main() {
  const files = await readdir(DIR);
  let totalBefore = 0;
  let totalAfter = 0;
  let count = 0;

  for (const file of files) {
    const filePath = join(DIR, file);
    const result = await optimizeImage(filePath);
    if (!result) continue;
    count++;
    totalBefore += result.before;
    totalAfter += result.after;
    const savings = ((1 - result.after / result.before) * 100).toFixed(0);
    const beforeKB = (result.before / 1024).toFixed(0);
    const afterKB = (result.after / 1024).toFixed(0);
    if (count <= 10 || result.before > 1000000) {
      console.log(`  ${file}: ${beforeKB}KB → ${afterKB}KB (-${savings}%)`);
    }
  }

  const totalBeforeMB = (totalBefore / 1048576).toFixed(1);
  const totalAfterMB = (totalAfter / 1048576).toFixed(1);
  const totalSavings = ((1 - totalAfter / totalBefore) * 100).toFixed(0);
  console.log(`\nDone: ${count} images`);
  console.log(`Total: ${totalBeforeMB}MB → ${totalAfterMB}MB (-${totalSavings}%)`);
}

main().catch(console.error);
