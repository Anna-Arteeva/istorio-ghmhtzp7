import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Play, Pause } from 'lucide-react-native';
import { theme } from '@/theme';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabase';
import { Platform } from 'react-native';
import { Audio } from 'expo-av';
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

interface PracticeCardProps {
  phrase: {
    id: string;
    targetText: string;
    nativeText: string;
    audioUrl?: string;
  };
  onSoundLoaded?: (sound: Audio.Sound | null) => void;
  autoPlay?: boolean;
  onNavigate?: () => void;
}

export function PracticeCard({ phrase, onSoundLoaded, autoPlay = true, onNavigate }: PracticeCardProps) {
  const { targetLanguage, nativeLanguage } = useLanguage();
  const [associatedStories, setAssociatedStories] = useState<Story[]>([]);
  const [keywords, setKeywords] = useState<Record<string, any>>({});
  const [mounted, setMounted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [webAudio, setWebAudio] = useState<HTMLAudioElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
      cleanupAudio();
    };
  }, []);

  useEffect(() => {
    if (mounted && phrase?.id) {
      fetchAssociatedStories();
      if (autoPlay) {
        loadAndPlayAudio();
      } else {
        loadAudio();
      }
    }
  }, [mounted, phrase?.id, autoPlay]);

  const cleanupAudio = async () => {
    try {
      if (Platform.OS === 'web') {
        if (webAudio) {
          webAudio.pause();
          webAudio.src = '';
          setWebAudio(null);
        }
      } else {
        if (sound) {
          await sound.stopAsync();
          await sound.unloadAsync();
          setSound(null);
        }
      }
      setIsPlaying(false);
    } catch (error) {
      // Silently handle cleanup errors
    }
  };

  const loadAudio = async () => {
    if (!phrase.audioUrl) return;

    await cleanupAudio();

    try {
      if (Platform.OS === 'web') {
        const audio = new window.Audio(phrase.audioUrl);
        audio.addEventListener('ended', () => setIsPlaying(false));
        setWebAudio(audio);
      } else {
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: phrase.audioUrl },
          { shouldPlay: false }
        );

        setSound(newSound);
        
        if (onSoundLoaded) {
          onSoundLoaded(newSound);
        }

        newSound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded) {
            setIsPlaying(status.isPlaying);
            if (status.didJustFinish) {
              setIsPlaying(false);
            }
          }
        });
      }
      setError(null);
    } catch (error) {
      console.error('Error loading audio:', error);
      setError('Failed to load audio');
    }
  };

  const loadAndPlayAudio = async () => {
    if (!phrase.audioUrl) return;

    await cleanupAudio();

    try {
      if (Platform.OS === 'web') {
        const audio = new window.Audio(phrase.audioUrl);
        audio.addEventListener('ended', () => setIsPlaying(false));
        setWebAudio(audio);
        await audio.play();
        setIsPlaying(true);
      } else {
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: phrase.audioUrl },
          { shouldPlay: true }
        );

        setSound(newSound);
        setIsPlaying(true);
        
        if (onSoundLoaded) {
          onSoundLoaded(newSound);
        }

        newSound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded) {
            setIsPlaying(status.isPlaying);
            if (status.didJustFinish) {
              setIsPlaying(false);
            }
          }
        });
      }
      setError(null);
    } catch (error) {
      console.error('Error loading audio:', error);
      setError('Failed to load audio');
    }
  };

  const togglePlayback = async () => {
    try {
      if (Platform.OS === 'web') {
        if (webAudio) {
          if (isPlaying) {
            webAudio.pause();
            setIsPlaying(false);
          } else {
            await webAudio.play();
            setIsPlaying(true);
          }
        }
      } else {
        if (sound) {
          if (isPlaying) {
            await sound.pauseAsync();
          } else {
            await sound.playAsync();
          }
        }
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      setError('Failed to play audio');
    }
  };

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

  if (!phrase) return null;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.phraseContainer}>
        {phrase.audioUrl && (
          <Pressable
            style={[styles.playButton, isPlaying && styles.playButtonActive]}
            onPress={togglePlayback}
          >
            {isPlaying ? (
              <Pause size={24} color={theme.colors.white} />
            ) : (
              <Play size={24} color={theme.colors.white} />
            )}
          </Pressable>
        )}
          <Text style={styles.phraseText}>{phrase.targetText}</Text>
          <Text style={styles.translationText}>{phrase.nativeText}</Text>
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
    backgroundColor: theme.colors.gray[50],
    borderRadius: theme.borderRadius.lg,
  },
  phraseContainer: {
    flex: 1,
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  phraseText: {
    ...theme.typography.heading1,
    color: theme.colors.gray[900],
  },
  translationText: {
    ...theme.typography.body1,
    color: theme.colors.gray[500],
  },
  playButton: {
    width: 56,
    height: 56,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonActive: {
    backgroundColor: theme.colors.gray[900],
  },
  storiesSection: {
    paddingTop: theme.spacing.xl,
  },
  sectionTitle: {
    ...theme.typography.heading2,
    color: theme.colors.gray[900],
    marginBottom: theme.spacing.md,
  },
  storiesList: {
    gap: theme.spacing.md,
  },
  storyCard: {
    marginBottom: theme.spacing.md,
  },
});