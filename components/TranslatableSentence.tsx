import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { theme, useTheme } from '@/theme';

interface TranslatableSentenceProps {
  targetText: string;
  nativeText: string;
  showTranslateText?: boolean;
  isShortStory?: boolean;
  forceOpen?: boolean;
  isInfoCard?: boolean;
  customStyles?: {
    target?: any[];
    native?: any[];
  };
}

export function TranslatableSentence({
  targetText,
  nativeText,
  isShortStory = false,
  forceOpen = false,
  isInfoCard = false,
  customStyles
}: TranslatableSentenceProps) {
  const currentTheme = useTheme();
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
    // For info cards, use level-based language swapping
    const primaryText = targetText;
    const secondaryText = nativeText;

    return (
      <>
        <Text 
          style={[
            customStyles?.target || (isShortStory ? styles.shortStoryText : styles.targetText),
            { color: currentTheme.colors.gray[900] }
          ]}
        >
          {primaryText}
        </Text>
        {isOpen && (
          <View style={styles.translationContainer}>
            <Text 
              style={[
                customStyles?.native || styles.nativeText,
                { color: currentTheme.colors.gray[500] }
              ]}
            >
              {secondaryText}
            </Text>
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
    lineHeight: Platform.OS === 'web' ? 24 : 26,
  },
  shortStoryText: {
    ...theme.typography.bodyShortStory,
    lineHeight: Platform.OS === 'web' ? 32 : 34,
  },
  translationContainer: {
    marginTop: 4,
  },
  nativeText: {
    ...theme.typography.body2,
    lineHeight: Platform.OS === 'web' ? 18 : 20,
  },
});