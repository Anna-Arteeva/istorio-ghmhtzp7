import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
  Montserrat_800ExtraBold,
  Montserrat_900Black,
} from '@expo-google-fonts/montserrat';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { SavedPhrasesProvider } from '@/contexts/SavedPhrasesContext';
import { LevelProvider } from '@/contexts/LevelContext';
import { AudioProvider } from '@/contexts/AudioContext';
import { VisitProvider } from '@/contexts/VisitContext';
import { ViewProvider } from '@/contexts/ViewContext';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { useSettings } from '@/contexts/SettingsContext';
import * as SplashScreen from 'expo-splash-screen';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

function AppContent() {
  const { currentTheme } = useSettings();
  
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style={currentTheme === 'dark' ? 'light' : 'dark'} />
    </>
  );
}

export default function RootLayout() {
  useFrameworkReady();

  const [fontsLoaded] = useFonts({
    'Montserrat-Regular': Montserrat_400Regular,
    'Montserrat-Medium': Montserrat_500Medium,
    'Montserrat-SemiBold': Montserrat_600SemiBold,
    'Montserrat-Bold': Montserrat_700Bold,
    'Montserrat-ExtraBold': Montserrat_800ExtraBold,
    'Montserrat-Black': Montserrat_900Black,
  });

  useEffect(() => {
    // Hide splash screen once fonts are loaded
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AudioProvider>
      <LanguageProvider>
        <LevelProvider>
          <SavedPhrasesProvider>
            <VisitProvider>
              <ViewProvider>
                <SettingsProvider>
                  <AppContent />
                </SettingsProvider>
              </ViewProvider>
            </VisitProvider>
          </SavedPhrasesProvider>
        </LevelProvider>
      </LanguageProvider>
    </AudioProvider>
  );
}