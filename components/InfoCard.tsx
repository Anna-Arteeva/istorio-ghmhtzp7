import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { theme, useTheme } from '@/theme';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLevel } from '@/contexts/LevelContext';
import { ExampleStory } from '@/components/ExampleStory';
import { TranslatableSentence } from '@/components/TranslatableSentence';
import { LANGUAGE_LEVELS } from '@/lib/constants';
import { useViews } from '@/contexts/ViewContext';
import { useSettings } from '@/contexts/SettingsContext';

interface InfoCardContent {
  title: string;
  description: string;
  quote?: string;
}

interface InfoCard {
  id: string;
  name: string;
  type?: 'progress' | 'culture' | 'tip';
  active_days: number;
  content_json: Record<string, InfoCardContent>;
}

interface InfoCardProps {
  card: InfoCard;
  onPress?: () => void;
}

const ADVANCED_LEVELS = ['B2', 'C1', 'C2'];

export function InfoCard({ card, onPress }: InfoCardProps) {
  const currentTheme = useTheme();
  const { nativeLanguage, targetLanguage } = useLanguage();
  const { recordView } = useViews();
  const { level } = useLevel();
  const { showTranslationsByDefault } = useSettings();
  
  // Record view when the card is rendered
  useEffect(() => {
    recordView(card.id, 'info_card');
  }, [card.id]);

  // Get content in both target and native languages
  const targetContent = card.content_json[targetLanguage] || card.content_json.en;
  const nativeContent = card.content_json[nativeLanguage] || card.content_json.en;
  
  if (!targetContent || !nativeContent) return null;

  const isCultureCard = card.type === 'culture';
  const isTipCard = card.type === 'tip';
  const isProgressCard = !card.type || card.type === 'progress';
  const levelConfig = LANGUAGE_LEVELS[level];

  return (
    <Pressable 
      style={[
        styles.container,
        isProgressCard && { backgroundColor: currentTheme.colors.gradients.cyan },
        isCultureCard && { backgroundColor: currentTheme.colors.gradients.blue },
        isTipCard && { backgroundColor: currentTheme.colors.gray[100] }
      ]}
      onPress={onPress}
    >
      <View style={styles.content}>
        {isCultureCard && (
          <View style={styles.header}>
            <View style={[styles.cultureBadge, { backgroundColor: currentTheme.colors.semiWhite[700] }]}>
              <View style={styles.languageCode}>
                <Text style={[styles.languageText, { color: currentTheme.colors.gray[900] }]}>
                  {targetLanguage.toUpperCase()}
                </Text>
              </View>
              <View style={[
                styles.levelBadge,
                { backgroundColor: levelConfig.color }
              ]}>
                <Text style={[
                  styles.levelText,
                  { color: levelConfig.textColor }
                ]}>
                  {level}
                </Text>
              </View>
            </View>
            <Text style={[styles.brandText, { color: currentTheme.colors.white }]}>
              Istorio
            </Text>
          </View>
        )}
        
        {isTipCard && (
          <View style={[styles.tipBadge, { backgroundColor: currentTheme.colors.primary[500] }]}>
            <Text style={[styles.tipBadgeText, { color: currentTheme.colors.white }]}>
              Pro Tip
            </Text>
          </View>
        )}

        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: currentTheme.colors.gray[900] }]}>
            {targetContent.title}
          </Text>
          <Text style={[styles.nativeTitle, { color: currentTheme.colors.gray[400] }]}>
            {nativeContent.title}
          </Text>
        </View>
        
        <View style={styles.descriptionContainer}>
          <TranslatableSentence
            targetText={targetContent.description}
            nativeText={nativeContent.description}
            isShortStory={false}
            isInfoCard={true}
            forceOpen={showTranslationsByDefault}
            customStyles={{
              target: [
                styles.description,
                isCultureCard && [styles.cultureDescription, { color: currentTheme.colors.gray[900] }],
                isTipCard && [styles.tipDescription, { color: currentTheme.colors.gray[900] }],
                isProgressCard && [styles.progressDescription, { color: currentTheme.colors.gray[900] }]
              ],
              native: [
                styles.descriptionTranslation,
                isCultureCard && [styles.cultureDescriptionTranslation, { color: currentTheme.colors.gray[400] }],
                isTipCard && [styles.tipDescriptionTranslation, { color: currentTheme.colors.gray[400] }],
                isProgressCard && [styles.progressDescriptionTranslation, { color: currentTheme.colors.gray[400] }]
              ]
            }}
          />
        </View>

        {targetContent.quote && (
          <View style={[styles.quoteContainer, { backgroundColor: currentTheme.colors.semiWhite[600] }]}>
            <View style={[styles.quoteBadge, { backgroundColor: currentTheme.colors.white }]}>
              <Text style={[styles.quoteBadgeText, { color: currentTheme.colors.gray[900] }]}>
                {targetLanguage.toUpperCase()}
              </Text>
            </View>
            <Text style={[styles.quoteText, { color: currentTheme.colors.gray[900] }]}>
              {targetContent.quote}
            </Text>
          </View>
        )}
        
        {card.name === 'welcome' && <ExampleStory />}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: theme.borderRadius.xl,
    overflow: 'visible',
    marginBottom: theme.spacing.xl,
    marginTop: theme.spacing.md,
  },
  content: {
    padding: theme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  cultureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
  },
  languageCode: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
  },
  languageText: {
    ...theme.typography.caption,
    fontFamily: 'Montserrat-SemiBold',
  },
  levelBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  levelText: {
    ...theme.typography.caption,
    fontFamily: 'Montserrat-SemiBold',
  },
  brandText: {
    fontFamily: 'Montserrat-ExtraBold',
  },
  tipBadge: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderBottomRightRadius: theme.borderRadius.lg,
    position: 'absolute',
    top: -12,
    left: 0,
  },
  tipBadgeText: {
    ...theme.typography.caption,
    fontFamily: 'Montserrat-Bold',
  },
  quoteContainer: {
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginTop: theme.spacing.xl,
  },
  quoteBadge: {
    position: 'absolute',
    top: -10,
    left: 0,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderBottomRightRadius: theme.borderRadius.lg,
  },
  quoteBadgeText: {
    ...theme.typography.caption,
    fontFamily: 'Montserrat-Bold',
  },
  quoteText: {
    ...theme.typography.body1,
    marginTop: theme.spacing.sm,
  },
  titleContainer: {
    gap: theme.spacing.xs,
  },
  title: {
    ...theme.typography.heading1,
  },
  nativeTitle: {
    ...theme.typography.body1,
    marginBottom: theme.spacing.md,
  },
  descriptionContainer: {
    marginBottom: theme.spacing.md,
  },
  description: {
    ...theme.typography.bodyLead,
    marginBottom: theme.spacing.sm,
  },
  descriptionTranslation: {
    ...theme.typography.body2,
    marginBottom: theme.spacing.md,
  },
  cultureDescription: {
    color: theme.colors.white,
  },
  cultureDescriptionTranslation: {
    color: theme.colors.gray[300],
  },
  tipDescription: {
    color: theme.colors.gray[900],
  },
  tipDescriptionTranslation: {
    color: theme.colors.gray[500],
  },
  progressDescription: {
    color: theme.colors.gray[900],
  },
  progressDescriptionTranslation: {
    color: theme.colors.gray[500],
  },
});