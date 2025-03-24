import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, useWindowDimensions, Platform, ScrollView } from 'react-native';
import { StoryCard, type Story } from '@/components/StoryCard';
import { InfoCard } from '@/components/InfoCard';
import { HelpBadge } from '@/components/HelpBadge';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLevel } from '@/contexts/LevelContext';
import { useVisits } from '@/contexts/VisitContext';
import { useViews } from '@/contexts/ViewContext';
import { type LanguageLevel } from '@/lib/constants';
import { theme } from '@/theme';
import { ExplanationSheet } from '@/components/ExplanationSheet';
import { useTranslation } from '@/hooks/useTranslation';
import { KeywordsCarousel } from '@/components/KeywordsCarousel';

interface ViewRecord {
  id: string;
  type: 'story' | 'info_card';
  timestamp: string;
}

function getPrimaryTranslation(translation: string | string[]): string {
  return Array.isArray(translation) ? translation[0] : translation;
}

interface Keyword {
  keyword_id: string;
  translations_json: Record<string, string>;
  audio_json: Record<string, string>;
}

interface InfoCardType {
  id: string;
  name: string;
  active_days: number;
  content_json: Record<string, {
    title: string;
    description: string;
  }>;
}

function getAccessibleLevels(userLevel: LanguageLevel): LanguageLevel[] {
  const levels: LanguageLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  const userLevelIndex = levels.indexOf(userLevel);
  return levels.slice(0, userLevelIndex + 1);
}

function parseContent(content: string | undefined | null): { text: string }[] {
  if (!content || typeof content !== 'string') return [];
  return content.split('|').map(text => ({ text: text.trim() }));
}

function wasViewedWithinLastThreeDays(storyId: string, viewHistory: ViewRecord[]): boolean {
  const storyViews = viewHistory.filter(record => record.id === storyId && record.type === 'story');
  if (!storyViews.length) return false;

  const latestView = new Date(Math.max(...storyViews.map(view => new Date(view.timestamp).getTime())));
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
  
  return latestView > threeDaysAgo;
}

