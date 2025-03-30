import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { theme } from '@/theme';
import { useLevel } from '@/contexts/LevelContext';
import { type LanguageLevel } from '@/lib/constants';

interface TranslatableSentenceProps {
  targetText: string;
  nativeText: string;
  showTranslateText?: boolean;
  isShortStory?: boolean;
  forceOpen?: boolean;
  customStyles?: {
    target?: any[];
    native?: any[];
  };
}

const ADVANCED_LEVELS: LanguageLevel[] = ['B2', 'C1', 'C2'];

export function TranslatableSentence({
  targetText,
  nativeText,
  isShortStory = false,
  forceOpen = false,
  customStyles
}: TranslatableSentenceProps) {
  const { level } = useLevel();
  const isAdvancedLevel = ADVANCED_LEVELS.includes(level);
  const [isOpen, setIsOpen] = useState(true);
  
  // Update state when forceOpen prop changes
  useEffect(() => {
    // Only allow forceOpen to close the translation
    if (!forceOpen) {
      setIsOpen(false);
    }
  }, [forceOpen]);

  const handlePress = () => {
    // Always allow toggling, regardless of forceOpen state
    setIsOpen(!isOpen);
  };

  const renderContent = () => {
    const primaryText = isAdvancedLevel ? targetText : nativeText;
    const secondaryText = isAdvancedLevel ? nativeText : targetText;

    return (
      <>
        <Text style={customStyles?.target || (isShortStory ? styles.shortStoryText : styles.targetText)}>
          {primaryText}
        </Text>
        {isOpen && (
          <View style={styles.translationContainer}>
            <Text style={customStyles?.native || styles.nativeText}>{secondaryText}</Text>
          </View>
        )}
      </>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.sentenceContainer} 
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <View style={styles.textContainer}>
          {renderContent()}
        </View>
      </TouchableOpacity>
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
    ...Platform.select({
      web: {
        cursor: 'pointer',
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