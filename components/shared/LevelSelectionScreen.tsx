import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Platform } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { theme, useTheme } from '@/theme';
import { useTranslation } from '@/hooks/useTranslation';
import { useLanguage } from '@/contexts/LanguageContext';
import { LANGUAGE_LEVELS, type LanguageLevel } from '@/lib/constants';
import { useLanguageName } from '@/hooks/useLanguageName';

interface LevelSelectionScreenProps {
  onSelect: (level: LanguageLevel) => void;
  onBack?: () => void;
  showBackButton?: boolean;
  isOnboarding?: boolean;
  selectedLevel?: LanguageLevel;
}

const LEVELS = Object.keys(LANGUAGE_LEVELS) as LanguageLevel[];

export function LevelSelectionScreen({
  onSelect,
  onBack,
  showBackButton = true,
  isOnboarding = false,
  selectedLevel,
}: LevelSelectionScreenProps) {
  const currentTheme = useTheme();
  const { t } = useTranslation();
  const { targetLanguage } = useLanguage();
  const languageName = useLanguageName(targetLanguage);

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
          {t('onboarding.level.title')}
        </Text>
        <Text style={[styles.subtitle, { color: currentTheme.colors.gray[500] }]}>
          {t('onboarding.level.subtitle', { 
            language: languageName
          })}
        </Text>

        <ScrollView
          style={styles.optionsScroll}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.optionsContainer, { 
                      borderColor: currentTheme.colors.gray[200],
                    }]}>
            {LEVELS.map((level) => {
              const levelConfig = LANGUAGE_LEVELS[level];
              const isSelected = level === selectedLevel;
              
              return (
                <Pressable
                  key={level}
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
                  onPress={() => onSelect(level)}
                >
                  <View style={styles.optionContent}>
                    <View
                      style={[styles.levelBadge, { backgroundColor: levelConfig.color }]}
                    >
                      <Text style={[styles.levelCode, { color: levelConfig.textColor }]}>
                        {level}
                      </Text>
                    </View>
                    <Text 
                      style={[
                        styles.optionTitle, 
                        { color: currentTheme.colors.gray[800] },
                        isSelected && { 
                          color: currentTheme.colors.primary[500],
                          fontFamily: 'Montserrat-SemiBold',
                        }
                      ]} 
                      numberOfLines={2}
                    >
                      {t(`onboarding.level.levels.${level}`)}
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
    paddingBottom: theme.spacing.xl,
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
    flex: 1,
    flexWrap: 'wrap',
  },
}); 