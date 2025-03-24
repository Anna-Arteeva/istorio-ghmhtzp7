import { View, Text, StyleSheet, Platform, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from '@/theme';
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
  const { nativeLanguage, targetLanguage, resetOnboarding } = useLanguage();
  const { level } = useLevel();
  const { firstVisit } = useVisits();
  const { showTranslationsByDefault, setShowTranslationsByDefault } = useSettings();
  const [hasChanges, setHasChanges] = useState(false);
  const [initialSettings, setInitialSettings] = useState({
    showTranslationsByDefault: showTranslationsByDefault,
  });

  useEffect(() => {
    setInitialSettings({
      showTranslationsByDefault,
    });
  }, []);

  useEffect(() => {
    const settingsChanged = 
      initialSettings.showTranslationsByDefault !== showTranslationsByDefault;
    
    setHasChanges(settingsChanged);
  }, [showTranslationsByDefault, initialSettings]);

  const handleRestartOnboarding = async () => {
    await resetOnboarding();
    router.push('/onboarding');
  };

  const toggleTranslations = async () => {
    await setShowTranslationsByDefault(!showTranslationsByDefault);
  };

  const handleApply = () => {
    if (hasChanges) {
      // Reload the app by navigating to the root
      router.replace('/(tabs)');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('settings.sections.language')}</Text>
        <View style={styles.headerActions}>
          {hasChanges && (
            <Pressable 
              style={styles.applyButton}
              onPress={handleApply}
            >
              <Text style={styles.applyButtonText}>Apply</Text>
            </Pressable>
          )}
          <CloseButton onPress={() => router.back()} />
        </View>
      </View>

      <View style={styles.section}>
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
          label={t('onboarding.level.title')}
          value={level}
          onPress={() => router.push('/settings/level')}
        />
      </View>

      <View style={styles.section}>
        <SettingsItem
          label={t('settings.app.translations.title')}
          value={showTranslationsByDefault ? t('settings.app.translations.on') : t('settings.app.translations.off')}
          onPress={toggleTranslations}
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
    backgroundColor: theme.colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 48 : 24,
    paddingBottom: 16,
    backgroundColor: theme.colors.white,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  title: {
    ...theme.typography.heading1,
    color: theme.colors.gray[900],
  },
  section: {
    marginTop: 16,
    backgroundColor: theme.colors.white,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderColor: theme.colors.gray[200],
  },
  applyButton: {
    backgroundColor: theme.colors.primary[500],
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  applyButtonText: {
    ...theme.typography.bodyBold,
    color: theme.colors.white,
  },
});