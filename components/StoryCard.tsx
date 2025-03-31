import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  Platform,
  LayoutAnimation,
} from 'react-native';
import {
  Languages,
  Plus,
  Check,
  ChevronDown,
  ChevronUp,
} from 'lucide-react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSavedPhrases } from '@/contexts/SavedPhrasesContext';
import { useSettings } from '@/contexts/SettingsContext';
import { useLevel } from '@/contexts/LevelContext';
import { theme } from '@/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { FaceThinkingIcon } from '@/components/CustomIcons';
import { Flashcard } from '@/components/Flashcard';
import { TranslatableSentence } from '@/components/TranslatableSentence';
import { AudioPlayer } from '@/components/AudioPlayer';
import { useTranslation } from '@/hooks/useTranslation';
import { useViews } from '@/contexts/ViewContext';

interface Keyword {
  keyword_id: string;
  translations_json: Record<string, string | string[]>;
  audio_json: Record<string, string>;
  word_level: string;
}

function getPrimaryTranslation(translation: string | string[]): string {
  return Array.isArray(translation) ? translation[0] : translation;
}

function parseContent(content: string | undefined | null): string[] {
  if (!content || typeof content !== 'string') return [];
  return content.split('|').map((text) => text.trim());
}

export interface Story {
  id: string;
  type: 'long' | 'short';
  description: string;
  level: string;
  imageUrl: string | null;
  keywords: string[];
  audioUrl?: string;
  translations_json?: Record<string, string>;
  content_json?: Record<string, string>;
  explanations_json?: Record<string, string>;
  gradient?: string;
}

interface StoryCardProps {
  story: Story;
  keywords: Record<string, Keyword>;
  onShare?: () => void;
  hideImage?: boolean;
  hideAudio?: boolean;
  hideActions?: boolean;
}

const GRADIENT_COLORS = [
  'rgba(143, 239, 252, 1)',
  'rgba(104, 212, 249, 1)',
  'rgba(255, 199, 238, 1)',
  'rgba(246, 164, 235, 1)',
  'rgba(222, 246, 168, 1)',
];

function getRandomGradient() {
  const colors = [...GRADIENT_COLORS];
  const firstIndex = Math.floor(Math.random() * colors.length);
  const firstColor = colors[firstIndex];
  colors.splice(firstIndex, 1);
  const secondIndex = Math.floor(Math.random() * colors.length);
  const secondColor = colors[secondIndex];
  return [firstColor, secondColor];
}

