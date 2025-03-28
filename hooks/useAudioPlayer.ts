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
  const loadingRef = useRef<boolean>(false);
  const { currentSound, setCurrentSound, stopCurrentSound } = useAudio();

  // Initialize Audio on mount
  useEffect(() => {
    if (Platform.OS !== 'web') {
      Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });
    }
  }, []);

  // Cleanup function
  const cleanup = async () => {
    try {
      if (Platform.OS === 'web') {
        if (webAudio) {
          webAudio.pause();
          webAudio.src = '';
          setWebAudio(null);
        }
      } else {
        if (sound) {
          await sound.stopAsync();
          await sound.unloadAsync();
          setSound(null);
        }
      }
      setIsPlaying(false);
      setError(null);
      setCurrentSound(null);
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  };

  // Cleanup on unmount or URL change
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [url]);

  const updatePlaybackState = (playing: boolean) => {
    setIsPlaying(playing);
    options.onPlaybackStateChange?.(playing);
  };

  const loadAudio = async () => {
    if (!url || loadingRef.current) return null;

    try {
      loadingRef.current = true;
      setIsLoading(true);
      setError(null);

      await cleanup();

      if (Platform.OS === 'web') {
        const audio = new window.Audio();
        
        audio.addEventListener('ended', () => {
          updatePlaybackState(false);
          setCurrentSound(null);
        });
        
        audio.addEventListener('error', () => {
          setError('Failed to load audio');
          updatePlaybackState(false);
          setCurrentSound(null);
        });
        
        audio.addEventListener('playing', () => {
          updatePlaybackState(true);
          setIsLoading(false);
        });
        
        audio.addEventListener('pause', () => {
          updatePlaybackState(false);
        });

        audio.addEventListener('loadeddata', () => {
          setIsLoading(false);
        });

        audio.src = url;
        await audio.load();
        setWebAudio(audio);
        return audio;
      } else {
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: url },
          { 
            shouldPlay: false,
            progressUpdateIntervalMillis: 100,
          },
          (status) => {
            if (status.isLoaded) {
              options.onPlaybackStatusUpdate?.(status);
              updatePlaybackState(status.isPlaying);
              
              if (status.didJustFinish) {
                updatePlaybackState(false);
                setCurrentSound(null);
              }
            }
          }
        );

        setSound(newSound);
        setIsLoading(false);
        return newSound;
      }
    } catch (err) {
      console.error('Load error:', err);
      setError('Failed to load audio');
      setIsLoading(false);
      return null;
    } finally {
      loadingRef.current = false;
    }
  };

  const play = async () => {
    if (!url) return;

    try {
      setError(null);

      // If already playing, pause
      if (isPlaying) {
        if (Platform.OS === 'web') {
          if (webAudio) {
            webAudio.pause();
            updatePlaybackState(false);
            setCurrentSound(null);
          }
        } else {
          if (sound) {
            await sound.pauseAsync();
            updatePlaybackState(false);
            setCurrentSound(null);
          }
        }
        return;
      }

      // Stop any other playing audio
      await stopCurrentSound();

      setIsLoading(true);

      let audioToPlay;
      
      // Load audio if not loaded
      if (Platform.OS === 'web' ? !webAudio : !sound) {
        audioToPlay = await loadAudio();
      } else {
        audioToPlay = Platform.OS === 'web' ? webAudio : sound;
      }

      if (!audioToPlay) {
        throw new Error('Failed to load audio');
      }

      // Play the audio
      if (Platform.OS === 'web') {
        try {
          const playPromise = (audioToPlay as HTMLAudioElement).play();
          if (playPromise !== undefined) {
            await playPromise;
            updatePlaybackState(true);
            setCurrentSound(audioToPlay);
          }
        } catch (error) {
          console.error('Web audio play error:', error);
          throw error;
        }
      } else {
        await (audioToPlay as Audio.Sound).playFromPositionAsync(0);
        updatePlaybackState(true);
        setCurrentSound(audioToPlay);
      }
    } catch (err) {
      console.error('Play error:', err);
      setError('Failed to play audio');
      updatePlaybackState(false);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    play,
    isPlaying,
    isLoading,
    error,
  };
}