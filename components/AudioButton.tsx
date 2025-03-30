import React from 'react';
import { Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { Play, Pause } from 'lucide-react-native';
import { theme } from '@/theme';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';

interface AudioButtonProps {
  url: string;
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'secondary';
}

export function AudioButton({
  url,
  size = 'small',
  variant = 'secondary',
}: AudioButtonProps) {
  const { play, isPlaying, isLoading, error } = useAudioPlayer(url);

  const buttonSize = {
    small: 36,
    medium: 48,
    large: 56,
  }[size];

  const iconSize = {
    small: 16,
    medium: 20,
    large: 20,
  }[size];

  return (
    <Pressable
      style={[
        styles.button,
        { width: buttonSize, height: buttonSize },
        variant === 'primary' && styles.primaryButton,
        isPlaying && styles.activeButton,
        error && styles.errorButton,
      ]}
      onPress={play}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator
          size={iconSize}
          color={
            variant === 'primary' ? theme.colors.white : theme.colors.gray[500]
          }
        />
      ) : isPlaying ? (
        <Pause
          size={iconSize}
          color={
            variant === 'primary'
              ? theme.colors.white
              : theme.colors.semiWhite[800]
          }
        />
      ) : (
        <Play
          size={iconSize}
          color={
            error
              ? theme.colors.error[500]
              : variant === 'primary'
              ? theme.colors.white
              : theme.colors.semiWhite[800]
          }
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
    backgroundColor: theme.colors.primary[500],
  },
  activeButton: {
    backgroundColor: theme.colors.gray[900],
  },
  errorButton: {
    backgroundColor: theme.colors.error[50],
  },
});
