import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { Trash2 } from 'lucide-react-native';
import { useSavedPhrases } from '@/contexts/SavedPhrasesContext';
import { useState, useEffect } from 'react';
import { theme, useTheme } from '@/theme';
import { Flashcard } from '@/components/Flashcard';
import { AudioPlayer } from '@/components/AudioPlayer';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabase';

interface Keyword {
  keyword_id: string;
  translations_json: Record<string, string | string[]>;
  audio_json: Record<string, string>;
}

interface PhraseWithTranslations {
  id: string;
  targetText: string;
  nativeText: string;
  audioUrl?: string;
}

function getPrimaryTranslation(translation: string | string[]): string {
  return Array.isArray(translation) ? translation[0] : translation;
}

export default function PhrasesScreen() {
  const currentTheme = useTheme();
  const { savedPhrases, removePhrase } = useSavedPhrases();
  const { targetLanguage, nativeLanguage } = useLanguage();
  const [selectedPhrase, setSelectedPhrase] = useState<PhraseWithTranslations | null>(null);
  const [isFlashcardVisible, setIsFlashcardVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [phrasesWithTranslations, setPhrasesWithTranslations] = useState<PhraseWithTranslations[]>([]);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (mounted && savedPhrases.length > 0) {
      fetchPhraseTranslations();
    } else {
      setPhrasesWithTranslations([]);
    }
  }, [mounted, savedPhrases, targetLanguage, nativeLanguage]);

  async function fetchPhraseTranslations() {
    try {
      const { data: keywordsData, error } = await supabase
        .from('keywords')
        .select('keyword_id, translations_json, audio_json')
        .in('keyword_id', savedPhrases);

      if (error) throw error;

      const translatedPhrases = (keywordsData || []).map(keyword => ({
        id: keyword.keyword_id,
        targetText: getPrimaryTranslation(keyword.translations_json[targetLanguage]),
        nativeText: getPrimaryTranslation(keyword.translations_json[nativeLanguage]),
        audioUrl: keyword.audio_json?.[targetLanguage],
      }));

      setPhrasesWithTranslations(translatedPhrases);
    } catch (error) {
      console.error('Error fetching phrase translations:', error);
    }
  }

  const handlePhrasePress = (phrase: PhraseWithTranslations) => {
    if (!mounted) return;
    setSelectedPhrase(phrase);
    setIsFlashcardVisible(true);
  };

  const handleRemovePhrase = async (id: string) => {
    if (!mounted) return;
    await removePhrase(id);
  };

  const renderPhrase = ({ item }: { item: PhraseWithTranslations }) => (
    <Pressable
      style={[styles.phraseCard, { backgroundColor: currentTheme.colors.white }]}
      onPress={() => handlePhrasePress(item)}
    >
      <View style={styles.phraseContent}>
        <Text style={[styles.phrase, { color: currentTheme.colors.gray[800] }]}>
          {item.targetText}
        </Text>
        <Text style={[styles.translation, { color: currentTheme.colors.gray[500] }]}>
          {item.nativeText}
        </Text>
      </View>
      <View style={styles.actions}>
        {item.audioUrl && (
          <AudioPlayer 
            url={item.audioUrl} 
            size="small"
            variant="secondary"
          />
        )}
        <Pressable
          style={[styles.actionButton, { backgroundColor: currentTheme.colors.gray[50] }]}
          onPress={() => handleRemovePhrase(item.id)}
        >
          <Trash2 size={20} color={currentTheme.colors.gray[400]} />
        </Pressable>
      </View>
    </Pressable>
  );

  // Create a reversed copy of phrasesWithTranslations to show newest first
  const reversedPhrases = [...phrasesWithTranslations].reverse();

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.colors.pageBackground }]}>
      <FlatList
        data={reversedPhrases}
        keyExtractor={(item) => item.id}
        renderItem={renderPhrase}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={[styles.emptyStateText, { color: currentTheme.colors.gray[500] }]}>
              No saved phrases yet. Add some phrases from stories!
            </Text>
          </View>
        }
      />
      {selectedPhrase && (
        <Flashcard
          keyword={selectedPhrase}
          visible={isFlashcardVisible}
          onClose={() => {
            if (mounted) {
              setIsFlashcardVisible(false);
              setSelectedPhrase(null);
            }
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: theme.spacing.md,
  },
  phraseCard: {
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    ...theme.shadows.lg,
  },
  phraseContent: {
    flex: 1,
  },
  phrase: {
    ...theme.typography.body1,
    marginBottom: theme.spacing.xs,
  },
  translation: {
    ...theme.typography.body2,
  },
  actions: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  emptyStateText: {
    ...theme.typography.body1,
    textAlign: 'center',
  },
});