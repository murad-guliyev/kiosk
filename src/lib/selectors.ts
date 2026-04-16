import familiesData from '../data/money.families.json';
import versionsData from '../data/money.versions.json';
import { MoneyFamily, MoneyVersion } from './types';

const families = familiesData as MoneyFamily[];
const versions = versionsData as MoneyVersion[];

// Pre-built indexes for O(1) lookups. The data is static, so build once at module load.
const familyById = new Map<string, MoneyFamily>();
for (const f of families) familyById.set(f.familyId, f);

const versionsByFamily = new Map<string, MoneyVersion[]>();
for (const v of versions) {
  const list = versionsByFamily.get(v.familyId);
  if (list) list.push(v);
  else versionsByFamily.set(v.familyId, [v]);
}
// Sort each list once (descending year, nulls last)
for (const list of versionsByFamily.values()) {
  list.sort((a, b) => {
    if (a.year !== null && b.year !== null) return b.year - a.year;
    if (a.year !== null) return -1;
    if (b.year !== null) return 1;
    return 0;
  });
}

// Latest version per family — derived from already-sorted versionsByFamily (descending year, nulls last).
// "Latest" means the highest year. If any version has a year, nulls never win.
const latestVersionByFamily = new Map<string, MoneyVersion>();
for (const [familyId, list] of versionsByFamily) {
  if (list.length > 0) latestVersionByFamily.set(familyId, list[0]);
}

// Strictly the LATEST version's images. If the latest version has no image
// for a side, we surface null — the caller can decide whether to fall back.
const frontImageByFamily = new Map<string, string | null>();
const rearImageByFamily = new Map<string, string | null>();
for (const [familyId, latest] of latestVersionByFamily) {
  if (latest.frontImage) frontImageByFamily.set(familyId, latest.frontImage);
  if (latest.rearImage) rearImageByFamily.set(familyId, latest.rearImage);
}

// Siblings index keyed by "categoryId|subcategory"
const siblingGroups = new Map<string, MoneyFamily[]>();
for (const f of families) {
  const key = `${f.categoryId}|${f.subcategory}`;
  const list = siblingGroups.get(key);
  if (list) list.push(f);
  else siblingGroups.set(key, [f]);
}

export function getFamilies(categoryId: number, subcategory: 'banknotes' | 'coins'): MoneyFamily[] {
  return siblingGroups.get(`${categoryId}|${subcategory}`) ?? [];
}

export function getFamily(familyId: string): MoneyFamily | undefined {
  return familyById.get(familyId);
}

export function getVersions(familyId: string): MoneyVersion[] {
  return versionsByFamily.get(familyId) ?? [];
}

export function getRearImage(familyId: string): string | null {
  return rearImageByFamily.get(familyId) ?? null;
}

/** Front image from the latest version of this family (for grid thumbnails). */
export function getFrontImage(familyId: string): string | null {
  return frontImageByFamily.get(familyId) ?? null;
}

/** The most recent version of a family, by year (nulls considered oldest). */
export function getLatestVersion(familyId: string): MoneyVersion | undefined {
  return latestVersionByFamily.get(familyId);
}

export function getSiblings(familyId: string): { prev: MoneyFamily | null; next: MoneyFamily | null } {
  const family = familyById.get(familyId);
  if (!family) return { prev: null, next: null };

  const sameCat = siblingGroups.get(`${family.categoryId}|${family.subcategory}`) ?? [];
  const idx = sameCat.findIndex((f) => f.familyId === familyId);
  return {
    prev: idx > 0 ? sameCat[idx - 1] : null,
    next: idx < sameCat.length - 1 ? sameCat[idx + 1] : null,
  };
}

/** All image URLs referenced by the data set, in priority order for preloading. */
export function getAllImageUrls(): string[] {
  const urls: string[] = [];
  // 1. Thumbnails first (visible in grids)
  for (const f of families) {
    if (f.thumbnailImage) urls.push(f.thumbnailImage);
  }
  // 2. Detail images
  for (const v of versions) {
    if (v.frontImage) urls.push(v.frontImage);
    if (v.rearImage) urls.push(v.rearImage);
  }
  // De-dup in case of shared assets
  return Array.from(new Set(urls));
}
