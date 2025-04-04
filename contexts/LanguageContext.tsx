import React from 'react';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import * as Localization from 'expo-localization';

interface LanguageContextType {
  nativeLanguage: string;
  targetLanguage: string;
  setNativeLanguage: (lang: string) => Promise<void>;
  setTargetLanguage: (lang: string) => Promise<void>;
  isLanguageSelected: boolean;
  hasCompletedOnboarding: boolean | undefined;
  setHasCompletedOnboarding: (completed: boolean) => Promise<void>;
  resetOnboarding: () => Promise<void>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEYS = {
  NATIVE_LANGUAGE: '@language_native',
  TARGET_LANGUAGE: '@language_target',
  HAS_COMPLETED_ONBOARDING: '@onboarding_completed'
};

function getDeviceLanguage(): string {
  try {
    if (Platform.OS === 'web') {
      const browserLang = navigator.language || (navigator as any).userLanguage;
      return browserLang.slice(0, 2).toLowerCase();
    }
    // Get the device locale using expo-localization
    const locale = Localization.locale;
    return locale.split('-')[0].toLowerCase();
  } catch (error) {
    console.error('Error detecting device language:', error);
    return 'en';
  }
}

function isLanguageSupported(lang: string): boolean {
  const supportedLanguages = ['en', 'de', 'ru', 'es', 'it', 'pt', 'fr', 'nl', 'ua'];
  return supportedLanguages.includes(lang.toLowerCase());
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [nativeLanguage, setNativeLanguageState] = useState('en');
  const [targetLanguage, setTargetLanguageState] = useState('fr');
  const [hasCompletedOnboarding, setHasCompletedOnboardingState] = useState<boolean | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLanguageSettings();
  }, []);

  async function loadLanguageSettings() {
    try {
      setIsLoading(true);
      const [storedNative, storedTarget, completedOnboarding] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.NATIVE_LANGUAGE),
        AsyncStorage.getItem(STORAGE_KEYS.TARGET_LANGUAGE),
        AsyncStorage.getItem(STORAGE_KEYS.HAS_COMPLETED_ONBOARDING),
      ]);

      if (completedOnboarding === 'true' && storedNative && storedTarget) {
        setHasCompletedOnboardingState(true);
        setNativeLanguageState(storedNative);
        setTargetLanguageState(storedTarget);
      } else {
        const deviceLang = getDeviceLanguage();
        const defaultNative = isLanguageSupported(deviceLang) ? deviceLang : 'en';
        const defaultTarget = defaultNative === 'en' ? 'fr' : 'en';

        setNativeLanguageState(defaultNative);
        setTargetLanguageState(defaultTarget);
        setHasCompletedOnboardingState(false);
      }
    } catch (error) {
      console.error('Error loading language settings:', error);
      setNativeLanguageState('en');
      setTargetLanguageState('fr');
      setHasCompletedOnboardingState(false);
    } finally {
      setIsLoading(false);
    }
  }

  async function setNativeLanguage(lang: string) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.NATIVE_LANGUAGE, lang);
      setNativeLanguageState(lang);
    } catch (error) {
      console.error('Error saving native language:', error);
    }
  }

  async function setTargetLanguage(lang: string) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.TARGET_LANGUAGE, lang);
      setTargetLanguageState(lang);
    } catch (error) {
      console.error('Error saving target language:', error);
    }
  }

  async function setHasCompletedOnboarding(completed: boolean) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.HAS_COMPLETED_ONBOARDING, String(completed));
      setHasCompletedOnboardingState(completed);
    } catch (error) {
      console.error('Error saving onboarding status:', error);
    }
  }

  async function resetOnboarding() {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.HAS_COMPLETED_ONBOARDING,
        STORAGE_KEYS.NATIVE_LANGUAGE,
        STORAGE_KEYS.TARGET_LANGUAGE
      ]);
      setHasCompletedOnboardingState(false);
      
      const deviceLang = getDeviceLanguage();
      const defaultNative = isLanguageSupported(deviceLang) ? deviceLang : 'en';
      const defaultTarget = defaultNative === 'en' ? 'fr' : 'en';
      
      setNativeLanguageState(defaultNative);
      setTargetLanguageState(defaultTarget);
    } catch (error) {
      console.error('Error resetting onboarding:', error);
    }
  }

  if (isLoading) {
    return null;
  }

  return (
    <LanguageContext.Provider
      value={{
        nativeLanguage,
        targetLanguage,
        setNativeLanguage,
        setTargetLanguage,
        isLanguageSelected: Boolean(hasCompletedOnboarding),
        hasCompletedOnboarding,
        setHasCompletedOnboarding,
        resetOnboarding,
      }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}