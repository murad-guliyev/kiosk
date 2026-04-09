export type Lang = 'az' | 'en';

export interface LocalizedText {
  az: string;
  en: string;
}

export interface MoneyFamily {
  familyId: string;
  categoryId: number;       // 1=circulation, 2=commemorative, 3=withdrawn
  subcategory: 'banknotes' | 'coins';
  title: LocalizedText;
  thumbnailImage: string;
  versionCount: number;
  sourceUrls: string[];
}

export interface KeyValueAttribute {
  label: LocalizedText;
  value: LocalizedText;
}

export interface MoneyVersion {
  versionId: string;
  familyId: string;
  title: LocalizedText;
  year: number | null;
  frontImage: string | null;
  rearImage: string | null;
  description: LocalizedText | null;
  attributes: KeyValueAttribute[];
  securityElements: LocalizedText[];
  overview: LocalizedText[];
  brochureUrl: string | null;
  sourceUrl: string;
}

export interface CategoryNode {
  id: number;
  label: LocalizedText;
  subcategories: SubcategoryNode[];
}

export interface SubcategoryNode {
  id: 'banknotes' | 'coins';
  label: LocalizedText;
}
