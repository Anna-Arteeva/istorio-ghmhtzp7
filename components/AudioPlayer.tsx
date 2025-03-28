import React from 'react';
import { Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { Play, Pause } from 'lucide-react-native';
import { theme } from '@/theme';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';

interface AudioPlayerProps {
  url?: string;
  size?: number;
  variant?: 'primary' | 'secondary';
  onPlaybackStatusUpdate?: (status: any) => void;
  onPlaybackStateChange?: (isPlaying: boolean) => void;
}

export function AudioPlayer({ 
  url, 
  size = 36,
  variant = 'secondary',
  onPlaybackStatusUpdate,
  onPlaybackStateChange,
}: AudioPlayerProps) {
  const { play, isPlaying, isLoading, error } = useAudioPlayer(url, {
    onPlaybackStatusUpdate,
    onPlaybackStateChange,
  });

  if (!url) return null;

  return (
    <Pressable
      style={[
        styles.button,
        { width: size, height: size },
        variant === 'primary' && styles.primaryButton,
        isPlaying && styles.activeButton,
        error && styles.errorButton,
      ]}
      onPress={play}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator 
          size={size * 0.6} 
          color={variant === 'primary' ? theme.colors.white : theme.colors.gray[500]} 
        />
      ) : isPlaying ? (
        <Pause 
          size={size * 0.6} 
          color={variant === 'primary' ? theme.colors.white : theme.colors.semiWhite[800]} 
        />
      ) : (
        <Play
          size={size * 0.6}
          color={
            error
              ? theme.colors.error[500]
              : variant === 'primary'
              ? theme.colors.white
              : theme.colors.gray[800]
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