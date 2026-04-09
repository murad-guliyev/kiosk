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
