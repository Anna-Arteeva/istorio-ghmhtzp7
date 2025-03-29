import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLevel } from '@/contexts/LevelContext';
import { type LanguageLevel } from '@/lib/constants';

const PAGE_SIZE = 10;

function getAccessibleLevels(userLevel: LanguageLevel): LanguageLevel[] {
  const levels: LanguageLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  const userLevelIndex = levels.indexOf(userLevel);
  return levels.slice(0, userLevelIndex + 1);
}

function distributeContent(
  stories: any[],
  infoCards: any[],
  keywords: Record<string, any>,
  viewHistory: any[],
  firstVisit: string | null
) {
  if (!stories.length && !infoCards.length) return [];

  const result: any[] = [];
  let storyCount = 0;
  let infoCardIndex = 0;
  let storyBuffer: any[] = [];

  // Find welcome card first
  const welcomeCard = infoCards.find(card => card.name === 'welcome');
  const regularCards = infoCards.filter(card => card.name !== 'welcome');

  // Add welcome card only if first visit is within last 2 hours
  if (welcomeCard && isWithinLastTwoHours(firstVisit)) {
    result.push(welcomeCard);
    result.push('try-badge');
  }

  // Categorize and shuffle stories
  const unseenStories = shuffleArray(stories.filter(story => 
    !viewHistory.some(record => record.id === story.id && record.type === 'story')
  ));
  
  const oldSeenStories = shuffleArray(stories.filter(story => {
    const latestView = getLatestViewTimestamp(story.id, viewHistory);
    return latestView && !wasViewedWithinLastThreeDays(story.id, viewHistory);
  }));

  const recentlySeenStories = shuffleArray(stories.filter(story => 
    wasViewedWithinLastThreeDays(story.id, viewHistory)
  ));

  function addKeywordsCarousel() {
    if (storyBuffer.length >= 3) {
      const lastThreeStories = storyBuffer.slice(-3);
      const allKeywords = lastThreeStories.flatMap(story => story.keywords || []);
      
      // Get unique keywords
      const uniqueKeywords = [...new Set(allKeywords)];
      
      // Filter valid keywords and get random selection
      const validKeywords = uniqueKeywords
        .filter(id => keywords[id])
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      if (validKeywords.length > 0) {
        result.push({ type: 'keywords', ids: validKeywords });
      }
    }
  }

  function addStory(story: any) {
    result.push(story);
    storyBuffer.push(story);
    storyCount++;

    // Add info card after every 2 stories
    if (storyCount % 2 === 0 && infoCardIndex < regularCards.length) {
      result.push(regularCards[infoCardIndex]);
      infoCardIndex++;
    }

    // Add keywords carousel after every 3 stories
    if (storyCount % 3 === 0) {
      addKeywordsCarousel();
    }
  }

  // Add stories in the pattern: 2 unseen, 1 old, 1 recent
  while (unseenStories.length > 0 || oldSeenStories.length > 0 || recentlySeenStories.length > 0) {
    // Add 2 unseen stories if available
    for (let i = 0; i < 2; i++) {
      const story = unseenStories.shift();
      if (story) {
        addStory(story);
      }
    }

    // Add 1 old seen story if available
    const oldStory = oldSeenStories.shift();
    if (oldStory) {
      addStory(oldStory);
    }

    // Add 1 recently seen story if available
    const recentStory = recentlySeenStories.shift();
    if (recentStory) {
      addStory(recentStory);
    }
  }

  return result;
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function wasViewedWithinLastThreeDays(storyId: string, viewHistory: any[]): boolean {
  const storyViews = viewHistory.filter(record => record.id === storyId && record.type === 'story');
  if (!storyViews.length) return false;

  const latestView = new Date(Math.max(...storyViews.map(view => new Date(view.timestamp).getTime())));
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
  
  return latestView > threeDaysAgo;
}

function getLatestViewTimestamp(storyId: string, viewHistory: any[]): Date | null {
  const storyViews = viewHistory.filter(record => record.id === storyId && record.type === 'story');
  if (!storyViews.length) return null;

  return new Date(Math.max(...storyViews.map(view => new Date(view.timestamp).getTime())));
}

function isWithinLastTwoHours(timestamp: string | null): boolean {
  if (!timestamp) return false;
  
  const visitTime = new Date(timestamp).getTime();
  const now = new Date().getTime();
  const twoHoursInMs = 2 * 60 * 60 * 1000;
  
  return now - visitTime <= twoHoursInMs;
}

export function useFeed() {
  const { targetLanguage } = useLanguage();
  const { level } = useLevel();
  const [feedItems, setFeedItems] = useState<any[]>([]);
  const [keywords, setKeywords] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadContent = useCallback(async (isLoadingMore = false) => {
    try {
      if (!isLoadingMore) {
        setLoading(true);
        setError(null);
      } else {
        setLoadingMore(true);
      }

      const currentPage = isLoadingMore ? page + 1 : 1;
      const from = (currentPage - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      // Fetch stories
      const { data: stories, error: storiesError, count } = await supabase
        .from('stories')
        .select('*', { count: 'exact' })
        .eq('story_status', 'published')
        .in('level', getAccessibleLevels(level))
        .range(from, to);

      if (storiesError) throw storiesError;

      // Filter stories by target language content
      const filteredStories = (stories || [])
        .filter(story => {
          const content = story.content_json?.[targetLanguage];
          return content && content.trim();
        })
        .map(story => ({
          id: story.id,
          type: story.type,
          level: story.level,
          imageUrl: story.image_url,
          keywords: story.keywords || [],
          audioUrl: story.audio_json?.[targetLanguage],
          content_json: story.content_json,
          translations_json: story.translations_json,
          explanations_json: story.explanations_json,
          gradient: story.gradient,
        }));

      // Fetch info cards
      const { data: infoCards, error: infoCardsError } = await supabase
        .from('info_cards')
        .select('*')
        .range(from, to);

      if (infoCardsError) throw infoCardsError;

      // Collect all unique keyword IDs
      const keywordIds = new Set<string>();
      filteredStories.forEach(story => {
        story.keywords?.forEach(keyword => keywordIds.add(keyword));
      });

      // Fetch keywords if we have any
      let keywordsMap = {};
      if (keywordIds.size > 0) {
        const { data: keywordsData, error: keywordsError } = await supabase
          .from('keywords')
          .select('keyword_id, translations_json, audio_json')
          .in('keyword_id', Array.from(keywordIds));

        if (keywordsError) throw keywordsError;

        keywordsMap = (keywordsData || []).reduce((acc, keyword) => {
          acc[keyword.keyword_id] = keyword;
          return acc;
        }, {} as Record<string, any>);

        setKeywords(prev => ({ ...prev, ...keywordsMap }));
      }

      // Distribute content
      const distributedItems = distributeContent(
        filteredStories,
        infoCards || [],
        keywordsMap,
        [], // viewHistory - implement if needed
        null // firstVisit - implement if needed
      );

      if (isLoadingMore) {
        setFeedItems(prev => [...prev, ...distributedItems]);
        setPage(currentPage);
      } else {
        setFeedItems(distributedItems);
        setPage(1);
      }

      setHasMore(count ? from + PAGE_SIZE < count : false);
    } catch (err) {
      console.error('Error loading feed:', err);
      setError(err.message);
    } finally {
      if (isLoadingMore) {
        setLoadingMore(false);
      } else {
        setLoading(false);
      }
    }
  }, [targetLanguage, level, page]);

  useEffect(() => {
    loadContent(false);
  }, [targetLanguage, level]);

  return {
    feedItems,
    keywords,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore: () => {
      if (!loadingMore && hasMore) {
        loadContent(true);
      }
    },
  };
}