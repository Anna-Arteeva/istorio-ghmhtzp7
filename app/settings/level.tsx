import { View, Text, StyleSheet, Pressable, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { theme } from '@/theme';
import { useTranslation } from '@/hooks/useTranslation';
import { LANGUAGE_LEVELS, type LanguageLevel } from '@/lib/constants';
import { useLevel } from '@/contexts/LevelContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabase';
import { useState, useEffect } from 'react';

const LEVELS = Object.keys(LANGUAGE_LEVELS) as LanguageLevel[];

interface Language {
  id: string;
  code: string;
  name: Record<string, string>;
}

export default function LevelScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { level, setLevel } = useLevel();
  const { targetLanguage, nativeLanguage } = useLanguage();
  const [language, setLanguage] = useState<Language | null>(null);

  useEffect(() => {
    fetchLanguage();
  }, []);

  async function fetchLanguage() {
    try {
      const { data, error } = await supabase
        .from('languages')
        .select('*')
        .eq('code', targetLanguage)
        .single();

      if (error) throw error;
      if (data) setLanguage(data);
    } catch (error) {
      console.error('Error fetching language:', error);
    }
  }

  const handleSelect = async (newLevel: LanguageLevel) => {
    await setLevel(newLevel);
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft size={24} color={theme.colors.gray[900]} />
        </Pressable>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{t('onboarding.level.title')}</Text>
        <Text style={styles.subtitle}>
          {t('onboarding.level.subtitle', { 
            language: language?.name[nativeLanguage] || targetLanguage.toUpperCase()
          })}
        </Text>

        <ScrollView style={styles.optionsScroll} showsVerticalScrollIndicator={false}>
          <View style={styles.optionsContainer}>
            {LEVELS.map((levelOption) => {
              const isSelected = levelOption === level;
              const levelConfig = LANGUAGE_LEVELS[levelOption];

              return (
                <Pressable
                  key={levelOption}
                  style={[
                    styles.optionButton,
                    isSelected && styles.optionButtonSelected,
                  ]}
                  onPress={() => handleSelect(levelOption)}
                >
                  <View style={styles.optionContent}>
                    <View
                      style={[
                        styles.levelBadge,
                        { backgroundColor: levelConfig.color },
                      ]}
                    >
                      <Text
                        style={[
                          styles.levelCode,
                          { color: levelConfig.textColor },
                        ]}
                      >
                        {levelOption}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.optionTitle,
                        isSelected && styles.optionTitleSelected,
                      ]}
                      numberOfLines={2}
                    >
                      {t(`onboarding.level.levels.${levelOption}`)}
                    </Text>
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
  levelBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
    minWidth: 40,
    alignItems: 'center',
  },
  levelCode: {
    ...theme.typography.caption,
    fontFamily: 'Montserrat-SemiBold',
  },
  optionTitle: {
    ...theme.typography.body1,
    color: theme.colors.gray[800],
    flex: 1,
    flexWrap: 'wrap',
  },
  optionTitleSelected: {
    color: theme.colors.primary[500],
    fontFamily: 'Montserrat-SemiBold',
  },
});