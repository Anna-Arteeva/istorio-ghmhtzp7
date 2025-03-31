import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { theme, useTheme } from '@/theme';
import { X } from 'lucide-react-native';
import { useTranslation } from '@/hooks/useTranslation';

type BadgeType = 'topRight' | 'topLeft' | 'bottomRight' | 'bottomLeft';
type BadgeVariant = 'floating' | 'static';

interface HelpBadgeProps {
  text: string;
  type?: BadgeType;
  variant?: BadgeVariant;
  position?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
}

export function HelpBadge({ 
  text, 
  type = 'topRight', 
  variant = 'floating',
  position 
}: HelpBadgeProps) {
  const [isVisible, setIsVisible] = useState(true);
  const currentTheme = useTheme();
  const { t } = useTranslation();

  if (!isVisible) return null;

  const badgeContent = (
    <View style={[styles.badge, styles[type], { }]}>
      <Text style={[styles.text, { backgroundColor: currentTheme.colors.primary[500], color: currentTheme.colors.white }]}>{text}</Text>
      {variant === 'floating' && (
        <Pressable 
          style={styles.closeButton}
          onPress={() => setIsVisible(false)}
          hitSlop={8}
        >
          <X size={14} color={theme.colors.white} />
        </Pressable>
      )}
    </View>
  );

  if (variant === 'static') {
    return (
      <View style={styles.staticContainer}>
        <View style={styles.staticWrapper}>
          {badgeContent}
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, position, { backgroundColor: currentTheme.colors.primary[500] }]}>
      {badgeContent}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 10,
  },
  staticContainer: {
    marginBottom: theme.spacing.xs,
    marginLeft: theme.spacing.lg,
  },
  staticWrapper: {
    alignSelf: 'flex-start',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    paddingVertical: theme.spacing.xs,
    paddingLeft: theme.spacing.sm,
    paddingRight: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
  },
  text: {
   fontFamily: 'Montserrat-SemiBold',
   fontSize: 13,
   lineHeight: 16,
   borderRadius: theme.borderRadius.lg,
  },
  closeButton: {
    width: 20,
    height: 20,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  topRight: {
    borderTopRightRadius: 0,
  },
  topLeft: {
    borderTopLeftRadius: 0,
  },
  bottomRight: {
    borderBottomRightRadius: 0,
  },
  bottomLeft: {
    borderBottomLeftRadius: 0
  },
});