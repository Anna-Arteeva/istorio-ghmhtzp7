import React from 'react';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

type ThemePreference = 'system' | 'light' | 'dark';

interface SettingsContextType {
  showTranslationsByDefault: boolean;
  setShowTranslationsByDefault: (value: boolean) => Promise<void>;
  themePreference: ThemePreference;
  setThemePreference: (value: ThemePreference) => Promise<void>;
  currentTheme: 'light' | 'dark';
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const STORAGE_KEYS = {
  SHOW_TRANSLATIONS: '@settings_show_translations',
  THEME_PREFERENCE: '@settings_theme_preference',
};

export function SettingsProvider({ children }: { children: ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [showTranslationsByDefault, setShowTranslationsByDefaultState] = useState(true);
  const [themePreference, setThemePreferenceState] = useState<ThemePreference>('system');

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const [translationsValue, themeValue] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.SHOW_TRANSLATIONS),
        AsyncStorage.getItem(STORAGE_KEYS.THEME_PREFERENCE),
      ]);

      if (translationsValue !== null) {
        setShowTranslationsByDefaultState(translationsValue === 'true');
      }
      
      if (themeValue !== null) {
        console.log('Loaded theme preference:', themeValue);
        setThemePreferenceState(themeValue as ThemePreference);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }

  async function setShowTranslationsByDefault(value: boolean) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SHOW_TRANSLATIONS, String(value));
      setShowTranslationsByDefaultState(value);
    } catch (error) {
      console.error('Error saving setting:', error);
    }
  }

  async function setThemePreference(value: ThemePreference) {
    try {
      console.log('Setting theme preference to:', value);
      await AsyncStorage.setItem(STORAGE_KEYS.THEME_PREFERENCE, value);
      setThemePreferenceState(value);
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  }

  // Determine the current theme based on preference and system setting
  const currentTheme = themePreference === 'system' 
    ? (systemColorScheme || 'light')
    : themePreference;

  console.log('Theme debug:', { 
    systemColorScheme, 
    themePreference, 
    currentTheme 
  });

  return (
    <SettingsContext.Provider
      value={{
        showTranslationsByDefault,
        setShowTranslationsByDefault,
        themePreference,
        setThemePreference,
        currentTheme,
      }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}