import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';

interface Language {
  id: string;
  code: string;
  name: Record<string, string>;
  is_native_language_supported: boolean;
  is_target_language_supported: boolean;
}

export function useLanguageName(code: string) {
  const [languageName, setLanguageName] = useState<string>('');
  const { nativeLanguage } = useLanguage();

  useEffect(() => {
    fetchLanguageName();
  }, [code, nativeLanguage]);

  async function fetchLanguageName() {
    try {
      const { data, error } = await supabase
        .from('languages')
        .select('name')
        .eq('code', code)
        .single();

      if (error) throw error;

      if (data) {
        // Get the name in the user's native language, fallback to English if not available
        setLanguageName(data.name[nativeLanguage] || data.name.en || code.toUpperCase());
      }
    } catch (error) {
      console.error('Error fetching language name:', error);
      setLanguageName(code.toUpperCase());
    }
  }

  return languageName;
} 