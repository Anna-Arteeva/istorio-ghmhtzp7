import { View, Text, StyleSheet, Pressable, ScrollView, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { theme } from '@/theme';
import { useLanguage } from '@/contexts/LanguageContext';
import { nativeLanguageLabels } from '@/lib/languageLabels';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import * as Icons from '@/components/CustomIcons';
import { useTranslation } from '@/hooks/useTranslation';

interface Language {
  id: string;
  code: string;
  name: Record<string, string>;
  is_native_language_supported: boolean;
  is_target_language_supported: boolean;
}

export default function LanguageScreen() {
  const router = useRouter();
  const { type } = useLocalSearchParams();
  const { t } = useTranslation();
  const {
    nativeLanguage,
    targetLanguage,
    setNativeLanguage,
    setTargetLanguage,
  } = useLanguage();
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

  const handleSelect = async (code: string) => {
    if (type === 'native') {
      await setNativeLanguage(code);
    } else {
      await setTargetLanguage(code);
    }
    router.back();
  };

  const selectedCode = type === 'native' ? nativeLanguage : targetLanguage;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft size={24} color={theme.colors.gray[900]} />
        </Pressable>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>
          {t(
            type === 'native'
              ? 'onboarding.nativeLanguage.title'
              : 'onboarding.targetLanguage.title'
          )}
        </Text>
        <Text style={styles.subtitle}>
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
          <View style={styles.optionsContainer}>
            {filteredLanguages.map((language) => {
              const IconComponent = (Icons as any)[language.code.toLowerCase()];
              const isSelected = language.code === selectedCode;

              return (
                <Pressable
                  key={language.code}
                  style={[
                    styles.optionButton,
                    isSelected && styles.optionButtonSelected,
                  ]}
                  onPress={() => handleSelect(language.code)}
                >
                  <View style={styles.optionContent}>
                    {IconComponent && (
                      <View style={styles.iconContainer}>
                        <IconComponent size={24} color={theme.colors.gray[800]} />
                      </View>
                    )}
                    <View style={styles.optionTextContent}>
                      <Text
                        style={[
                          styles.optionTitle,
                          isSelected && styles.optionTitleSelected,
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
    backgroundColor: theme.colors.white,
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
    backgroundColor: theme.colors.gray[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  title: {
    ...theme.typography.heading1,
    color: theme.colors.gray[900],
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    ...theme.typography.body1,
    color: theme.colors.gray[500],
    marginBottom: theme.spacing.xl,
  },
  optionsScroll: {
    flex: 1,
  },
  optionsContainer: {
    paddingBottom: theme.spacing.xl,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.gray[200],
  },
  optionButtonSelected: {
    borderColor: theme.colors.primary[500],
    backgroundColor: theme.colors.gray[50],
  },
  optionContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionTextContent: {
    flex: 1,
  },
  optionTitle: {
    ...theme.typography.body1,
    color: theme.colors.gray[800],
    flexWrap: 'wrap',
  },
  optionTitleSelected: {
    color: theme.colors.primary[500],
    fontFamily: 'Montserrat-SemiBold',
  },
});