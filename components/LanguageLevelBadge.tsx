import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from '@/theme';
import * as Icons from '@/components/CustomIcons';
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
  const router = useRouter();
  const IconComponent = (Icons as any)[language.toLowerCase()];
  const levelConfig = LANGUAGE_LEVELS[level];

  return (
    <View style={styles.header}>
      <Pressable style={styles.badge} onPress={() => router.push('/settings')}>
        <View style={styles.badgeContent}>
          {IconComponent && (
            <View style={styles.iconContainer}>
              <IconComponent size={16} color={theme.colors.gray[800]} />
            </View>
          )}
          <Text style={styles.language}>{language.toUpperCase()}</Text>
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
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: theme.colors.pageBackground,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  badge: {},
  badgeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.gray[100],
    borderRadius: theme.borderRadius.md,
    paddingVertical: 0,
    paddingLeft: 8,
    gap: 6,
  },
  iconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  language: {
    ...theme.typography.caption,
    fontFamily: 'Montserrat-SemiBold',
    color: theme.colors.gray[800],
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
    color: theme.colors.gray[900],
    flex: 1,
  },
});