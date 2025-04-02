import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { theme, useTheme } from '@/theme';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLevel } from '@/contexts/LevelContext';
import { ExampleStory } from '@/components/ExampleStory';
import { TranslatableSentence } from '@/components/TranslatableSentence';
import { useViews } from '@/contexts/ViewContext';
import { useSettings } from '@/contexts/SettingsContext';
import { LanguageIcon } from '@/components/LanguageIcon';
import { useTranslation } from '@/hooks/useTranslation';

interface InfoCardContent {
  title: string;
  description: string;
  quote?: string;
}

interface InfoCard {
  id: string;
  name: string;
  type?: 'progress' | 'culture' | 'tip';
  content_json: Record<string, InfoCardContent>;
}

interface InfoCardProps {
  card: InfoCard;
  onPress?: () => void;
}

export function InfoCard({ card, onPress }: InfoCardProps) {
  const currentTheme = useTheme();
  const { nativeLanguage, targetLanguage } = useLanguage();
  const { recordView } = useViews();
  const { showTranslationsByDefault } = useSettings();
  const { t } = useTranslation();
  
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
          <View style={[styles.cultureBadge, { backgroundColor: currentTheme.colors.gray[900] }]}>
            <View style={styles.languageCode}>
              <View style={styles.iconContainer}>
                <LanguageIcon
                  language={targetLanguage}
                  size={13}
                  color={currentTheme.colors.white}
                />
              </View>
              <Text style={[styles.languageText, { color: currentTheme.colors.white }]}>
                {targetLanguage.toUpperCase()}
              </Text>
            </View>
            <Text style={[styles.cultureBadgeText, { color: currentTheme.colors.white }]}>
              |
            </Text>
            <Text style={[styles.cultureBadgeText, { color: currentTheme.colors.white }]}>
              {t('infoCard.cultureClub')}
            </Text>
          </View>
        )}
        
        {isTipCard && (
          <View style={[styles.tipBadge, { backgroundColor: currentTheme.colors.primary[500] }]}>
            <Text style={[styles.tipBadgeText, { color: currentTheme.colors.white }]}>
              {t('infoCard.proTip')}
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
    marginTop: theme.spacing.xl,
  },
  content: {
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
  },
  cultureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderBottomRightRadius: theme.borderRadius.lg,
    position: 'absolute',
    top: -12,
    left: 0,
  },
  languageCode: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
    gap: theme.spacing.xs,
  },
  iconContainer: {
    marginRight: 2,
  },
  languageText: {
    ...theme.typography.caption,
    fontFamily: 'Montserrat-SemiBold',
  },
  cultureBadgeText: {
    ...theme.typography.caption,
    fontFamily: 'Montserrat-SemiBold',
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
  },
  title: {
    ...theme.typography.heading1,
  },
  nativeTitle: {
    ...theme.typography.body1,
  },
  descriptionContainer: {
    marginTop: theme.spacing.md,
  },
  description: {
    ...theme.typography.bodyLead,
  },
  descriptionTranslation: {
    ...theme.typography.body2,
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