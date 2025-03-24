import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { type LanguageLevel } from '@/lib/constants';

interface LevelContextType {
  level: LanguageLevel;
  setLevel: (level: LanguageLevel) => Promise<void>;
}

const LevelContext = createContext<LevelContextType | undefined>(undefined);

const STORAGE_KEY = '@user_level';

export function LevelProvider({ children }: { children: ReactNode }) {
  const [level, setLevelState] = useState<LanguageLevel>('A1');

  useEffect(() => {
    loadLevel();
  }, []);

  async function loadLevel() {
    try {
      const storedLevel = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedLevel && ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].includes(storedLevel)) {
        setLevelState(storedLevel as LanguageLevel);
      }
    } catch (error) {
      console.error('Error loading level:', error);
    }
  }

  async function setLevel(newLevel: LanguageLevel) {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, newLevel);
      setLevelState(newLevel);
    } catch (error) {
      console.error('Error saving level:', error);
    }
  }

  return (
    <LevelContext.Provider value={{ level, setLevel }}>
      {children}
    </LevelContext.Provider>
  );
}

export function useLevel() {
  const context = useContext(LevelContext);
  if (context === undefined) {
    throw new Error('useLevel must be used within a LevelProvider');
  }
  return context;
}