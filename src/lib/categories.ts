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
      az: 'Azərbaycan xalqının Ümummilli Lideri Heydər Əlirza oğlu Əliyevə həsr olunan investisiya və yubiley pul nişanları',
      en: 'Investment and jubilee coins dedicated to Heydar Aliyev',
    },
    subcategories: [
      { id: 'coins', label: { az: 'Metal pullar', en: 'Coins' } },
    ],
  },
  {
    id: 4,
    label: {
      az: 'Azərbaycan ordusunun tarixi zəfərinə və işğaldan azad edilmiş şəhər və rayonlarımıza həsr olunan xatirə pul nişanları',
      en: 'Commemorative coins dedicated to the historic victory and liberated cities',
    },
    subcategories: [
      { id: 'banknotes', label: { az: 'Kağız pullar', en: 'Banknotes' } },
      { id: 'coins', label: { az: 'Metal pullar', en: 'Coins' } },
    ],
  },
  {
    id: 5,
    label: {
      az: 'Azərbaycan Respublikasının dövlətçilik tarixinə həsr olunan yubiley və xatirə pul nişanları',
      en: 'Jubilee and commemorative coins dedicated to the history of statehood',
    },
    subcategories: [
      { id: 'coins', label: { az: 'Metal pullar', en: 'Coins' } },
    ],
  },
  {
    id: 6,
    label: {
      az: 'Əlamətdar hadisələrə həsr olunmuş yubiley və xatirə pul nişanları',
      en: 'Jubilee and commemorative coins dedicated to notable events',
    },
    subcategories: [
      { id: 'coins', label: { az: 'Metal pullar', en: 'Coins' } },
    ],
  },
  {
    id: 7,
    label: {
      az: 'İdman mövzusunda tədavülə buraxılmış yubiley və xatirə pul nişanları',
      en: 'Jubilee and commemorative coins on sports',
    },
    subcategories: [
      { id: 'coins', label: { az: 'Metal pullar', en: 'Coins' } },
    ],
  },
  {
    id: 8,
    label: {
      az: 'Mədəniyyət mövzusunda tədavülə buraxılmış yubiley və xatirə pul nişanları',
      en: 'Jubilee and commemorative coins on culture',
    },
    subcategories: [
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
