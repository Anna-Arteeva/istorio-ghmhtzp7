import { useState, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import { Audio } from 'expo-av';
import { useAudio } from '@/contexts/AudioContext';

interface AudioPlayerOptions {
  onPlaybackStatusUpdate?: (status: any) => void;
  onPlaybackStateChange?: (isPlaying: boolean) => void;
}

export function useAudioPlayer(url?: string, options: AudioPlayerOptions = {}) {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [webAudio, setWebAudio] = useState<HTMLAudioElement | null>(null);
  const { currentSound, setCurrentSound, stopCurrentSound } = useAudio();
  const loadingRef = useRef<boolean>(false);

  // Load audio when URL changes
  useEffect(() => {
    if (url) {
      loadAudio();
    }
    return () => {
      cleanupAudio();
    };
  }, [url]);

  const cleanupAudio = async () => {
    try {
      if (Platform.OS === 'web') {
        if (webAudio) {
          webAudio.pause();
          webAudio.src = '';
          setWebAudio(null);
        }
      } else {
        if (sound) {
          await sound.unloadAsync();
          setSound(null);
        }
      }
      setIsPlaying(false);
      setError(null);
    } catch (error) {
      console.error('Error cleaning up audio:', error);
    }
  };

  const updatePlaybackState = (playing: boolean) => {
    setIsPlaying(playing);
    options.onPlaybackStateChange?.(playing);
  };

  const loadAudio = async () => {
    if (!url || loadingRef.current) return;

    try {
      loadingRef.current = true;
      setIsLoading(true);
      setError(null);

      if (Platform.OS === 'web') {
        const audio = new window.Audio();
        
        audio.addEventListener('ended', () => {
          updatePlaybackState(false);
          setCurrentSound(null);
        });
        
        audio.addEventListener('error', () => {
          setError('Failed to play audio');
          updatePlaybackState(false);
          setCurrentSound(null);
        });
        
        audio.addEventListener('timeupdate', () => {
          options.onPlaybackStatusUpdate?.({
            isLoaded: true,
            positionMillis: audio.currentTime * 1000,
            durationMillis: audio.duration * 1000,
            isPlaying: !audio.paused,
            didJustFinish: audio.ended,
          });
        });

        audio.src = url;
        await audio.load();
        setWebAudio(audio);
      } else {
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: url },
          { shouldPlay: false },
          (status) => {
            if (status.isLoaded) {
              options.onPlaybackStatusUpdate?.(status);
              
              if (!status.isPlaying) {
                updatePlaybackState(false);
                setCurrentSound(null);
                if (status.didJustFinish) {
                  // Reset position when finished
                  newSound.setPositionAsync(0);
                }
              }
            }
          }
        );

        setSound(newSound);
      }
    } catch (err) {
      console.error('Error loading audio:', err);
      setError('Failed to load audio');
    } finally {
      loadingRef.current = false;
      setIsLoading(false);
    }
  };

  const play = async () => {
    if (!url) return;

    try {
      setError(null);

      // If audio is already playing, stop it
      if (isPlaying) {
        await stopCurrentSound();
        updatePlaybackState(false);
        setCurrentSound(null);
        return;
      }

      // Stop any other playing audio
      await stopCurrentSound();

      // Play the audio
      if (Platform.OS === 'web') {
        if (webAudio) {
          webAudio.currentTime = 0;
          await webAudio.play();
          updatePlaybackState(true);
          setCurrentSound(webAudio);
        }
      } else {
        if (sound) {
          await sound.setPositionAsync(0);
          await sound.playAsync();
          updatePlaybackState(true);
          setCurrentSound(sound);
        }
      }
    } catch (err) {
      console.error('Error playing audio:', err);
      setError('Failed to play audio');
      updatePlaybackState(false);
    }
  };

  return {
    play,
    isPlaying,
    isLoading,
    error,
  };
}