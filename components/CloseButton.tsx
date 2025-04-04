import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { X } from 'lucide-react-native';
import { theme, useTheme } from '@/theme';

interface CloseButtonProps {
  onPress: () => void;
  size?: number;
}

export function CloseButton({ onPress, size = 40 }: CloseButtonProps) {
  const currentTheme = useTheme();
  
  return (
    <Pressable
      style={[
        styles.button,
        { 
          width: size, 
          height: size,
          backgroundColor: currentTheme.colors.gray[50],
          borderRadius: theme.borderRadius.md,
        }
      ]}
      onPress={onPress}
    >
      <X size={24} color={currentTheme.colors.gray[900]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
