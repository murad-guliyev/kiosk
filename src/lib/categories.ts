import { CategoryNode } from './types';

export const categories: CategoryNode[] = [
  {
    id: 1,
    label: {
      az: 'Tədavüldə olan pul nişanları',
      en: 'Currency in circulation',
    },
    subcategories: [
      { id: 'banknotes', label: { az: 'Kağız pullar', en: 'Banknotes' } },
      { id: 'coins', label: { az: 'Metal pullar', en: 'Coins' } },
    ],
  },
  {
    id: 2,
    label: {
      az: 'İnvestisiya, yubiley və xatirə pul nişanları',
      en: 'Investment, jubilee and commemorative money',
    },
    subcategories: [
      { id: 'banknotes', label: { az: 'Kağız pullar', en: 'Banknotes' } },
      { id: 'coins', label: { az: 'Metal pullar', en: 'Coins' } },
    ],
  },
  {
    id: 3,
    label: {
      az: 'Tədavüldən çıxarılmış pul nişanları',
      en: 'Withdrawn from circulation',
    },
    subcategories: [
      { id: 'banknotes', label: { az: 'Kağız pullar', en: 'Banknotes' } },
      { id: 'coins', label: { az: 'Metal pullar', en: 'Coins' } },
    ],
  },
];
