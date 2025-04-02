import { Platform } from 'react-native';
import * as Localization from 'expo-localization';

export type LanguageLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export const SUPPORTED_LANGUAGES = ['en', 'fr', 'es', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh'] as const;
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

export function isLanguageSupported(lang: string): lang is SupportedLanguage {
  return SUPPORTED_LANGUAGES.includes(lang as SupportedLanguage);
}

export function getDeviceLanguage(): SupportedLanguage {
  try {
    let deviceLang: string;
    
    if (Platform.OS === 'web') {
      // For web, try to get language from browser
      deviceLang = (navigator.language || (navigator as any).userLanguage || 'en')
        .split('-')[0]
        .toLowerCase();
    } else {
      // For native platforms, use expo-localization
      deviceLang = Localization.locale.split('-')[0].toLowerCase();
    }

    // Check if the detected language is supported
    return isLanguageSupported(deviceLang) ? deviceLang : 'en';
  } catch (error) {
    console.error('Error detecting device language:', error);
    return 'en';
  }
}

export function getDefaultTargetLanguage(nativeLang: SupportedLanguage): SupportedLanguage {
  // If native language is English, default to French, otherwise default to English
  return nativeLang === 'en' ? 'fr' : 'en';
} 