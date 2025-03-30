import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { theme } from '@/theme';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLevel } from '@/contexts/LevelContext';
import { ExampleStory } from '@/components/ExampleStory';
import { TranslatableSentence } from '@/components/TranslatableSentence';
import { LANGUAGE_LEVELS } from '@/lib/constants';
import { useViews } from '@/contexts/ViewContext';

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
  const { nativeLanguage, targetLanguage } = useLanguage();
  const { recordView } = useViews();
  const { level } = useLevel();
  
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
        isProgressCard && styles.progressContainer,
        isCultureCard && styles.cultureContainer,
        isTipCard && styles.tipContainer
      ]}
      onPress={onPress}
    >
      <View style={styles.content}>
        {isCultureCard && (
          <View style={styles.header}>
            <View style={styles.cultureBadge}>
              <View style={styles.languageCode}>
                <Text style={styles.languageText}>{targetLanguage.toUpperCase()}</Text>
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
            <Text style={styles.brandText}>Istorio</Text>
          </View>
        )}
        
        {isTipCard && (
          <View style={styles.tipBadge}>
            <Text style={styles.tipBadgeText}>Pro Tip</Text>
          </View>
        )}

        <View style={styles.titleContainer}>
          <TranslatableSentence
            targetText={targetContent.title}
            nativeText={nativeContent.title}
            isShortStory={false}
            customStyles={{
              target: [
                styles.title,
                isCultureCard && styles.cultureTitle,
                isTipCard && styles.tipTitle,
                isProgressCard && styles.progressTitle
              ],
              native: [
                styles.titleTranslation,
                isCultureCard && styles.cultureTitleTranslation,
                isTipCard && styles.tipTitleTranslation,
                isProgressCard && styles.progressTitleTranslation
              ]
            }}
          />
        </View>
        
        <View style={styles.descriptionContainer}>
          <TranslatableSentence
            targetText={targetContent.description}
            nativeText={nativeContent.description}
            isShortStory={false}
            customStyles={{
              target: [
                styles.description,
                isCultureCard && styles.cultureDescription,
                isTipCard && styles.tipDescription,
                isProgressCard && styles.progressDescription
              ],
              native: [
                styles.descriptionTranslation,
                isCultureCard && styles.cultureDescriptionTranslation,
                isTipCard && styles.tipDescriptionTranslation,
                isProgressCard && styles.progressDescriptionTranslation
              ]
            }}
          />
        </View>

        {targetContent.quote && (
          <View style={styles.quoteContainer}>
            <View style={styles.quoteBadge}>
              <Text style={styles.quoteBadgeText}>{targetLanguage.toUpperCase()}</Text>
            </View>
            <Text style={styles.quoteText}>{targetContent.quote}</Text>
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
  progressContainer: {
    backgroundColor: theme.colors.primary[100],
  },
  cultureContainer: {
    backgroundColor: theme.colors.gray[900],
  },
  tipContainer: {
    backgroundColor: theme.colors.gray[100],
    marginTop: theme.spacing.xl,
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
    backgroundColor: theme.colors.semiWhite[700],
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
    color: theme.colors.white,
  },
  tipBadge: {
    backgroundColor: theme.colors.primary[500],
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderBottomRightRadius: theme.borderRadius.lg,
    position: 'absolute',
    top: -12,
    left: 0,
  },
  tipBadgeText: {
    ...theme.typography.caption,
    color: theme.colors.white,
    fontFamily: 'Montserrat-Bold',
  },
  quoteContainer: {
    backgroundColor: theme.colors.semiWhite[600],
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginTop: theme.spacing.xl,
  },
  quoteBadge: {
    position: 'absolute',
    top: -10,
    left: 0,
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderBottomRightRadius: theme.borderRadius.lg,
  },
  quoteBadgeText: {
    ...theme.typography.caption,
    color: theme.colors.gray[900],
    fontFamily: 'Montserrat-Bold',
  },
  quoteText: {
    ...theme.typography.body1,
    color: theme.colors.gray[900],
    marginTop: theme.spacing.sm,
  },
  title: {
    ...theme.typography.heading1,
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
  progressTitle: {
    color: theme.colors.gray[900],
  },
  cultureTitle: {
    color: theme.colors.white,
  },
  tipTitle: {
    color: theme.colors.gray[900],
  },
  titleContainer: {
    marginBottom: theme.spacing.md,
  },
  titleTranslation: {
    ...theme.typography.body1,
    color: theme.colors.gray[500],
    marginTop: theme.spacing.xs,
  },
  cultureTitleTranslation: {
    color: theme.colors.semiWhite[600],
  },
  tipTitleTranslation: {
    color: theme.colors.gray[500],
  },
  progressTitleTranslation: {
    color: theme.colors.gray[500],
  },
  descriptionContainer: {
    marginBottom: theme.spacing.lg,
  },
  description: {
    ...theme.typography.bodyLead,
  },
  descriptionTranslation: {
    ...theme.typography.body1,
    color: theme.colors.gray[500],
    marginTop: theme.spacing.xs,
  },
  progressDescription: {
    color: theme.colors.gray[800],
  },
  progressDescriptionTranslation: {
    color: theme.colors.gray[500],
  },
  cultureDescription: {
    color: theme.colors.white,
    opacity: 0.8,
  },
  cultureDescriptionTranslation: {
    color: theme.colors.semiWhite[600],
  },
  tipDescription: {
    color: theme.colors.gray[700],
  },
  tipDescriptionTranslation: {
    color: theme.colors.gray[500],
  },
});