import type { Dictionary } from '@/context/LanguageContext';

const dictionaries: Record<string, () => Promise<Dictionary>> = {
  en: () => import('@/lib/dictionaries/en.json').then((module) => module.default as Dictionary),
  hi: () => import('@/lib/dictionaries/hi.json').then((module) => module.default as Dictionary),
};

export const getDictionary = async (locale: string): Promise<Dictionary> => {
  return dictionaries[locale] ? await dictionaries[locale]() : await dictionaries.en();
};