function getLatestViewTimestamp(storyId: string, viewHistory: ViewRecord[]): Date | null {
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

function distributeContent(
  stories: Story[], 
  infoCards: InfoCardType[],
  keywords: Record<string, Keyword>,
  viewHistory: ViewRecord[],
  firstVisit: string | null
): (Story | InfoCardType | 'try-badge' | { type: 'keywords', ids: string[] })[] {
  if (!stories.length && !infoCards.length) return [];

  const result: (Story | InfoCardType | 'try-badge' | { type: 'keywords', ids: string[] })[] = [];
  let storyCount = 0;
  let infoCardIndex = 0;
  let storyBuffer: Story[] = [];

  // Find welcome card first
  const welcomeCard = infoCards.find(card => card.name === 'welcome');
  const regularCards = infoCards.filter(card => card.name !== 'welcome');

  // Add welcome card only if first visit is within last 2 hours
  if (welcomeCard && isWithinLastTwoHours(firstVisit)) {
    result.push(welcomeCard);
    result.push('try-badge');
  }

  // Categorize and shuffle stories once
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

  function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

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

  function addStory(story: Story) {
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

export default function StoriesScreen() {
  const { t } = useTranslation();
  const [stories, setStories] = useState<Story[]>([]);
  const [infoCards, setInfoCards] = useState<InfoCardType[]>([]);
  const [keywords, setKeywords] = useState<Record<string, Keyword>>({});
  const [loading, setLoading] = useState(true);
  const [currentExplanation, setCurrentExplanation] = useState<string | null>(null);
  const [isExplanationVisible, setIsExplanationVisible] = useState(false);
  const { targetLanguage, nativeLanguage } = useLanguage();
  const { level } = useLevel();
  const { visits, firstVisit } = useVisits();
  const { viewHistory } = useViews();
  const { width } = useWindowDimensions();
  const [mounted, setMounted] = useState(false);
  const [selectedKeyword, setSelectedKeyword] = useState<{
    id: string;
    targetText: string;
    nativeText: string;
    audioUrl?: string;
  } | null>(null);
  const [isFlashcardVisible, setIsFlashcardVisible] = useState(false);
  const [distributedContent, setDistributedContent] = useState<(Story | InfoCardType | 'try-badge' | { type: 'keywords', ids: string[] })[]>([]);

  const numColumns = useMemo(() => {
    if (Platform.OS !== 'web') return 1;
    if (width >= 1024) return 3;
    if (width >= 768) return 2;
    return 1;
  }, [width]);

  const columnData = useMemo(() => {
    if (Platform.OS !== 'web' || numColumns === 1) {
      return { data: distributedContent };
    }

    const columns = Array.from({ length: numColumns }, () => []);
    distributedContent.forEach((item, index) => {
      columns[index % numColumns].push(item);
    });

    return { data: columns };
  }, [distributedContent, numColumns]);

  const handleExplainPress = useCallback((storyId: string) => {
    const story = stories.find(s => s.id === storyId);
    const explanation = story?.explanations_json?.[nativeLanguage] || null;
    setCurrentExplanation(explanation);
    setIsExplanationVisible(true);
  }, [stories, nativeLanguage]);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (mounted) {
      loadContent();
    }
  }, [mounted, targetLanguage, level, firstVisit]);

  async function loadContent() {
    try {
      setLoading(true);
      
      const [storiesData, infoCardsData] = await Promise.all([
        fetchStoriesAndKeywords(),
        fetchInfoCards()
      ]);

      if (storiesData) {
        const { stories: newStories, keywords: newKeywords } = storiesData;
        setStories(newStories);
        setKeywords(newKeywords);
        
        if (infoCardsData) {
          setInfoCards(infoCardsData);
          
          const content = distributeContent(newStories, infoCardsData, newKeywords, viewHistory, firstVisit);
          setDistributedContent(content);
        }
      }
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchInfoCards() {
    try {
      const { data: cards, error } = await supabase
        .from('info_cards')
        .select('*');

      if (error) throw error;
      return cards || [];
    } catch (error) {
      console.error('Error fetching info cards:', error);
      return [];
    }
  }

  async function fetchStoriesAndKeywords() {
    try {
      const accessibleLevels = getAccessibleLevels(level);

      const { data: storiesData, error: storiesError } = await supabase
        .from('stories')
        .select('*')
        .eq('story_status', 'published')
        .in('level', accessibleLevels);

      if (storiesError) throw storiesError;

      const filteredStories = (storiesData || [])
        .filter(story => {
          const content = story.content_json?.[targetLanguage];
          if (!content || typeof content !== 'string' || content.trim() === '') return false;
          if (story.language && story.language !== targetLanguage) return false;
          return true;
        })
        .sort((a, b) => {
          const aMatchesActiveDay = a.active_day === visits.length;
          const bMatchesActiveDay = b.active_day === visits.length;
          
          if (aMatchesActiveDay && !bMatchesActiveDay) return -1;
          if (!aMatchesActiveDay && bMatchesActiveDay) return 1;
          
          const aDate = a.publish_date || a.created_at;
          const bDate = b.publish_date || b.created_at;
          return new Date(bDate).getTime() - new Date(aDate).getTime();
        });

      const keywordIds = new Set<string>();
      filteredStories.forEach(story => {
        story.keywords?.forEach(keyword => keywordIds.add(keyword));
      });

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
        }, {} as Record<string, Keyword>);
      }

      const formattedStories = filteredStories.map(story => ({
        id: story.id,
        type: story.type,
        description: story.content_json?.[targetLanguage] || '',
        level: story.level,
        imageUrl: story.image_url || null,
        keywords: story.keywords || [],
        audioUrl: story.audio_json?.[targetLanguage] || story.audio_json?.en || undefined,
        translations_json: story.translations_json,
        content_json: story.content_json,
        explanations_json: story.explanations_json,
        gradient: story.gradient,
      }));

      return {
        stories: formattedStories,
        keywords: keywordsMap
      };
    } catch (error) {
      console.error('Error fetching data:', error);
      return null;
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary[500]} />
      </View>
    );
  }

  const renderContent = () => {
    if (Platform.OS !== 'web' || numColumns === 1) {
      return (
        <FlatList
          data={columnData.data}
          keyExtractor={(item) => {
            if (item === 'try-badge') return 'try-badge';
            if (typeof item === 'object' && 'type' in item && item.type === 'keywords') {
              return `keywords-${item.ids.join('-')}`;
            }
            return 'id' in item ? item.id : item.name;
          }}
          renderItem={({ item }) => (
            <View style={styles.cardContainer}>
              {item === 'try-badge' ? (
                visits.length === 1 && (
                  <HelpBadge
                    text={t('example.try')}
                    type="bottomLeft"
                    variant="static"
                  />
                )
              ) : typeof item === 'object' && 'type' in item && item.type === 'keywords' ? (
                <KeywordsCarousel
                  keywords={keywords}
                  selectedKeywords={item.ids}
                  onKeywordPress={(keywordId) => {
                    const keyword = keywords[keywordId];
                    if (!keyword) return;

                    setSelectedKeyword({
                      id: keywordId,
                      targetText: getPrimaryTranslation(keyword.translations_json[targetLanguage]),
                      nativeText: getPrimaryTranslation(keyword.translations_json[nativeLanguage]),
                      audioUrl: keyword.audio_json?.[targetLanguage],
                    });
                    setIsFlashcardVisible(true);
                  }}
                />
              ) : 'active_days' in item ? (
                <InfoCard card={item as InfoCardType} />
              ) : (
                <StoryCard
                  story={item as Story}
                  keywords={keywords}
                  onExplain={() => handleExplainPress(item.id)}
                  onShare={() => console.log('Share story:', item.id)}
                />
              )}
            </View>
          )}
          contentContainerStyle={styles.list}
        />
      );
    }

    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.masonryContainer, { gap: 16 }]}>
          {columnData.data.map((column, columnIndex) => (
            <View key={`column-${columnIndex}`} style={[styles.column, { flex: 1 }]}>
              {column.map((item) => {
                const itemKey = item === 'try-badge' 
                  ? 'try-badge' 
                  : (typeof item === 'object' && 'type' in item && item.type === 'keywords')
                    ? `keywords-${item.ids.join('-')}`
                    : ('id' in item ? item.id : item.name);
                    
                return (
                  <View key={itemKey} style={styles.cardContainer}>
                    {item === 'try-badge' ? (
                      visits.length === 1 && columnIndex === 0 && (
                        <HelpBadge
                          text={t('example.try')}
                          type="bottomLeft"
                          variant="static"
                        />
                      )
                    ) : typeof item === 'object' && 'type' in item && item.type === 'keywords' ? (
                      <KeywordsCarousel
                        keywords={keywords}
                        selectedKeywords={item.ids}
                        onKeywordPress={(keywordId) => {
                          const keyword = keywords[keywordId];
                          if (!keyword) return;

                          setSelectedKeyword({
                            id: keywordId,
                            targetText: getPrimaryTranslation(keyword.translations_json[targetLanguage]),
                            nativeText: getPrimaryTranslation(keyword.translations_json[nativeLanguage]),
                            audioUrl: keyword.audio_json?.[targetLanguage],
                          });
                          setIsFlashcardVisible(true);
                        }}
                      />
                    ) : 'active_days' in item ? (
                      <InfoCard card={item as InfoCardType} />
                    ) : (
                      <StoryCard
                        story={item as Story}
                        keywords={keywords}
                        onExplain={() => handleExplainPress(item.id)}
                        onShare={() => console.log('Share story:', item.id)}
                      />
                    )}
                  </View>
                );
              })}
            </View>
          ))}
        </View>
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      {renderContent()}
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
  scrollContent: {
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    gap: theme.spacing.md,
  },
  list: {
    padding: theme.spacing.md,
  },
  masonryContainer: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    minHeight: '100%',
  },
  column: {
    gap: theme.spacing.md,
  },
  cardContainer: {
    width: '100%',
  },
});