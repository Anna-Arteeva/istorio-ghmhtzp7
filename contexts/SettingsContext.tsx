import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingsContextType {
  showTranslationsByDefault: boolean;
  setShowTranslationsByDefault: (value: boolean) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const STORAGE_KEYS = {
  SHOW_TRANSLATIONS: '@settings_show_translations',
};

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [showTranslationsByDefault, setShowTranslationsByDefaultState] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const storedValue = await AsyncStorage.getItem(STORAGE_KEYS.SHOW_TRANSLATIONS);
      if (storedValue !== null) {
        setShowTranslationsByDefaultState(storedValue === 'true');
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

  return (
    <SettingsContext.Provider
      value={{
        showTranslationsByDefault,
        setShowTranslationsByDefault,
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