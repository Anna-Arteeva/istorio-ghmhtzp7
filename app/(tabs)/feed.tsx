import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { StoryCard } from '@/components/StoryCard';
import { theme } from '@/theme';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabase';

interface Story {
  id: string;
  type: 'long' | 'short';
  level: string;
  image_url: string | null;
  keywords: string[];
  content_json: Record<string, string>;
  audio_json: Record<string, string>;
  gradient?: string;
}

interface Keyword {
  keyword_id: string;
  translations_json: Record<string, string>;
  audio_json: Record<string, string>;
}

export default function FeedScreen() {
  const [stories, setStories] = useState<Story[]>([]);
  const [keywords, setKeywords] = useState<Record<string, Keyword>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { targetLanguage } = useLanguage();

  const fetchStories = async (pageNumber: number, refresh = false) => {
    try {
      setLoading(true);
      
      // Fetch stories from edge function
      const apiUrl = `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/feed?page=${pageNumber}`;
      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY}`,
        },
      });
      
      const data = await response.json();
      
      if (!data.stories) throw new Error('Failed to fetch stories');

      // Get all unique keyword IDs from the stories
      const keywordIds = new Set<string>();
      data.stories.forEach((story: Story) => {
        story.keywords?.forEach(keyword => keywordIds.add(keyword));
      });

      // Fetch keywords if we have any
      if (keywordIds.size > 0) {
        const { data: keywordsData } = await supabase
          .from('keywords')
          .select('keyword_id, translations_json, audio_json')
          .in('keyword_id', Array.from(keywordIds));

        if (keywordsData) {
          const keywordsMap = keywordsData.reduce((acc, keyword) => {
            acc[keyword.keyword_id] = keyword;
            return acc;
          }, {} as Record<string, Keyword>);
          setKeywords(prev => ({ ...prev, ...keywordsMap }));
        }
      }

      setStories(prev => 
        refresh ? data.stories : [...prev, ...data.stories]
      );
      setHasMore(data.hasMore);
    } catch (error) {
      console.error('Error fetching stories:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStories(1, true);
  }, []);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setPage(1);
    fetchStories(1, true);
  }, []);

  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchStories(nextPage);
    }
  }, [loading, hasMore, page]);

  const renderStory = ({ item }: { item: Story }) => (
    <View style={styles.storyContainer}>
      <StoryCard
        story={{
          id: item.id,
          type: item.type,
          level: item.level,
          imageUrl: item.image_url,
          keywords: item.keywords || [],
          audioUrl: item.audio_json?.[targetLanguage],
          content_json: item.content_json,
          gradient: item.gradient,
        }}
        keywords={keywords}
        onExplain={() => {}}
        onShare={() => {}}
      />
    </View>
  );

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="large" color={theme.colors.primary[500]} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={stories}
        renderItem={renderStory}
        keyExtractor={item => item.id}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary[500]}
          />
        }
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  list: {
    padding: theme.spacing.md,
  },
  storyContainer: {
    marginBottom: theme.spacing.md,
  },
  footer: {
    paddingVertical: theme.spacing.lg,
  },
});