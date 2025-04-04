import React from 'react';
import { View, Text, StyleSheet, Platform, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { theme, useTheme } from '@/theme';
import { useLanguage } from '@/contexts/LanguageContext';
import { SettingsItem } from '@/components/SettingsItem';
import { useTranslation } from '@/hooks/useTranslation';
import { CloseButton } from '@/components/CloseButton';
import { useLevel } from '@/contexts/LevelContext';
import { useVisits } from '@/contexts/VisitContext';
import { useSettings } from '@/contexts/SettingsContext';
import { useState, useEffect } from 'react';

export default function SettingsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const currentTheme = useTheme();
  const { nativeLanguage, targetLanguage, resetOnboarding } = useLanguage();
  const { level } = useLevel();
  const { firstVisit } = useVisits();
  const { 
    showTranslationsByDefault, 
    setShowTranslationsByDefault,
    themePreference,
    setThemePreference,
  } = useSettings();
  const [hasChanges, setHasChanges] = useState(false);
  const [initialSettings, setInitialSettings] = useState({
    showTranslationsByDefault: showTranslationsByDefault,
    themePreference: themePreference,
  });

  useEffect(() => {
    setInitialSettings({
      showTranslationsByDefault,
      themePreference,
    });
  }, []);

  useEffect(() => {
    const settingsChanged = 
      initialSettings.showTranslationsByDefault !== showTranslationsByDefault ||
      initialSettings.themePreference !== themePreference;
    
    setHasChanges(settingsChanged);
  }, [showTranslationsByDefault, themePreference, initialSettings]);

  const handleRestartOnboarding = async () => {
    await resetOnboarding();
    router.push('/onboarding');
  };

  const toggleTranslations = async () => {
    await setShowTranslationsByDefault(!showTranslationsByDefault);
  };

  const cycleTheme = async () => {
    const themes: Array<'system' | 'light' | 'dark'> = ['system', 'light', 'dark'];
    const currentIndex = themes.indexOf(themePreference);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    await setThemePreference(nextTheme);
  };

  const getThemeLabel = (theme: 'system' | 'light' | 'dark') => {
    switch (theme) {
      case 'system':
        return t('settings.app.theme.system');
      case 'light':
        return t('settings.app.theme.light');
      case 'dark':
        return t('settings.app.theme.dark');
    }
  };

  const handleApply = () => {
    if (hasChanges) {
      // Reload the app by navigating to the root
      router.replace('/(tabs)');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.colors.white }]}>
      <View style={[styles.header, { backgroundColor: currentTheme.colors.white }]}>
        <Text style={[styles.title, { color: currentTheme.colors.gray[900] }]}>
          {t('settings.sections.language')}
        </Text>
        <View style={styles.headerActions}>
          {hasChanges && (
            <Pressable 
              style={[styles.applyButton, { backgroundColor: currentTheme.colors.primary[500] }]}
              onPress={handleApply}
            >
              <Text style={[styles.applyButtonText, { color: currentTheme.colors.white }]}>
                Apply
              </Text>
            </Pressable>
          )}
          <CloseButton onPress={() => router.back()} />
        </View>
      </View>

      <View style={[styles.section, { 
        backgroundColor: currentTheme.colors.cardBackground,
        borderColor: currentTheme.colors.gray[200],
      }]}>
        <SettingsItem
          label={t('settings.language.native')}
          value={nativeLanguage.toUpperCase()}
          icon={nativeLanguage.toLowerCase()}
          onPress={() => router.push('/settings/language?type=native')}
        />
        <SettingsItem
          label={t('settings.language.target')}
          value={targetLanguage.toUpperCase()}
          icon={targetLanguage.toLowerCase()}
          onPress={() => router.push('/settings/language?type=target')}
        />
        <SettingsItem
          label={t('settings.level.title')}
          value={level}
          onPress={() => router.push('/settings/level')}
        />
      </View>

      <View style={[styles.section, { 
        backgroundColor: currentTheme.colors.cardBackground,
        borderColor: currentTheme.colors.gray[200],
      }]}>
        <SettingsItem
          label={t('settings.app.theme.title')}
          value={getThemeLabel(themePreference)}
          onPress={cycleTheme}
          showUpDownChevron={true}
        />
        <SettingsItem
          label={t('settings.app.translations.title')}
          value={showTranslationsByDefault ? t('settings.app.translations.on') : t('settings.app.translations.off')}
          onPress={toggleTranslations}
          showUpDownChevron={true}
        />
        <SettingsItem
          label={t('settings.app.onboarding.title')}
          description={t('settings.app.onboarding.value')}
          onPress={handleRestartOnboarding}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 48 : 24,
    paddingBottom: 16,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  title: {
    ...theme.typography.heading1,
  },
  section: {
    marginTop: 16,
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  applyButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  applyButtonText: {
    ...theme.typography.bodyBold,
  },
});