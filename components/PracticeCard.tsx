import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Image } from 'react-native';
import { BookOpen, Play, Pause } from 'lucide-react-native';
import { theme } from '@/theme';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabase';
import { StoryModal } from '@/components/StoryModal';
import { Platform } from 'react-native';
import { Audio } from 'expo-av';
import { findSentencesWithKeyword } from '@/lib/textUtils';

interface Example {
  storyId: string;
  imageUrl: string | null;
  sentence: string;
  translation: string;
  story?: any;
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
  const [examples, setExamples] = useState<Example[]>([]);
  const [selectedStory, setSelectedStory] = useState<any | null>(null);
  const [isStoryModalVisible, setIsStoryModalVisible] = useState(false);
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
      fetchExampleSentences();
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

  async function fetchExampleSentences() {
    if (!mounted || !phrase) return;

    try {
      setIsLoading(true);
      setError(null);

      // First get the keyword data to get associated stories
      const { data: keywordsData, error: keywordsError } = await supabase
        .from('keywords')
        .select('associated_stories, translations_json')
        .eq('keyword_id', phrase.id)
        .single();

      if (keywordsError) {
        throw keywordsError;
      }

      if (!keywordsData?.associated_stories?.length) {
        setExamples([]);
        return;
      }

      // Get all associated stories
      const { data: storiesData, error: storiesError } = await supabase
        .from('stories')
        .select('*')
        .in('id', keywordsData.associated_stories);

      if (storiesError) {
        throw storiesError;
      }

      if (!storiesData) {
        setExamples([]);
        return;
      }

      // Get all keywords for story display
      const { data: allKeywordsData, error: allKeywordsError } = await supabase
        .from('keywords')
        .select('keyword_id, translations_json, audio_json, word_level');

      if (allKeywordsError) {
        throw allKeywordsError;
      }

      if (mounted) {
        const keywordsMap = (allKeywordsData || []).reduce((acc, k) => {
          acc[k.keyword_id] = k;
          return acc;
        }, {} as Record<string, any>);
        setKeywords(keywordsMap);

        const foundExamples: Example[] = [];
        const usedStoryIds = new Set<string>();

        // Process each story
        storiesData.forEach((story) => {
          if (usedStoryIds.has(story.id)) return;

          const targetContent = story.content_json?.[targetLanguage];
          const nativeContent = story.content_json?.[nativeLanguage];

          if (!targetContent || !nativeContent) return;

          const targetSentences = parseContent(targetContent);
          const nativeSentences = parseContent(nativeContent);

          const matchedIndices = findSentencesWithKeyword(
            targetSentences.map(s => s.text),
            phrase.targetText,
            targetLanguage
          );

          if (matchedIndices.length > 0) {
            const index = matchedIndices[0];
            if (nativeSentences[index]) {
              foundExamples.push({
                storyId: story.id,
                imageUrl: story.image_url,
                sentence: targetSentences[index].text.trim(),
                translation: nativeSentences[index].text.trim(),
                story: story,
              });
              usedStoryIds.add(story.id);
            }
          }
        });

        setExamples(foundExamples);
      }
    } catch (error) {
      console.error('Error fetching example sentences:', error);
      setError('Failed to fetch examples');
    } finally {
      setIsLoading(false);
    }
  }

  function parseContent(content: any) {
    if (!content) return [];

    if (content.sentences && Array.isArray(content.sentences)) {
      return content.sentences;
    }

    if (content.text) {
      return content.text.split('|').map(text => ({ text: text.trim() }));
    }

    return [];
  }

  const handleOpenStory = (example: Example) => {
    if (!mounted) return;
    if (example.story) {
      if (onNavigate) {
        onNavigate();
      }
      setSelectedStory(example.story);
      setIsStoryModalVisible(true);
    }
  };

  if (!phrase) return null;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.card}>
        {phrase.audioUrl && (
          <View style={styles.audioContainer}>
            <Pressable
              style={[
                styles.audioButton,
                isPlaying && styles.audioButtonActive,
                error && styles.audioButtonError,
              ]}
              onPress={togglePlayback}
            >
              {isPlaying ? (
                <Pause size={24} color={theme.colors.white} />
              ) : (
                <Play
                  size={24}
                  color={
                    error
                      ? theme.colors.error[500]
                      : theme.colors.white
                  }
                />
              )}
            </Pressable>
          </View>
        )}
        
        <Text style={styles.targetText}>{phrase.targetText}</Text>
        <Text style={styles.nativeText}>{phrase.nativeText}</Text>
      </View>

      {isLoading && (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading examples...</Text>
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {!isLoading && !error && examples.length > 0 && (
        <View style={styles.examplesSection}>
          <View style={styles.examplesList}>
            {examples.map((example, index) => (
              <View key={index} style={styles.exampleCard}>
                {example.imageUrl && (
                  <Image
                    source={{ uri: example.imageUrl }}
                    style={styles.storyImage}
                    resizeMode="cover"
                  />
                )}
                <View style={styles.exampleContent}>
                  <Text style={styles.exampleText}>
                    {example.sentence}
                  </Text>
                  <Text style={styles.exampleTranslation}>
                    {example.translation}
                  </Text>
                  <Pressable
                    style={styles.readMoreButton}
                    onPress={() => handleOpenStory(example)}
                  >
                    <BookOpen size={16} color={theme.colors.gray[800]} />
                    <Text style={styles.readMoreText}>Read the Full Story</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      <StoryModal
        story={selectedStory}
        keywords={keywords}
        visible={isStoryModalVisible}
        onClose={() => {
          if (mounted) {
            setIsStoryModalVisible(false);
            setSelectedStory(null);
          }
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    backgroundColor: theme.colors.gray[50],
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    width: '100%',
    alignItems: 'center',
    gap: theme.spacing.lg,
  },
  audioContainer: {
    marginBottom: theme.spacing.md,
  },
  audioButton: {
    width: 56,
    height: 56,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
  },
  audioButtonActive: {
    backgroundColor: theme.colors.gray[900],
  },
  audioButtonError: {
    backgroundColor: theme.colors.error[50],
  },
  targetText: {
    ...theme.typography.heading1,
    color: theme.colors.gray[900],
    textAlign: 'center',
  },
  nativeText: {
    ...theme.typography.body1,
    color: theme.colors.gray[500],
    textAlign: 'center',
  },
  loadingContainer: {
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  loadingText: {
    ...theme.typography.body1,
    color: theme.colors.gray[500],
  },
  errorContainer: {
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  errorText: {
    ...theme.typography.body1,
    color: theme.colors.error[500],
  },
  examplesSection: {
    marginTop: theme.spacing.lg,
  },
  examplesList: {
    gap: theme.spacing.md,
  },
  exampleCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.gray[200],
  },
  storyImage: {
    width: '100%',
    height: 160,
    backgroundColor: theme.colors.gray[100],
  },
  exampleContent: {
    padding: theme.spacing.md,
  },
  exampleText: {
    ...theme.typography.body1,
    color: theme.colors.gray[900],
    marginBottom: theme.spacing.xs,
  },
  exampleTranslation: {
    ...theme.typography.body2,
    color: theme.colors.gray[500],
    fontStyle: 'italic',
    marginBottom: theme.spacing.lg,
  },
  readMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    justifyContent: 'center',
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.gray[50],
    borderRadius: theme.borderRadius.md,
  },
  readMoreText: {
    ...theme.typography.bodyBold,
    color: theme.colors.gray[800],
  },
});