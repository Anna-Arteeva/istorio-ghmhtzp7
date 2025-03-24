import React, { useState } from 'react';
import { View, StyleSheet, Modal, Platform, ScrollView } from 'react-native';
import { theme } from '@/theme';
import { CloseButton } from '@/components/CloseButton';
import { Story, StoryCard } from '@/components/StoryCard';
import { ExplanationSheet } from '@/components/ExplanationSheet';
import { useLanguage } from '@/contexts/LanguageContext';

interface StoryModalProps {
  story: Story | null;
  keywords: Record<string, {
    keyword_id: string;
    translations_json: Record<string, string | string[]>;
    audio_json: Record<string, string>;
  }>;
  visible: boolean;
  onClose: () => void;
  onShare?: () => void;
}

export function StoryModal({
  story,
  keywords,
  visible,
  onClose,
  onShare,
}: StoryModalProps) {
  const { nativeLanguage } = useLanguage();
  const [isExplanationVisible, setIsExplanationVisible] = useState(false);

  if (!story) return null;

  const handleExplain = () => {
    const explanation = story?.explanations_json?.[nativeLanguage] || null;
    if (explanation) {
      setIsExplanationVisible(true);
    }
  };

  const modalContent = (
    <View style={styles.container}>
      <View style={styles.header}>
        <CloseButton onPress={onClose} size={40} />
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <StoryCard
          story={story}
          keywords={keywords}
          onExplain={handleExplain}
          onShare={onShare}
          hideImage={false} // Explicitly show image
          hideAudio={false} // Explicitly show audio
        />
      </ScrollView>

      <ExplanationSheet
        explanation={story?.explanations_json?.[nativeLanguage] || null}
        visible={isExplanationVisible}
        onClose={() => setIsExplanationVisible(false)}
      />
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
        height: '90%',
        width: '100%',
        borderRadius: theme.borderRadius.xl,
        overflow: 'hidden',
      },
    }),
  },
  header: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 10,
    padding: theme.spacing.md,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: theme.spacing.md,
  },
});