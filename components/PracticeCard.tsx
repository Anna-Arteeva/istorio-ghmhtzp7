import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { theme, useTheme } from '@/theme';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabase';
import { Platform } from 'react-native';
import { StoryCard } from '@/components/StoryCard';
import { AudioPlayer } from '@/components/AudioPlayer';

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

interface PracticeCardProps {
  phrase: {
    id: string;
    targetText: string;
    nativeText: string;
    audioUrl?: string;
  };
  onSoundLoaded?: (sound: any) => void;
  autoPlay?: boolean;
  onNavigate?: () => void;
}

export function PracticeCard({ phrase, onSoundLoaded, autoPlay = true, onNavigate }: PracticeCardProps) {
  const currentTheme = useTheme();
  const { targetLanguage, nativeLanguage } = useLanguage();
  const [associatedStories, setAssociatedStories] = useState<Story[]>([]);
  const [keywords, setKeywords] = useState<Record<string, any>>({});
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
    };
  }, []);

  useEffect(() => {
    if (mounted && phrase?.id) {
      fetchAssociatedStories();
    }
  }, [mounted, phrase?.id]);

  async function fetchAssociatedStories() {
    if (!mounted || !phrase?.id) return;

    try {
      setIsLoading(true);
      // First get the keyword data to get associated stories
      const { data: keywordData, error: keywordError } = await supabase
        .from('keywords')
        .select('associated_stories')
        .eq('keyword_id', phrase.id)
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
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.colors.white }]}>
      <View style={styles.content}>
        <View style={[styles.phraseContainer, { backgroundColor: currentTheme.colors.gray[50] }]}>
          {phrase?.audioUrl && (
            <AudioPlayer 
              url={phrase.audioUrl} 
              size="medium" 
              variant="primary"
              onPlaybackStateChange={(isPlaying) => {
                if (onSoundLoaded) {
                  onSoundLoaded(isPlaying);
                }
              }}
            />
          )}
          
          <View style={styles.phraseContent}>
            <Text style={[styles.phraseText, { color: currentTheme.colors.gray[900] }]}>
              {phrase?.targetText}
            </Text>
            <Text style={[styles.translationText, { color: currentTheme.colors.gray[500] }]}>
              {phrase?.nativeText}
            </Text>
          </View>
        </View>

        {associatedStories.length > 0 && (
          <View style={styles.storiesSection}>
            <View style={styles.storiesList}>
              {associatedStories.map((story) => (
                <View key={story.id} style={styles.storyCard}>
                  <StoryCard
                    story={story}
                    keywords={keywords}
                    hideImage={false}
                    hideAudio={false}
                  />
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
  },
  phraseContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  phraseContent: {
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  phraseText: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  translationText: {
    fontSize: 18,
    textAlign: 'center',
  },
  storiesSection: {
    padding: theme.spacing.lg,
  },
  storiesList: {
    gap: theme.spacing.md,
  },
  storyCard: {
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
  },
});