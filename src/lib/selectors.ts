import familiesData from '../data/money.families.json';
import versionsData from '../data/money.versions.json';
import { MoneyFamily, MoneyVersion } from './types';

const families = familiesData as MoneyFamily[];
const versions = versionsData as MoneyVersion[];

export function getFamilies(categoryId: number, subcategory: 'banknotes' | 'coins'): MoneyFamily[] {
  return families.filter(
    (f) => f.categoryId === categoryId && f.subcategory === subcategory
  );
}

export function getFamily(familyId: string): MoneyFamily | undefined {
  return families.find((f) => f.familyId === familyId);
}

export function getVersions(familyId: string): MoneyVersion[] {
  return versions
    .filter((v) => v.familyId === familyId)
    .sort((a, b) => {
      if (a.year !== null && b.year !== null) return b.year - a.year;
      if (a.year !== null) return -1;
      if (b.year !== null) return 1;
      return 0;
    });
}

export function getRearImage(familyId: string): string | null {
  const v = versions.find((v) => v.familyId === familyId && v.rearImage);
  return v?.rearImage ?? null;
}

export function getSiblings(familyId: string): { prev: MoneyFamily | null; next: MoneyFamily | null } {
  const family = families.find((f) => f.familyId === familyId);
  if (!family) return { prev: null, next: null };

  const sameCat = families.filter(
    (f) => f.categoryId === family.categoryId && f.subcategory === family.subcategory
  );
  const idx = sameCat.findIndex((f) => f.familyId === familyId);
  return {
    prev: idx > 0 ? sameCat[idx - 1] : null,
    next: idx < sameCat.length - 1 ? sameCat[idx + 1] : null,
  };
}
