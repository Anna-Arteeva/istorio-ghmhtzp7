import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  Platform,
} from 'react-native';
import { theme } from '@/theme';
import { CloseButton } from '@/components/CloseButton';
import { useTranslation } from '@/hooks/useTranslation';

interface ExplanationSheetProps {
  explanation: string | null;
  visible: boolean;
  onClose: () => void;
}

export function ExplanationSheet({
  explanation,
  visible,
  onClose,
}: ExplanationSheetProps) {
  const { t } = useTranslation();

  const modalContent = (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('common.storyDecoder')}</Text>
        <CloseButton onPress={onClose} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.explanationContainer}>
          <Text style={styles.explanation}>
            {explanation || 'No explanation available.'}
          </Text>
        </View>
      </ScrollView>
    </View>
  );

  if (Platform.OS === 'web') {
    return (
      <Modal visible={visible} onRequestClose={onClose} transparent>
        <View style={styles.modalOverlay}>{modalContent}</View>
      </Modal>
    );
  }

  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      presentationStyle="pageSheet"
    >
      {modalContent}
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
    ...Platform.select({
      web: {
        maxWidth: 640,
        margin: 'auto',
        height: '80%',
        width: '100%',
        borderRadius: theme.borderRadius.xl,
        overflow: 'hidden',
      },
    }),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.lg,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: theme.spacing.lg,
  },
  explanationContainer: {
  },
  title: {
    ...theme.typography.heading1,
    color: theme.colors.gray[900],
  },
  explanation: {
    ...theme.typography.bodyLead,
    color: theme.colors.gray[800],
  },
});