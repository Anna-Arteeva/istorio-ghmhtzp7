import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  Platform,
  ScrollView,
} from 'react-native';
import { theme } from '@/theme';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabase';
import { CloseButton } from '@/components/CloseButton';
import { AudioPlayer } from '@/components/AudioPlayer';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { StoryCard } from '@/components/StoryCard';

interface Story {
  id: string;
  type: 'long' | 'short';
  description: string;
  level: string;
  imageUrl: string | null;
  keywords: string[];
  audioUrl?: string;
  translations_json?: Record<string, string>;
  content_json?: Record<string, string>;
  explanations_json?: Record<string, string>;
  gradient?: string;
}

interface FlashcardProps {
  keyword: {
    id: string;
    targetText: string;
    nativeText: string;
    audioUrl?: string;
  };
  visible: boolean;
  onClose: () => void;
}

export function Flashcard({ keyword, visible, onClose }: FlashcardProps) {
  const { targetLanguage, nativeLanguage } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [associatedStories, setAssociatedStories] = useState<Story[]>([]);
  const [keywords, setKeywords] = useState<Record<string, any>>({});
  const { play, stop, isPlaying, isLoading, error } = useAudioPlayer(keyword?.audioUrl);

  useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
      stop(); // Stop audio when component unmounts
    };
  }, []);

  // Handle audio when keyword changes
  useEffect(() => {
    if (mounted) {
      stop(); // Stop previous audio
      if (visible && keyword?.audioUrl) {
        play();
      }
    }
  }, [keyword?.audioUrl, visible, mounted]);

  // Handle visibility changes
  useEffect(() => {
    if (!visible) {
      stop(); // Stop audio when modal closes
    }
  }, [visible]);

  useEffect(() => {
    if (visible && mounted && keyword?.id) {
      fetchAssociatedStories();
    }
  }, [visible, mounted, keyword?.id]);

  async function fetchAssociatedStories() {
    if (!mounted || !keyword?.id) return;

    try {
      // First get the keyword data to get associated stories
      const { data: keywordData, error: keywordError } = await supabase
        .from('keywords')
        .select('associated_stories')
        .eq('keyword_id', keyword.id)
        .single();

      if (keywordError) throw keywordError;
      if (!keywordData?.associated_stories?.length) return;

      // Get all associated stories
      const { data: storiesData, error: storiesError } = await supabase
        .from('stories')
        .select('*')
        .in('id', keywordData.associated_stories);

      if (storiesError) throw storiesError;
      if (!storiesData) return;

      // Get all keywords for story display
      const { data: keywordsData } = await supabase
        .from('keywords')
        .select('keyword_id, translations_json, audio_json');

      if (mounted) {
        const keywordsMap = (keywordsData || []).reduce((acc, k) => {
          acc[k.keyword_id] = k;
          return acc;
        }, {} as Record<string, any>);
        setKeywords(keywordsMap);

        const formattedStories = storiesData.map(story => ({
          id: story.id,
          type: story.type,
          level: story.level,
          imageUrl: story.image_url,
          keywords: story.keywords || [],
          audioUrl: story.audio_json?.[targetLanguage] || story.audio_json?.en,
          translations_json: story.translations_json,
          content_json: story.content_json,
          explanations_json: story.explanations_json,
          gradient: story.gradient,
        }));

        setAssociatedStories(formattedStories);
      }
    } catch (error) {
      console.error('Error fetching associated stories:', error);
    }
  }

  if (!keyword) return null;

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
        <View style={styles.keywordContainer}>
          {keyword?.audioUrl && (
            <AudioPlayer 
              url={keyword.audioUrl} 
              size={48} 
              variant="primary" 
            />
          )}
          
          <View style={styles.keywordContent}>
            <Text style={styles.keywordText}>{keyword?.targetText}</Text>
            <Text style={styles.translationText}>{keyword?.nativeText}</Text>
          </View>
        </View>

        {associatedStories.length > 0 && (
          <View style={styles.storiesSection}>
            <View style={styles.storiesList}>
              {associatedStories.map((story) => (
                <View key={story.id} style={styles.storyCard}>
                  <StoryCard
                    story={story}
                    keywords={{}}  // Pass empty object to hide keywords section
                    hideImage={false}
                    hideAudio={false}
                  />
                </View>
              ))}
            </View>
          </View>
        )}

        {error && <Text style={styles.errorText}>{error}</Text>}
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
    padding: 0,
  },
  keywordContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.gray[50],
    paddingHorizontal: theme.spacing.lg,
    paddingTop: 96,
    paddingBottom: 48,
    gap: theme.spacing.lg,
  },
  keywordContent: {
    flex: 1,
    alignItems: 'center',
    gap: theme.spacing.sm,
    textAlign: 'center',
  },
  keywordText: {
    ...theme.typography.heading1,
    color: theme.colors.gray[900],
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  translationText: {
    ...theme.typography.body1,
    color: theme.colors.gray[500],
    textAlign: 'center',
  },
  storiesSection: {
    padding: theme.spacing.lg,
  },
  storiesTitle: {
    ...theme.typography.bodyBold,
    color: theme.colors.gray[500],
    marginBottom: theme.spacing.md,
  },
  storiesList: {
    gap: theme.spacing.md,
  },
  storyCard: {
    marginBottom: theme.spacing.md,
  },
  errorText: {
    ...theme.typography.body2,
    color: theme.colors.error[500],
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
});