import { useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

// Import all locale files
const locales: Record<string, any> = {
  en: require('@/locales/en.json'),
  de: require('@/locales/de.json'),
  es: require('@/locales/es.json'),
  fr: require('@/locales/fr.json'),
  it: require('@/locales/it.json'),
  nl: require('@/locales/nl.json'),
  pt: require('@/locales/pt.json'),
  ru: require('@/locales/ru.json'),
  ua: require('@/locales/ua.json')
};

type TranslateFunction = (key: string, params?: Record<string, string>) => string;

export function useTranslation(): { t: TranslateFunction } {
  const { nativeLanguage } = useLanguage();

  const t: TranslateFunction = useCallback((key: string, params?: Record<string, string>) => {
    try {
      // Get the translations for the current language, fallback to English
      const translations = locales[nativeLanguage] || locales.en;

      // Split the key by dots and traverse the translations object
      const value = key.split('.').reduce((obj, k) => obj?.[k], translations);

      if (typeof value === 'string') {
        if (!params) return value;

        // Replace parameters in the string
        return Object.entries(params).reduce(
          (str, [key, value]) => str.replace(`{${key}}`, value),
          value
        );
      }

      // If translation is not found, return the key and try English fallback
      if (nativeLanguage !== 'en') {
        const englishValue = key.split('.').reduce((obj, k) => obj?.[k], locales.en);
        if (typeof englishValue === 'string') {
          if (!params) return englishValue;
          return Object.entries(params).reduce(
            (str, [key, value]) => str.replace(`{${key}}`, value),
            englishValue
          );
        }
      }

      console.warn(`Translation not found for key: ${key}`);
      return key;
    } catch (error) {
      console.error('Translation error:', error);
      return key;
    }
  }, [nativeLanguage]);

  return { t };
}