import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Platform } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { theme, useTheme } from '@/theme';
import { useTranslation } from '@/hooks/useTranslation';
import { useLanguage } from '@/contexts/LanguageContext';
import { nativeLanguageLabels } from '@/lib/languageLabels';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { LanguageIcon } from '@/components/LanguageIcon';

interface Language {
  id: string;
  code: string;
  name: Record<string, string>;
  is_native_language_supported: boolean;
  is_target_language_supported: boolean;
}

interface LanguageSelectionScreenProps {
  type: 'native' | 'target';
  onSelect: (code: string) => void;
  onBack?: () => void;
  showBackButton?: boolean;
  isOnboarding?: boolean;
  selectedCode?: string;
}

export function LanguageSelectionScreen({
  type,
  onSelect,
  onBack,
  showBackButton = true,
  isOnboarding = false,
  selectedCode,
}: LanguageSelectionScreenProps) {
  const currentTheme = useTheme();
  const { t } = useTranslation();
  const { nativeLanguage } = useLanguage();
  const [languages, setLanguages] = useState<Language[]>([]);

  useEffect(() => {
    fetchLanguages();
  }, []);

  async function fetchLanguages() {
    try {
      const { data, error } = await supabase
        .from('languages')
        .select('*')
        .order('name->en', { ascending: true });

      if (error) throw error;
      if (data) setLanguages(data);
    } catch (error) {
      console.error('Error fetching languages:', error);
    }
  }

  const filteredLanguages = languages.filter((lang) => {
    if (type === 'native') return lang.is_native_language_supported;
    if (type === 'target') return lang.is_target_language_supported;
    return true;
  });

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.colors.white }]}>
      <View style={styles.header}>
        {showBackButton && onBack && (
          <Pressable 
            style={[styles.backButton, { backgroundColor: currentTheme.colors.gray[50] }]} 
            onPress={onBack}
          >
            <ChevronLeft size={24} color={currentTheme.colors.gray[900]} />
          </Pressable>
        )}
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, { color: currentTheme.colors.gray[900] }]}>
          {t(
            type === 'native'
              ? 'onboarding.nativeLanguage.title'
              : 'onboarding.targetLanguage.title'
          )}
        </Text>
        <Text style={[styles.subtitle, { color: currentTheme.colors.gray[500] }]}>
          {t(
            type === 'native'
              ? 'onboarding.nativeLanguage.subtitle'
              : 'onboarding.targetLanguage.subtitle'
          )}
        </Text>

        <ScrollView
          style={styles.optionsScroll}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.optionsContainer, { 
                      borderColor: currentTheme.colors.gray[200],
                    }]}>
            {filteredLanguages.map((language) => {
              const isSelected = language.code === selectedCode;

              return (
                <Pressable
                  key={language.code}
                  style={[
                    styles.optionButton,
                    { 
                      borderColor: currentTheme.colors.gray[200],
                    },
                    isSelected && { 
                      borderColor: currentTheme.colors.primary[500],
                      backgroundColor: currentTheme.colors.gray[50],
                    }
                  ]}
                  onPress={() => onSelect(language.code)}
                >
                  <View style={styles.optionContent}>
                    <View style={[styles.iconContainer]}>
                      <LanguageIcon 
                        language={language.code} 
                        size={18} 
                        color={isSelected 
                          ? currentTheme.colors.primary[500] 
                          : currentTheme.colors.gray[800]
                        } 
                      />
                    </View>
                    <View style={styles.optionTextContent}>
                      <Text
                        style={[
                          styles.optionTitle,
                          { color: currentTheme.colors.gray[800] },
                          isSelected && { 
                            color: currentTheme.colors.primary[500],
                            fontFamily: 'Montserrat-SemiBold',
                          }
                        ]}
                      >
                        {type === 'native'
                          ? nativeLanguageLabels[
                              language.code as keyof typeof nativeLanguageLabels
                            ]
                          : language.name[nativeLanguage]}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 48 : 24,
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: theme.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  title: {
    ...theme.typography.heading1,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    ...theme.typography.body1,
    marginBottom: theme.spacing.xl,
  },
  optionsScroll: {
    flex: 1,
  },
  optionsContainer: {
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderBottomWidth: 1,
  },
  optionContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  iconContainer: {
  },
  optionTextContent: {
    flex: 1,
  },
  optionTitle: {
    ...theme.typography.body1,
    flexWrap: 'wrap',
  },
}); 