import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '@/theme';
import { StoryCard } from '@/components/StoryCard';
import { HelpBadge } from '@/components/HelpBadge';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import { supabase } from '@/lib/supabase';

export function ExampleStory() {
  const { t } = useTranslation();
  const { nativeLanguage, targetLanguage } = useLanguage();
  const [story, setStory] = useState<any>(null);
  const [keywords, setKeywords] = useState<Record<string, any>>({});
  const [mounted, setMounted] = useState(false);
  const [isExplanationVisible, setIsExplanationVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (mounted) {
      fetchStoryAndKeywords();
    }
  }, [mounted]);

  async function fetchStoryAndKeywords() {
    try {
      // Fetch the story
      const { data: storyData, error: storyError } = await supabase
        .from('stories')
        .select('*')
        .eq('id', '00000000-0000-4000-a000-000000000000')
        .single();

      if (storyError) throw storyError;
      if (!storyData) return;

      // Format the story data
      const formattedStory = {
        id: storyData.id,
        type: storyData.type,
        level: storyData.level,
        imageUrl: storyData.image_url,
        keywords: storyData.keywords || [],
        audioUrl: storyData.audio_json?.[targetLanguage] || storyData.audio_json?.en,
        translations_json: storyData.translations_json,
        content_json: storyData.content_json,
        explanations_json: storyData.explanations_json,
        gradient: storyData.gradient,
      };

      // Fetch keywords if the story has any
      if (formattedStory.keywords?.length) {
        const { data: keywordsData, error: keywordsError } = await supabase
          .from('keywords')
          .select('keyword_id, translations_json, audio_json, word_level')
          .in('keyword_id', formattedStory.keywords);

        if (keywordsError) throw keywordsError;

        // Create a map of keyword_id to keyword data
        const keywordsMap = (keywordsData || []).reduce((acc, keyword) => {
          acc[keyword.keyword_id] = keyword;
          return acc;
        }, {} as Record<string, any>);

        if (mounted) {
          setKeywords(keywordsMap);
        }
      }

      if (mounted) {
        setStory(formattedStory);
      }
    } catch (error) {
      console.error('Error fetching story:', error);
    }
  }

  const handleExplain = () => {
    if (story?.explanations_json?.[nativeLanguage]) {
      setIsExplanationVisible(true);
    }
  };

  if (!story) return null;

  return (
    <View style={styles.container}>
      <View style={styles.storyContainer}>
        {/* Play audio badge - Top Left */}
        <HelpBadge 
          text={t('example.play')}
          type="bottomLeft"
          position={{ top: -16, left: 16 }}
        />
        
        {/* Translate story badge - Top Right 
        <HelpBadge 
          text={t('example.translateStory')}
          type="topRight"
          position={{ top: 63, right: 53 }}
        />*/}
        
        {/* Translate sentence badge - Top Right */}
        <HelpBadge 
          text={t('example.translate')}
          type="bottomLeft"
          position={{ top: 50, right: 16 }}
        />
      
        {/* Learn phrases badge - Bottom Left */}
        <HelpBadge 
          text={t('example.phrases')}
          type="bottomRight"
          position={{ bottom: 142, left: -8 }}
        />
        
        {/* Save for practice badge - Bottom Right 
        <HelpBadge 
          text={t('example.save')}
          type="topRight"
          position={{ bottom: 8, right: 16 }}
        />*/}

        <StoryCard 
          story={story}
          keywords={keywords}
          onExplain={handleExplain}
          onShare={() => {}}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 25,
    marginLeft: -8,
    marginRight: -8,
    marginBottom: -16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xl,
  },
  headerText: {
    ...theme.typography.heading2,
    color: theme.colors.gray[900],
  },
  storyContainer: {
    position: 'relative',
  },
});