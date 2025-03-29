import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, useWindowDimensions, Platform } from 'react-native';
import { StoryCard } from '@/components/StoryCard';
import { InfoCard } from '@/components/InfoCard';
import { HelpBadge } from '@/components/HelpBadge';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLevel } from '@/contexts/LevelContext';
import { useVisits } from '@/contexts/VisitContext';
import { useViews } from '@/contexts/ViewContext';
import { theme } from '@/theme';
import { ExplanationSheet } from '@/components/ExplanationSheet';
import { KeywordsCarousel } from '@/components/KeywordsCarousel';
import { supabase } from '@/lib/supabase';

interface FeedItem {
  type: 'story' | 'info_card' | 'try_badge' | 'keywords_carousel';
  data?: any;
}

const PAGE_SIZE = 10;

export default function FeedScreen() {
  const { targetLanguage, nativeLanguage } = useLanguage();
  const { level } = useLevel();
  const { visits, firstVisit } = useVisits();
  const { viewHistory } = useViews();
  const { width } = useWindowDimensions();
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [keywords, setKeywords] = useState<Record<string, any>>({});
  const [currentExplanation, setCurrentExplanation] = useState<string | null>(null);
  const [isExplanationVisible, setIsExplanationVisible] = useState(false);
  const [selectedKeyword, setSelectedKeyword] = useState<{
    id: string;
    targetText: string;
    nativeText: string;
    audioUrl?: string;
  } | null>(null);
  const [isFlashcardVisible, setIsFlashcardVisible] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const numColumns = useMemo(() => {
    if (Platform.OS !== 'web') return 1;
    if (width >= 1024) return 3;
    if (width >= 768) return 2;
    return 1;
  }, [width]);

  useEffect(() => {
    loadContent();
  }, [targetLanguage, level, firstVisit]);

  async function loadContent(isLoadingMore = false) {
    try {
      if (!isLoadingMore) {
        setLoading(true);
        setError(null);
      } else {
        setLoadingMore(true);
      }

      const apiUrl = `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/feed`;

      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      
      // Prepare headers
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      // Only add Authorization header if we have a session
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          targetLanguage,
          level,
          viewHistory,
          firstVisit,
          page: isLoadingMore ? page + 1 : 1,
          pageSize: PAGE_SIZE,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      if (!data) throw new Error('No data received from feed');
      
      if (isLoadingMore) {
        setFeedItems(prev => [...prev, ...(data.items || [])]);
        setPage(prev => prev + 1);
      } else {
        setFeedItems(data.items || []);
        setPage(1);
      }

      setKeywords(data.keywords || {});
      setHasMore(data.hasMore || false);
    } catch (error) {
      console.error('Error loading content:', error);
      setError(error instanceof Error ? error.message : 'Failed to load content');
    } finally {
      if (isLoadingMore) {
        setLoadingMore(false);
      } else {
        setLoading(false);
      }
    }
  }

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      loadContent(true);
    }
  };

  const handleExplainPress = (storyId: string) => {
    const story = feedItems.find(
      item => item.type === 'story' && item.data.id === storyId
    )?.data;
    
    if (story?.explanations_json?.[nativeLanguage]) {
      setCurrentExplanation(story.explanations_json[nativeLanguage]);
      setIsExplanationVisible(true);
    }
  };

  const renderFeedItem = ({ item }: { item: FeedItem }) => {
    switch (item.type) {
      case 'story':
        return (
          <StoryCard
            story={item.data}
            keywords={keywords}
            onExplain={() => handleExplainPress(item.data.id)}
            onShare={() => console.log('Share story:', item.data.id)}
          />
        );
      
      case 'info_card':
        return <InfoCard card={item.data} />;
      
      case 'try_badge':
        return visits.length === 1 ? (
          <HelpBadge
            text="Now try it yourself!"
            type="bottomLeft"
            variant="static"
          />
        ) : null;
      
      case 'keywords_carousel':
        return (
          <KeywordsCarousel
            keywords={keywords}
            selectedKeywords={item.data.ids}
            onKeywordPress={(keywordId) => {
              const keyword = keywords[keywordId];
              if (!keyword) return;

              setSelectedKeyword({
                id: keywordId,
                targetText: keyword.translations_json[targetLanguage],
                nativeText: keyword.translations_json[nativeLanguage],
                audioUrl: keyword.audio_json?.[targetLanguage],
              });
              setIsFlashcardVisible(true);
            }}
          />
        );
      
      default:
        return null;
    }
  };

  const renderFooter = () => {
    if (!loadingMore) return null;

    return (
      <View style={styles.loadingMore}>
        <ActivityIndicator size="large" color={theme.colors.primary[500]} />
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary[500]} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={feedItems}
        renderItem={renderFeedItem}
        keyExtractor={(item, index) => {
          if (item.type === 'try_badge') return 'try-badge';
          if (item.type === 'keywords_carousel') {
            return `keywords-${item.data.ids.join('-')}`;
          }
          return item.data?.id || `item-${index}`;
        }}
        contentContainerStyle={styles.list}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
      />
      
      <ExplanationSheet
        explanation={currentExplanation}
        visible={isExplanationVisible}
        onClose={() => setIsExplanationVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    gap: theme.spacing.md,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    padding: theme.spacing.lg,
  },
  errorText: {
    ...theme.typography.body1,
    color: theme.colors.error[500],
    textAlign: 'center',
  },
  list: {
    padding: theme.spacing.md,
  },
  loadingMore: {
    paddingVertical: theme.spacing.lg,
    alignItems: 'center',
  },
});