import React from 'react';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';

export interface SavedPhrase {
  id: string;
}

interface SavedPhrasesContextType {
  savedPhrases: string[];
  addPhrase: (id: string) => Promise<void>;
  removePhrase: (id: string) => Promise<void>;
  isPhraseSaved: (id: string) => boolean;
}

const SavedPhrasesContext = createContext<SavedPhrasesContextType | undefined>(undefined);

const STORAGE_KEY = '@saved_phrases';

export function SavedPhrasesProvider({ children }: { children: ReactNode }) {
  const [savedPhrases, setSavedPhrases] = useState<string[]>([]);

  useEffect(() => {
    loadSavedPhrases();
  }, []);

  async function loadSavedPhrases() {
    try {
      const storedPhrases = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedPhrases) {
        setSavedPhrases(JSON.parse(storedPhrases));
      }
    } catch (error) {
      console.error('Error loading saved phrases:', error);
    }
  }

  async function addPhrase(id: string) {
    try {
      const updatedPhrases = [...savedPhrases, id];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPhrases));
      setSavedPhrases(updatedPhrases);
    } catch (error) {
      console.error('Error saving phrase:', error);
    }
  }

  async function removePhrase(id: string) {
    try {
      const updatedPhrases = savedPhrases.filter(phraseId => phraseId !== id);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPhrases));
      setSavedPhrases(updatedPhrases);
    } catch (error) {
      console.error('Error removing phrase:', error);
    }
  }

  function isPhraseSaved(id: string) {
    return savedPhrases.includes(id);
  }

  return (
    <SavedPhrasesContext.Provider
      value={{
        savedPhrases,
        addPhrase,
        removePhrase,
        isPhraseSaved,
      }}>
      {children}
    </SavedPhrasesContext.Provider>
  );
}

export function useSavedPhrases() {
  const context = useContext(SavedPhrasesContext);
  if (context === undefined) {
    throw new Error('useSavedPhrases must be used within a SavedPhrasesProvider');
  }
  return context;
}