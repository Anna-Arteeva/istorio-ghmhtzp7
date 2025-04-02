import { View, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLevel } from '@/contexts/LevelContext';
import { useTranslation } from '@/hooks/useTranslation';
import { theme, useTheme } from '@/theme';
import { LanguageSelectionScreen } from '@/components/shared/LanguageSelectionScreen';
import { LevelSelectionScreen } from '@/components/shared/LevelSelectionScreen';
import { getDeviceLanguage, isLanguageSupported } from '@/utils/languageUtils';
import { Localization } from 'expo-localization';

type Step = 'native' | 'target' | 'level';

export default function OnboardingScreen() {
  const currentTheme = useTheme();
  const router = useRouter();
  const { t } = useTranslation();
  const {
    nativeLanguage,
    targetLanguage,
    setNativeLanguage,
    setTargetLanguage,
    setHasCompletedOnboarding,
  } = useLanguage();
  const { level, setLevel } = useLevel();
  const [currentStep, setCurrentStep] = useState<Step>('native');

  const deviceLang = getDeviceLanguage();
  const defaultNative = isLanguageSupported(deviceLang) ? deviceLang : 'en';
  const defaultTarget = defaultNative === 'en' ? 'fr' : 'en';

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

  const handleLanguageSelect = async (code: string) => {
    if (currentStep === 'native') {
      await setNativeLanguage(code);
    } else {
      await setTargetLanguage(code);
    }
    handleNext();
  };

  const handleLevelSelect = async (newLevel: LanguageLevel) => {
    await setLevel(newLevel);
    await setHasCompletedOnboarding(true);
    router.replace('/(tabs)');
  };

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.colors.white }]}>
      <View style={styles.header}>
        {currentStep !== 'native' && (
          <View style={[styles.progress, { backgroundColor: currentTheme.colors.gray[100] }]}>
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
                  backgroundColor: currentTheme.colors.primary[500],
                },
              ]}
            />
          </View>
        )}
      </View>

      {currentStep === 'native' && (
        <LanguageSelectionScreen
          type="native"
          onSelect={handleLanguageSelect}
          showBackButton={false}
          isOnboarding={true}
          selectedCode={nativeLanguage}
        />
      )}

      {currentStep === 'target' && (
        <LanguageSelectionScreen
          type="target"
          onSelect={handleLanguageSelect}
          onBack={handleBack}
          isOnboarding={true}
          selectedCode={targetLanguage}
        />
      )}

      {currentStep === 'level' && (
        <LevelSelectionScreen
          onSelect={handleLevelSelect}
          onBack={handleBack}
          isOnboarding={true}
          selectedLevel={level}
        />
      )}
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
  },
  progress: {
    height: 4,
    borderRadius: theme.borderRadius.full,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: theme.borderRadius.full,
  },
});

function getDeviceLanguage(): string {
  try {
    if (Platform.OS === 'web') {
      const browserLang = navigator.language || (navigator as any).userLanguage;
      return browserLang.slice(0, 2).toLowerCase();
    }
    // Get the device locale using expo-localization
    const locale = Localization.locale;
    return locale.split('-')[0].toLowerCase();
  } catch (error) {
    console.error('Error detecting device language:', error);
    return 'en';
  }
}