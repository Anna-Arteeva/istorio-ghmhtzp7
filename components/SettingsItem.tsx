import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { theme, useTheme } from '@/theme';
import { ChevronRight, ChevronsUpDown } from 'lucide-react-native';
import { LanguageIcon } from '@/components/LanguageIcon';

interface SettingsItemProps {
  label: string;
  value?: string;
  description?: string;
  icon?: string;
  onPress?: () => void;
  showUpDownChevron?: boolean;
}

export function SettingsItem({ 
  label, 
  value, 
  description,
  icon,
  onPress,
  showUpDownChevron = false
}: SettingsItemProps) {
  const currentTheme = useTheme();

  return (
    <Pressable 
      style={[
        styles.container,
        { borderBottomColor: currentTheme.colors.gray[200] }
      ]}
      onPress={onPress}
    >
      <View style={styles.content}>
        <View style={styles.leftContent}>
          <View style={styles.textContainer}>
            <Text style={[styles.label, { color: currentTheme.colors.gray[500] }]}>
              {label}
            </Text>
            {description && (
              <Text style={[styles.description, { color: currentTheme.colors.gray[500] }]}>
                {description}
              </Text>
            )}
          </View>
        </View>
        <View style={styles.rightContent}>
          {icon && (
            <View style={styles.iconContainer}>
              <LanguageIcon 
                language={icon} 
                size={16} 
                color={currentTheme.colors.gray[900]} 
              />
            </View>
          )}
          {value && (
            <Text style={[styles.value, { color: currentTheme.colors.gray[900] }]}>
              {value}
            </Text>
          )}
          {showUpDownChevron ? (
            <ChevronsUpDown size={20} color={currentTheme.colors.gray[400]} />
          ) : (
            <ChevronRight size={20} color={currentTheme.colors.gray[400]} />
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderBottomWidth: 1,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
  },
  textContainer: {
    flex: 1,
  },
  label: {
    ...theme.typography.bodyLead,
  },
  description: {
    ...theme.typography.body2,
    marginTop: 2,
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  value: {
    ...theme.typography.bodyLead,
  },
});