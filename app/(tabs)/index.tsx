import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, useWindowDimensions, Platform, ScrollView } from 'react-native';
import { StoryCard, type Story } from '@/components/StoryCard';
import { InfoCard } from '@/components/InfoCard';
import { HelpBadge } from '@/components/HelpBadge';
import { theme } from '@/theme';
import { ExplanationSheet } from '@/components/ExplanationSheet';
import { useTranslation } from '@/hooks/useTranslation';
import { KeywordsCarousel } from '@/components/KeywordsCarousel';
import { useFeed } from '@/hooks/useFeed';
import { useLanguage } from '@/contexts/LanguageContext'; 
import { useVisits } from '@/contexts/VisitContext';

interface InfoCardType {
  id: string;
  name: string;
  active_days: number;
  content_json: Record<string, {
    title: string;
    description: string;
  }>;
}

function getPrimaryTranslation(translation: string | string[]): string {
  return Array.isArray(translation) ? translation[0] : translation;
}

export default function StoriesScreen() {
  const { t } = useTranslation();
  const { targetLanguage, nativeLanguage } = useLanguage();
  const { visits } = useVisits();
  const [stories, setStories] = useState<Story[]>([]);
  const [infoCards, setInfoCards] = useState<InfoCardType[]>([]);
  const [currentExplanation, setCurrentExplanation] = useState<string | null>(null);
  const [isExplanationVisible, setIsExplanationVisible] = useState(false);
  const { width } = useWindowDimensions();
  const [mounted, setMounted] = useState(false);
  const [selectedKeyword, setSelectedKeyword] = useState<{
    id: string;
    targetText: string;
    nativeText: string;
    audioUrl?: string;
  } | null>(null);
  const [isFlashcardVisible, setIsFlashcardVisible] = useState(false);
  const { feedItems, keywords, loading, loadingMore, error, hasMore, loadMore } = useFeed();

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const numColumns = useMemo(() => {
    if (Platform.OS !== 'web') return 1;
    if (width >= 1024) return 3;
    if (width >= 768) return 2;
    return 1;
  }, [width]);

  const columnData = useMemo(() => {
    if (Platform.OS !== 'web' || numColumns === 1) {
      return { data: feedItems };
    }

    const columns = Array.from({ length: numColumns }, () => []);
    feedItems.forEach((item, index) => {
      columns[index % numColumns].push(item);
    });

    return { data: columns };
  }, [feedItems, numColumns]);

  const handleExplainPress = useCallback((storyId: string) => {
    const story = stories.find(s => s.id === storyId);
    const explanation = story?.explanations_json?.[nativeLanguage] || null;
    setCurrentExplanation(explanation);
    setIsExplanationVisible(true);
  }, [stories, nativeLanguage]);

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
        <View style={{ flex: 1 }}>
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
                  <HelpBadge
                    text={t('example.try')}
                    type="bottomLeft"
                    variant="static"
                  />
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
                  <InfoCard card={item} />
                ) : (
                  <StoryCard
                    story={item}
                    keywords={keywords}
                    onExplain={() => handleExplainPress(item.id)}
                    onShare={() => console.log('Share story:', item.id)}
                  />
                )}
              </View>
            )}
            contentContainerStyle={styles.list}
            onEndReached={() => {
              if (hasMore && !loadingMore) {
                loadMore();
              }
            }}
            onEndReachedThreshold={0.5}
            ListFooterComponent={() => (
              loadingMore ? (
                <View style={styles.loadingMore}>
                  <ActivityIndicator size="large" color={theme.colors.primary[500]} />
                </View>
              ) : null
            )}
          />
        </View>
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
                      visits?.length === 1 && columnIndex === 0 ? (
                        <HelpBadge
                          text={t('example.try')}
                          type="bottomLeft"
                          variant="static"
                        />
                      ) : null
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
  loadingMore: {
    paddingVertical: theme.spacing.lg,
    alignItems: 'center',
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