import React from 'react';
import { Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { Play, Pause } from 'lucide-react-native';
import { theme, useTheme } from '@/theme';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';

interface AudioPlayerProps {
  url?: string;
  size?: 'small' | 'medium' | 'large' | number;
  variant?: 'primary' | 'secondary';
  onPlaybackStatusUpdate?: (status: any) => void;
  onPlaybackStateChange?: (isPlaying: boolean) => void;
}

export function AudioPlayer({ 
  url, 
  size = 'small',
  variant = 'secondary',
  onPlaybackStatusUpdate,
  onPlaybackStateChange,
}: AudioPlayerProps) {
  const currentTheme = useTheme();
  const { play, isPlaying, isLoading, error } = useAudioPlayer(url, {
    onPlaybackStatusUpdate,
    onPlaybackStateChange,
  });

  if (!url) return null;

  // Handle both predefined sizes and custom numbers
  const buttonSize = typeof size === 'string' 
    ? {
        small: 36,
        medium: 48,
        large: 56,
      }[size]
    : size;

  const buttonStyle = StyleSheet.flatten([
    styles.button,
    size === 'small' && styles.smallButton,
    size === 'medium' && styles.mediumButton,
    variant === 'primary' && [
      { backgroundColor: currentTheme.colors.gray[900] },
      styles.primaryButton,
    ],
    variant === 'secondary' && [
      { backgroundColor: currentTheme.colors.gray[50] },
      styles.secondaryButton,
    ],
    error && styles.errorButton,
  ]);

  const iconColor = variant === 'primary' 
    ? currentTheme.colors.white 
    : currentTheme.colors.gray[500];

  const iconSize = size === 'small' ? 20 : size === 'medium' ? 24 : 28;

  return (
    <Pressable
      style={buttonStyle}
      onPress={play}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator 
          size={iconSize} 
          color={iconColor} 
        />
      ) : isPlaying ? (
        <Pause 
          size={iconSize} 
          color={iconColor} 
        />
      ) : (
        <Play
          size={iconSize}
          color={iconColor}
        />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.gray[50],
  },
  primaryButton: {

  },
  secondaryButton: {
    backgroundColor: theme.colors.gray[50],
  },
  errorButton: {
    backgroundColor: theme.colors.error[50],
  },
  smallButton: {
    width: 36,
    height: 36,
  },
  mediumButton: {
    width: 48,
    height: 48,
  },
  disabledButton: {
    backgroundColor: theme.colors.gray[200],
  },
});