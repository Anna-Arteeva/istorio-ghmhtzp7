import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { theme } from '@/theme';

interface TranslatableSentenceProps {
  targetText: string;
  nativeText: string;
  showTranslateText?: boolean;
  isShortStory?: boolean;
  forceOpen?: boolean;
}

export function TranslatableSentence({
  targetText,
  nativeText,
  isShortStory = false,
  forceOpen = false,
}: TranslatableSentenceProps) {
  const [isTranslationVisible, setIsTranslationVisible] = useState(forceOpen);

  useEffect(() => {
    setIsTranslationVisible(forceOpen);
  }, [forceOpen]);

  const toggleTranslation = () => {
    if (!forceOpen) {
      setIsTranslationVisible(!isTranslationVisible);
    }
  };

  return (
    <View style={styles.container}>
      <Pressable 
        style={styles.sentenceContainer} 
        onPress={toggleTranslation}
        android_ripple={{ color: theme.colors.gray[100] }}
      >
        <View style={styles.textContainer}>
          <Text style={isShortStory ? styles.shortStoryText : styles.targetText}>
            {targetText}
          </Text>
          {isTranslationVisible && nativeText && (
            <View style={styles.translationContainer}>
              <Text style={styles.nativeText}>{nativeText}</Text>
            </View>
          )}
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  sentenceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 4,
    borderRadius: theme.borderRadius.md,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        ':hover': {
          backgroundColor: theme.colors.gray[50],
        },
      },
      default: {
        // Add touch feedback styles for mobile
        backgroundColor: 'transparent',
      },
    }),
  },
  textContainer: {
    flex: 1,
  },
  targetText: {
    ...theme.typography.bodyLead,
    color: theme.colors.gray[900],
    lineHeight: Platform.OS === 'web' ? 24 : 26,
  },
  shortStoryText: {
    ...theme.typography.bodyShortStory,
    color: theme.colors.gray[900],
    lineHeight: Platform.OS === 'web' ? 32 : 34,
  },
  translationContainer: {
    marginTop: 4,
  },
  nativeText: {
    ...theme.typography.body2,
    color: theme.colors.gray[500],
    lineHeight: Platform.OS === 'web' ? 18 : 20,
  },
});