import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, Modal, Platform, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, ChevronRight, X, Volume2, VolumeX } from 'lucide-react-native';
import { theme } from '@/theme';
import { useSavedPhrases } from '@/contexts/SavedPhrasesContext';
import { PracticeCard } from '@/components/PracticeCard';
import { Audio } from 'expo-av';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabase';

interface PhraseWithTranslations {
  id: string;
  targetText: string;
  nativeText: string;
  audioUrl?: string;
}

function getPrimaryTranslation(translation: string | string[]): string {
  return Array.isArray(translation) ? translation[0] : translation;
}

export default function PracticeScreen() {
  const router = useRouter();
  const { savedPhrases } = useSavedPhrases();
  const { targetLanguage, nativeLanguage } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [phrasesWithTranslations, setPhrasesWithTranslations] = useState<PhraseWithTranslations[]>([]);

  useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
      if (sound) {
        sound.unloadAsync();
      }
    };
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

  const handleNext = useCallback(async () => {
    if (!mounted) return;
    
    if (currentIndex < phrasesWithTranslations.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, mounted, phrasesWithTranslations.length]);

  const handlePrevious = useCallback(async () => {
    if (!mounted) return;

    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex, mounted]);

  const handleClose = useCallback(async () => {
    if (!mounted) return;
    router.back();
  }, [mounted, router]);

  const toggleMute = useCallback(() => {
    if (!mounted) return;
    setIsMuted(!isMuted);
  }, [isMuted, mounted]);

  if (!phrasesWithTranslations.length) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable style={styles.closeButton} onPress={handleClose}>
            <X size={24} color={theme.colors.gray[900]} />
          </Pressable>
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            No saved phrases to practice.{'\n'}Add some phrases from stories first!
          </Text>
        </View>
      </View>
    );
  }

  const currentPhrase = phrasesWithTranslations[currentIndex];

  return (
    <View style={styles.container}>
      <View style={styles.contentWrapper}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Pressable style={styles.muteButton} onPress={toggleMute}>
              {isMuted ? (
                <VolumeX size={24} color={theme.colors.gray[900]} />
              ) : (
                <Volume2 size={24} color={theme.colors.gray[900]} />
              )}
            </Pressable>
          </View>
          <View style={styles.progress}>
            <Text style={styles.progressText}>
              {currentIndex + 1} of {phrasesWithTranslations.length}
            </Text>
          </View>
          <Pressable style={styles.closeButton} onPress={handleClose}>
            <X size={24} color={theme.colors.gray[900]} />
          </Pressable>
        </View>

        <View style={styles.content}>
          <PracticeCard 
            phrase={currentPhrase}
            onSoundLoaded={setSound}
            autoPlay={!isMuted}
            onNavigate={() => {
              if (sound) {
                sound.stopAsync();
              }
            }}
          />
        </View>

        <View style={styles.navigation}>
          <Pressable
            style={[styles.navButton, currentIndex === 0 && styles.navButtonDisabled]}
            onPress={handlePrevious}
            disabled={currentIndex === 0}
          >
            <ChevronLeft
              size={24}
              color={currentIndex === 0 ? theme.colors.gray[300] : theme.colors.gray[900]}
            />
          </Pressable>
          <Pressable
            style={[
              styles.navButton,
              currentIndex === phrasesWithTranslations.length - 1 && styles.navButtonDisabled,
            ]}
            onPress={handleNext}
            disabled={currentIndex === phrasesWithTranslations.length - 1}
          >
            <ChevronRight
              size={24}
              color={
                currentIndex === phrasesWithTranslations.length - 1
                  ? theme.colors.gray[300]
                  : theme.colors.gray[900]
              }
            />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.pageBackground,
  },
  contentWrapper: {
    flex: 1,
    ...Platform.select({
      web: {
        maxWidth: 640,
        width: '100%',
        alignSelf: 'center',
      },
    }),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 24 : 24,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  headerLeft: {
    width: 40,
  },
  muteButton: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.gray[50],
    justifyContent: 'center',
    alignItems: 'center',
  },
  progress: {
    backgroundColor: theme.colors.gray[50],
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
  },
  progressText: {
    ...theme.typography.caption,
    color: theme.colors.gray[500],
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.gray[50],
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
    paddingBottom: 0,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  navButton: {
    flex: 1,
    height: 48,
    backgroundColor: theme.colors.gray[50],
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyStateText: {
    ...theme.typography.body1,
    color: theme.colors.gray[500],
    textAlign: 'center',
  },
});