export function StoryCard({
  story,
  keywords,
  onShare,
  hideImage = false,
  hideAudio = false,
  hideActions = false,
}: StoryCardProps) {
  const { recordView } = useViews();
  const { t } = useTranslation();
  const { nativeLanguage, targetLanguage } = useLanguage();
  const { level } = useLevel();
  const { addPhrase, removePhrase, isPhraseSaved } = useSavedPhrases();
  const { showTranslationsByDefault } = useSettings();
  const [selectedKeyword, setSelectedKeyword] = useState<{
    id: string;
    targetText: string;
    nativeText: string;
    audioUrl?: string;
  } | null>(null);
  const [isFlashcardVisible, setIsFlashcardVisible] = useState(false);
  const [areTranslationsVisible, setAreTranslationsVisible] = useState(showTranslationsByDefault);
  const [isExplanationVisible, setIsExplanationVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  const targetContent = story?.content_json?.[targetLanguage];
  const nativeContent = story?.content_json?.[nativeLanguage];

  const targetSentences = useMemo(
    () => parseContent(targetContent),
    [targetContent]
  );
  const nativeSentences = useMemo(
    () => parseContent(nativeContent),
    [nativeContent]
  );

  const gradientColors = useMemo(() => getRandomGradient(), [story.id]);

  // Filter keywords to only show those matching user's exact level
  const filteredKeywords = useMemo(() => {
    return story.keywords.filter((keywordId) => {
      const keyword = keywords[keywordId];
      return keyword?.word_level === level;
    });
  }, [story.keywords, keywords, level]);

  useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
    };
  }, []);

  useEffect(() => {
    recordView(story.id, 'story');
  }, [story.id]);

  const handleKeywordPress = (keywordId: string) => {
    const keyword = keywords[keywordId];
    if (!keyword) return;

    setSelectedKeyword({
      id: keywordId,
      targetText: getPrimaryTranslation(
        keyword.translations_json[targetLanguage]
      ),
      nativeText: getPrimaryTranslation(
        keyword.translations_json[nativeLanguage]
      ),
      audioUrl: keyword.audio_json?.[targetLanguage],
    });
    setIsFlashcardVisible(true);
  };

  const toggleExplanation = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExplanationVisible(!isExplanationVisible);
  };

  const toggleSavePhrase = async (keywordId: string, event: any) => {
    // Stop event propagation to prevent triggering the parent's onPress
    event.stopPropagation();

    if (!mounted) return;

    if (isPhraseSaved(keywordId)) {
      await removePhrase(keywordId);
    } else {
      await addPhrase(keywordId);
    }
  };

  const renderKeyword = (keywordId: string, index: number) => {
    const keyword = keywords[keywordId];
    if (!keyword) return null;

    const targetTranslation = getPrimaryTranslation(
      keyword.translations_json[targetLanguage]
    );
    const nativeTranslation = getPrimaryTranslation(
      keyword.translations_json[nativeLanguage]
    );
    const audioUrl = keyword.audio_json?.[targetLanguage];
    const saved = isPhraseSaved(keywordId);

    return (
      <View key={index} style={styles.keyword}>
        <Pressable
          style={styles.actionButton}
          onPress={(event) => toggleSavePhrase(keywordId, event)}
        >
          {saved ? (
            <Check size={20} color={theme.colors.gray[500]} />
          ) : (
            <Plus size={20} color={theme.colors.gray[500]} />
          )}
        </Pressable>
        <View style={styles.keywordTextContainer}>
          <Text style={styles.keywordText}>{targetTranslation}</Text>
          {nativeTranslation && (
            <Text style={styles.keywordTranslation}>{nativeTranslation}</Text>
          )}
        </View>
        <View style={styles.keywordActions}>
          {audioUrl && <AudioPlayer size="small" url={audioUrl} />}
        </View>
      </View>
    );
  };

  const renderCardContent = () => (
    <View style={styles.content}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {!hideAudio && story.audioUrl && (
            <AudioPlayer url={story.audioUrl} size="medium" variant="primary" />
          )}
        </View>
      </View>

      <View style={styles.storyContent}>
        {targetSentences.map((sentence, index) => (
          <TranslatableSentence
            key={index}
            targetText={sentence}
            nativeText={nativeSentences[index] || ''}
            isShortStory={story.type === 'short'}
            forceOpen={areTranslationsVisible}
          />
        ))}
      </View>

      {!hideActions && story?.explanations_json?.[nativeLanguage] && (
        <View>
          <Pressable
            style={[
              styles.decoderButton,
              isExplanationVisible && styles.decoderButtonActive,
            ]}
            onPress={toggleExplanation}
          >
            <FaceThinkingIcon
              size={14}
              color={
                isExplanationVisible
                  ? theme.colors.white
                  : theme.colors.gray[500]
              }
            />
            <Text
              style={[
                styles.decoderButtonText,
                isExplanationVisible && styles.decoderButtonTextActive,
              ]}
            >
              {t('common.storyDecoder')}
            </Text>
          </Pressable>
          {isExplanationVisible && (
            <View style={styles.explanationContainer}>
              <Text style={styles.explanationText}>
                {story.explanations_json[nativeLanguage]}
              </Text>
            </View>
          )}
        </View>
      )}

      {Object.keys(keywords).length > 0 && (
        <View style={styles.keywords}>
          {filteredKeywords.map((keywordId, index) =>
            renderKeyword(keywordId, index)
          )}
        </View>
      )}
    </View>
  );

  const cardStyle = Platform.select({
    ios: {
      ...styles.card,
      shadowColor: theme.colors.gray[900],
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      ...theme.shadows.lg,
      borderColor: theme.colors.gray[200],
      borderWidth: 1,
    },
    android: {
      ...styles.card,
      elevation: 4,
    },
    default: {
      ...styles.card,
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    },
  });

  const shortCardStyle = Platform.select({
    ios: {
      ...styles.shortCard,
      shadowColor: theme.colors.gray[900],
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      ...theme.shadows.lg,
    },
    android: {
      ...styles.shortCard,
      elevation: 4,
    },
    default: {
      ...styles.shortCard,
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    },
  });

  if (!story) return null;

  return (
    <View style={{ flex: 1 }}>
      {story.type === 'short' ? (
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={shortCardStyle}
        >
          {renderCardContent()}
        </LinearGradient>
      ) : (
        <View style={cardStyle}>
          {!hideImage && story.imageUrl && (
            <Image source={{ uri: story.imageUrl }} style={styles.coverImage} />
          )}
          {renderCardContent()}
        </View>
      )}
      {selectedKeyword && (
        <Flashcard
          keyword={selectedKeyword}
          visible={isFlashcardVisible}
          onClose={() => setIsFlashcardVisible(false)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    marginBottom: theme.spacing.md,
  },
  shortCard: {
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    marginBottom: theme.spacing.sm,
  },
  content: {},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
  },
  actions: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
    alignItems: 'center',
  },
  coverImage: {
    width: '100%',
    height: 200,
    backgroundColor: theme.colors.gray[100],
  },
  levelBadge: {
    backgroundColor: theme.colors.gray[100],
    paddingHorizontal: theme.spacing.sm + 2,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
  },
  levelText: {
    ...theme.typography.caption,
    color: theme.colors.gray[500],
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.gray[50],
  },
  actionButtonActive: {
    backgroundColor: theme.colors.gray[900],
  },
  storyContent: {
    paddingHorizontal: theme.spacing.md,
  },
  keywords: {
    flexDirection: 'column',
    backgroundColor: theme.colors.gray[50],
    paddingHorizontal: theme.spacing.md,
    display: 'inline-block',
  },
  keyword: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    marginVertical: theme.spacing.md,
  },
  keywordTextContainer: {
    flex: 1,
  },
  keywordText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
    lineHeight: 15,
    color: theme.colors.gray[800],
  },
  keywordTranslation: {
    fontSize: 13,
    lineHeight: 16,
    color: theme.colors.gray[500],
    marginTop: 2,
  },
  keywordActions: {
    marginLeft: theme.spacing.sm,
  },
  decoderButton: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.gray[50],
    borderRadius: theme.borderRadius.md,
    alignSelf: 'baseline',
    margin: theme.spacing.md,
  },
  decoderButtonActive: {
    backgroundColor: theme.colors.gray[900],
  },
  decoderButtonText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 13,
    color: theme.colors.gray[500],
  },
  decoderButtonTextActive: {
    color: theme.colors.white,
  },
  explanationContainer: {
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  explanationText: {
    fontSize: 16,
    lineHeight: 24,
    color: theme.colors.gray[600],
  },
});

export { StoryCard };

export { StoryCard };

export { StoryCard };
