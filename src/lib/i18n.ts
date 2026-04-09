import { LocalizedText, Lang } from './types';

const uiStrings: Record<string, LocalizedText> = {
  appTitle: {
    az: 'Pul Nişanları Kataloqu',
    en: 'Currency Catalog',
  },
  backToList: {
    az: 'Geri',
    en: 'Back',
  },
  versions: {
    az: 'versiya',
    en: 'version(s)',
  },
  securityElements: {
    az: 'Mühafizə elementləri',
    en: 'Security Elements',
  },
  brochure: {
    az: 'Broşüra',
    en: 'Brochure',
  },
  front: {
    az: 'Üz tərəf',
    en: 'Front',
  },
  rear: {
    az: 'Arxa tərəf',
    en: 'Rear',
  },
  noItems: {
    az: 'Bu kateqoriyada element tapılmadı',
    en: 'No items found in this category',
  },
  specifications: {
    az: 'Texniki xüsusiyyətlər',
    en: 'Specifications',
  },
  itemCount: {
    az: 'element',
    en: 'items',
  },
  itemNotFound: {
    az: 'Element tapılmadı',
    en: 'Item not found',
  },
  previous: {
    az: 'Əvvəlki',
    en: 'Previous',
  },
  next: {
    az: 'Növbəti',
    en: 'Next',
  },
  bankSubtitle: {
    az: 'Azərbaycan Respublikasının Mərkəzi Bankı',
    en: 'Central Bank of Azerbaijan',
  },
};

export function t(key: string, lang: Lang): string {
  const entry = uiStrings[key];
  if (!entry) return key;
  return entry[lang] || entry.az;
}

export function localized(text: LocalizedText | null | undefined, lang: Lang): string {
  if (!text) return '';
  return text[lang] || text.az || '';
}
