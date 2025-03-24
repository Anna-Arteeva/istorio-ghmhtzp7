import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Image } from 'react-native';
import { BookOpen } from 'lucide-react-native';
import { theme } from '@/theme';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabase';
import { StoryModal } from '@/components/StoryModal';
import { Platform } from 'react-native';
import { findSentencesWithKeyword } from '@/lib/textUtils';
import { AudioPlayer } from '@/components/AudioPlayer';

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
}

export function PracticeCard({ phrase }: PracticeCardProps) {
  const { targetLanguage, nativeLanguage } = useLanguage();
  const [examples, setExamples] = useState<Example[]>([]);
  const [selectedStory, setSelectedStory] = useState<any | null>(null);
  const [isStoryModalVisible, setIsStoryModalVisible] = useState(false);
  const [keywords, setKeywords] = useState<Record<string, any>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
    };
  }, []);

  useEffect(() => {
    if (mounted && phrase?.id) {
      fetchExampleSentences();
    }
  }, [mounted, phrase?.id]);

  async function fetchExampleSentences() {
    if (!mounted || !phrase) return;

    try {
      // First get the keyword data to get associated stories and translations
      const { data: keywordsData, error: keywordsError } = await supabase
        .from('keywords')
        .select('associated_stories, translations_json')
        .in('keyword_id', [phrase.id]);

      if (keywordsError) throw keywordsError;
      if (!keywordsData?.length) return;

      const keywordData = keywordsData[0];
      if (!keywordData?.associated_stories?.length) return;

      // Get all associated stories
      const { data: storiesData, error: storiesError } = await supabase
        .from('stories')
        .select('*')
        .in('id', keywordData.associated_stories);

      if (storiesError) throw storiesError;
      if (!storiesData) return;

      // Get all keywords for story display
      const { data: allKeywordsData } = await supabase
        .from('keywords')
        .select('keyword_id, translations_json, audio_json');

      if (mounted) {
        const keywordsMap = (allKeywordsData || []).reduce((acc, k) => {
          acc[k.keyword_id] = k;
          return acc;
        }, {} as Record<string, any>);
        setKeywords(keywordsMap);
      }

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

      if (mounted) {
        setExamples(foundExamples);
      }
    } catch (error) {
      console.error('Error fetching example sentences:', error);
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
            <AudioPlayer 
              url={phrase.audioUrl} 
              size={56} 
              variant="primary" 
            />
          </View>
        )}
        
        <Text style={styles.targetText}>{phrase.targetText}</Text>
        <Text style={styles.nativeText}>{phrase.nativeText}</Text>
      </View>

      {examples.length > 0 && (
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