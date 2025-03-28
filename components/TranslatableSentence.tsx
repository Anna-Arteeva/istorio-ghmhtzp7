import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
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
  const [isOpen, setIsOpen] = useState(forceOpen);
  
  // Update state when forceOpen prop changes
  useEffect(() => {
    setIsOpen(forceOpen);
  }, [forceOpen]);

  const handlePress = () => {
    // Always allow toggling, regardless of forceOpen state
    setIsOpen(!isOpen);
  };

  const renderContent = () => {
    return (
      <>
        <Text style={isShortStory ? styles.shortStoryText : styles.targetText}>
          {targetText}
        </Text>
        {isOpen && (
          <View style={styles.translationContainer}>
            <Text style={styles.nativeText}>{nativeText}</Text>
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