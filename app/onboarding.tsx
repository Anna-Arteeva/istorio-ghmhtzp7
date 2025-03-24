import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLevel } from '@/contexts/LevelContext';
import { useTranslation } from '@/hooks/useTranslation';
import { nativeLanguageLabels } from '@/lib/languageLabels';
import { supabase } from '@/lib/supabase';
import { theme } from '@/theme';
import { ChevronLeft, Check } from 'lucide-react-native';
import { LANGUAGE_LEVELS, type LanguageLevel } from '@/lib/constants';
import * as Icons from '@/components/CustomIcons';

interface Language {
  id: string;
  code: string;
  name: Record<string, string>;
  is_native_language_supported: boolean;
  is_target_language_supported: boolean;
}

type Step = 'native' | 'target' | 'level';
const LEVELS = Object.keys(LANGUAGE_LEVELS) as LanguageLevel[];

export default function OnboardingScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const {
    nativeLanguage,
    targetLanguage,
    setNativeLanguage,
    setTargetLanguage,
    setHasCompletedOnboarding,
  } = useLanguage();
  const { setLevel } = useLevel();
  const [currentStep, setCurrentStep] = useState<Step>('native');
  const [languages, setLanguages] = useState<Language[]>([]);

  if (languages.length === 0) {
    supabase
      .from('languages')
      .select('*')
      .order('name->en', { ascending: true })
      .then(({ data, error }) => {
        if (!error && data) {
          setLanguages(data);
        }
      });
  }

  const handleNext = async () => {
    if (currentStep === 'native') {
      setCurrentStep('target');
    } else if (currentStep === 'target') {
      setCurrentStep('level');
    }
  };

  const handleBack = () => {
    if (currentStep === 'target') {
      setCurrentStep('native');
    } else if (currentStep === 'level') {
      setCurrentStep('target');
    }
  };

  const filteredLanguages = languages.filter((lang) => {
    if (currentStep === 'target') return lang.is_target_language_supported;
    if (currentStep === 'native') return lang.is_native_language_supported;
    return true;
  });

  const renderLanguageButton = (language: Language) => {
    const isSelected =
      currentStep === 'native'
        ? language.code === nativeLanguage
        : language.code === targetLanguage;

    const handleSelect = () => {
      if (currentStep === 'native') {
        setNativeLanguage(language.code);
      } else {
        setTargetLanguage(language.code);
      }
      handleNext();
    };

    const IconComponent = (Icons as any)[language.code.toLowerCase()];

    return (
      <Pressable
        key={language.code}
        style={[
          styles.optionButton,
          isSelected && styles.optionButtonSelected,
        ]}
        onPress={handleSelect}
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
              {currentStep === 'native'
                ? nativeLanguageLabels[
                    language.code as keyof typeof nativeLanguageLabels
                  ]
                : language.name[nativeLanguage || 'en']}
            </Text>
          </View>
        </View>
      </Pressable>
    );
  };

  const renderLevelButton = (level: LanguageLevel) => {
    const levelConfig = LANGUAGE_LEVELS[level];

    const handleLevelSelect = async () => {
      await setLevel(level);
      await setHasCompletedOnboarding(true);
      router.replace('/(tabs)');
    };

    return (
      <Pressable
        key={level}
        style={styles.optionButton}
        onPress={handleLevelSelect}
      >
        <View style={styles.optionContent}>
          <View
            style={[styles.levelBadge, { backgroundColor: levelConfig.color }]}
          >
            <Text style={[styles.levelCode, { color: levelConfig.textColor }]}>
              {level}
            </Text>
          </View>
          <Text style={styles.optionTitle} numberOfLines={2}>
            {t(`onboarding.level.levels.${level}`)}
          </Text>
        </View>
      </Pressable>
    );
  };

  const getSubtitle = () => {
    if (currentStep === 'level') {
      return t('onboarding.level.subtitle', { 
        language: languages.find(l => l.code === targetLanguage)?.name[nativeLanguage] || '' 
      });
    }
    return currentStep === 'native'
      ? t('onboarding.nativeLanguage.subtitle')
      : t('onboarding.targetLanguage.subtitle');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {currentStep !== 'native' && (
          <Pressable onPress={handleBack} style={styles.backButton}>
            <ChevronLeft size={24} color={theme.colors.gray[900]} />
          </Pressable>
        )}
        <View style={styles.progress}>
          <View
            style={[
              styles.progressBar,
              {
                width: `${
                  currentStep === 'native'
                    ? 33
                    : currentStep === 'target'
                    ? 66
                    : 100
                }%`,
              },
            ]}
          />
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>
          {currentStep === 'level'
            ? t('onboarding.level.title')
            : currentStep === 'native'
            ? t('onboarding.nativeLanguage.title')
            : t('onboarding.targetLanguage.title')}
        </Text>
        <Text style={styles.subtitle}>
          {getSubtitle()}
        </Text>

        <ScrollView
          style={styles.optionsScroll}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.optionsContainer}>
            {currentStep !== 'level'
              ? filteredLanguages.map(renderLanguageButton)
              : LEVELS.map(renderLevelButton)}
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
  },
  backButton: {
    marginBottom: 24,
    width: 40,
    height: 40,
    borderRadius: theme.spacing.sm,
    backgroundColor: theme.colors.gray[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  progress: {
    height: 4,
    backgroundColor: theme.colors.gray[100],
    borderRadius: theme.borderRadius.full,
    marginBottom: theme.spacing.xl,
  },
  progressBar: {
    height: '100%',
    backgroundColor: theme.colors.primary[500],
    borderRadius: theme.borderRadius.full,
    transition: 'width 0.3s ease-in-out',
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
  levelBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
  },
  levelCode: {
    ...theme.typography.caption,
    fontFamily: 'Montserrat-SemiBold',
  },
});