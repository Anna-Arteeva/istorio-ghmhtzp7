import { View, Text, StyleSheet, Pressable, Modal, FlatList, SafeAreaView, Platform } from 'react-native';
import { useState } from 'react';
import { ChevronRight, Check, X } from 'lucide-react-native';
import { useTranslation } from '@/hooks/useTranslation';
import { useLanguage } from '@/contexts/LanguageContext';
import { theme } from '@/theme';

interface Language {
  id: string;
  code: string;
  name: Record<string, string>;
  is_native_language_supported: boolean;
  is_target_language_supported: boolean;
}

interface LanguageSelectorProps {
  title: string;
  selectedCode: string;
  languages: Language[];
  onSelect: (code: string) => void;
  showOnlyTarget?: boolean;
  showOnlyNative?: boolean;
  isFirstTime?: boolean;
}

export function LanguageSelector({ 
  title, 
  selectedCode, 
  languages,
  onSelect,
  showOnlyTarget,
  showOnlyNative,
  isFirstTime
}: LanguageSelectorProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const { t } = useTranslation();
  const { nativeLanguage } = useLanguage();

  const filteredLanguages = languages.filter(lang => {
    if (showOnlyTarget) return lang.is_target_language_supported;
    if (showOnlyNative) return lang.is_native_language_supported;
    return true;
  });

  const selectedLanguage = languages.find(lang => lang.code === selectedCode);

  const renderLanguageItem = ({ item }: { item: Language }) => (
    <Pressable
      style={[
        styles.languageItem,
        item.code === selectedCode && styles.languageItemSelected
      ]}
      onPress={() => {
        onSelect(item.code);
        setModalVisible(false);
      }}>
      <View style={styles.languageInfo}>
        <Text style={[
          styles.languageName,
          item.code === selectedCode && styles.languageNameSelected
        ]}>
          {item.name[nativeLanguage]}
        </Text>
        <Text style={styles.languageNativeName}>
          {item.name.en}
        </Text>
      </View>
      {item.code === selectedCode && (
        <Check size={20} color={theme.colors.primary[500]} />
      )}
    </Pressable>
  );

  return (
    <>
      <Pressable 
        style={[styles.setting, isFirstTime && styles.settingHighlight]}
        onPress={() => setModalVisible(true)}>
        <View>
          <Text style={styles.settingLabel}>{title}</Text>
          <Text style={styles.settingValue}>
            {selectedLanguage?.name[nativeLanguage] || t('settings.language.select')}
          </Text>
          {isFirstTime && (
            <Text style={styles.settingHint}>
              {t('settings.language.hint', { 
                type: showOnlyNative ? t('settings.language.native').toLowerCase() : t('settings.language.target').toLowerCase() 
              })}
            </Text>
          )}
        </View>
        <ChevronRight size={20} color={theme.colors.gray[500]} />
      </Pressable>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{title}</Text>
              <Pressable
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}>
                <X size={20} color={theme.colors.gray[500]} />
              </Pressable>
            </View>

            <FlatList
              data={filteredLanguages}
              keyExtractor={(item) => item.id}
              renderItem={renderLanguageItem}
              contentContainerStyle={styles.languageList}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  setting: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray[200],
  },
  settingHighlight: {
    backgroundColor: theme.colors.primary[50],
    marginHorizontal: -theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  settingLabel: {
    ...theme.typography.body1,
    color: theme.colors.gray[800],
    marginBottom: 2,
  },
  settingValue: {
    ...theme.typography.body2,
    color: theme.colors.primary[500],
  },
  settingHint: {
    ...theme.typography.caption,
    color: theme.colors.primary[600],
    marginTop: theme.spacing.xs,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    flex: 1,
    backgroundColor: theme.colors.white,
    ...Platform.select({
      web: {
        margin: 'auto',
        maxWidth: 480,
        maxHeight: '80vh',
        borderRadius: theme.borderRadius.xl,
      },
      default: {
        marginTop: 50,
        borderTopLeftRadius: theme.borderRadius.xl,
        borderTopRightRadius: theme.borderRadius.xl,
      },
    }),
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray[200],
  },
  modalTitle: {
    ...theme.typography.heading2,
    color: theme.colors.gray[800],
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  languageList: {
    padding: theme.spacing.md,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.xs,
    backgroundColor: theme.colors.white,
  },
  languageItemSelected: {
    backgroundColor: theme.colors.primary[50],
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    ...theme.typography.body1,
    color: theme.colors.gray[800],
    marginBottom: 2,
  },
  languageNameSelected: {
    color: theme.colors.primary[500],
    fontFamily: 'Montserrat-SemiBold',
  },
  languageNativeName: {
    ...theme.typography.caption,
    color: theme.colors.gray[500],
  },
});