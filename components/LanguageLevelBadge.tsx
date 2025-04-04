import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { theme, useTheme } from '@/theme';
import { LanguageIcon } from '@/components/LanguageIcon';
import { LANGUAGE_LEVELS, type LanguageLevel } from '@/lib/constants';

interface LanguageLevelBadgeProps {
  language: string;
  level: LanguageLevel;
  title: string;
}

export function LanguageLevelBadge({
  language,
  level,
  title,
}: LanguageLevelBadgeProps) {
  const currentTheme = useTheme();
  const router = useRouter();
  const levelConfig = LANGUAGE_LEVELS[level];

  return (
    <View style={[styles.header, { backgroundColor: currentTheme.colors.pageBackground }]}>
      <Pressable style={styles.badge} onPress={() => router.push('/settings')}>
        <View style={[styles.badgeContent, { backgroundColor: currentTheme.colors.gray[100] }]}>
          <View style={styles.iconContainer}>
            <LanguageIcon 
              language={language} 
              size={14} 
              color={currentTheme.colors.gray[900]} 
            />
          </View>
          <Text style={[styles.language, { color: currentTheme.colors.gray[900] }]}>
            {language.toUpperCase()}
          </Text>
          <View
            style={[
              styles.levelBadge,
              { backgroundColor: levelConfig.color }
            ]}
          >
            <Text style={[
              styles.level,
              { color: levelConfig.textColor }
            ]}>
              {level}
            </Text>
          </View>
        </View>
      </Pressable>
      <Text style={[styles.title, { color: currentTheme.colors.gray[900] }]}>
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  badge: {},
  badgeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.borderRadius.md,
    paddingVertical: 0,
    paddingLeft: 8,
    gap: 6,
  },
  iconContainer: {
    marginRight: 2,
  },
  language: {
    ...theme.typography.caption,
    fontFamily: 'Montserrat-SemiBold',
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderTopRightRadius: theme.borderRadius.md,
    borderBottomRightRadius: theme.borderRadius.md,
  },
  level: {
    ...theme.typography.caption,
    fontFamily: 'Montserrat-SemiBold',
  },
  title: {
    ...theme.typography.heading1,
    flex: 1,
  },
});