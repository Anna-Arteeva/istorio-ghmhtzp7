import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform } from 'react-native';
import { theme } from '@/theme';
import { AudioPlayer } from '@/components/AudioPlayer';
import { Plus, Check } from 'lucide-react-native';
import { useSavedPhrases } from '@/contexts/SavedPhrasesContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { HelpBadge } from '@/components/HelpBadge';

interface Keyword {
  keyword_id: string;
  translations_json: Record<string, string | string[]>;
  audio_json: Record<string, string>;
}

interface KeywordsCarouselProps {
  keywords: Record<string, Keyword>;
  selectedKeywords: string[];
  onKeywordPress: (keywordId: string) => void;
}

function getPrimaryTranslation(translation: string | string[]): string {
  return Array.isArray(translation) ? translation[0] : translation;
}

export function KeywordsCarousel({ keywords, selectedKeywords, onKeywordPress }: KeywordsCarouselProps) {
  const { targetLanguage, nativeLanguage } = useLanguage();
  const { isPhraseSaved, addPhrase, removePhrase } = useSavedPhrases();

  const toggleSavePhrase = async (keywordId: string) => {
    const keyword = keywords[keywordId];
    if (!keyword) return;

    const targetText = getPrimaryTranslation(keyword.translations_json[targetLanguage]);
    const nativeText = getPrimaryTranslation(keyword.translations_json[nativeLanguage]);
    const audioUrl = keyword.audio_json?.[targetLanguage];

    if (isPhraseSaved(keywordId)) {
      await removePhrase(keywordId);
    } else {
      await addPhrase(keywordId);
    }
  };

  if (!selectedKeywords.length) return null;

  return (
    <View style={styles.container}>
      <HelpBadge
        text="Repeat key phrases"
        type="bottomLeft"
        variant="static"
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {selectedKeywords.map((keywordId) => {
          const keyword = keywords[keywordId];
          if (!keyword) return null;

          const targetTranslation = getPrimaryTranslation(keyword.translations_json[targetLanguage]);
          const nativeTranslation = getPrimaryTranslation(keyword.translations_json[nativeLanguage]);
          const audioUrl = keyword.audio_json?.[targetLanguage];
          const saved = isPhraseSaved(keywordId);

          return (
            <View key={keywordId} style={styles.card}>
              <Pressable
                style={styles.cardContent}
                onPress={() => onKeywordPress(keywordId)}
              >
                <Text style={styles.targetText}>{targetTranslation}</Text>
                <Text style={styles.nativeText}>{nativeTranslation}</Text>
              </Pressable>
              <View style={styles.actions}>
                {audioUrl && (
                  <AudioPlayer url={audioUrl} size={36} />
                )}
                <Pressable
                  style={styles.actionButton}
                  onPress={() => toggleSavePhrase(keywordId)}
                >
                  {saved ? (
                    <Check size={20} color={theme.colors.gray[500]} />
                  ) : (
                    <Plus size={20} color={theme.colors.gray[500]} />
                  )}
                </Pressable>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.xs,
    paddingBottom: theme.spacing.lg,
    gap: theme.spacing.md,
    alignItems: 'flex-start',
  },
  card: {
    backgroundColor: theme.colors.gray[100],
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    width: 280,
  },
  cardContent: {
    marginBottom: theme.spacing.md,
    alignItems: 'center',
    textAlign: 'center',
    gap: theme.spacing.md,
  },
  targetText: {
    ...theme.typography.heading2,
    color: theme.colors.gray[900],
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  nativeText: {
    ...theme.typography.body2,
    color: theme.colors.gray[500],
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
    justifyContent: 'center',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.gray[50],
    justifyContent: 'center',
    alignItems: 'center',
  },
});