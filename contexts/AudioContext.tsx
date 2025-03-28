import { createContext, useContext, useState, useCallback } from 'react';
import { Platform } from 'react-native';
import { Audio } from 'expo-av';

interface AudioContextType {
  currentSound: Audio.Sound | HTMLAudioElement | null;
  setCurrentSound: (sound: Audio.Sound | HTMLAudioElement | null) => void;
  stopCurrentSound: () => Promise<void>;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [currentSound, setCurrentSound] = useState<Audio.Sound | HTMLAudioElement | null>(null);

  const stopCurrentSound = useCallback(async () => {
    if (!currentSound) return;

    try {
      if (Platform.OS === 'web') {
        (currentSound as HTMLAudioElement).pause();
        (currentSound as HTMLAudioElement).currentTime = 0;
      } else {
        await (currentSound as Audio.Sound).stopAsync();
      }
    } catch (error) {
      console.error('Error stopping sound:', error);
    }
  }, [currentSound]);

  return (
    <AudioContext.Provider value={{ currentSound, setCurrentSound, stopCurrentSound }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}