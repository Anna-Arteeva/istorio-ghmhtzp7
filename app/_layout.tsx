import React, { useEffect, useState, useCallback } from 'react';
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
import { LevelProvider } from '@/contexts/LevelContext';
import { AudioProvider } from '@/contexts/AudioContext';
import { VisitProvider } from '@/contexts/VisitContext';
import { ViewProvider } from '@/contexts/ViewContext';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { useSettings } from '@/contexts/SettingsContext';
import { useColorScheme, View } from 'react-native';
import { SavedPhrasesProvider } from '@/contexts/SavedPhrasesContext';
import { theme } from '@/theme';

// Removed import statement for SplashScreen

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
  const colorScheme = useColorScheme();
  const [appIsReady, setAppIsReady] = useState(false);

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
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        await Promise.all([
          // Add any additional async operations here
          new Promise(resolve => setTimeout(resolve, 1000)), // Minimum splash screen time
        ]);
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady || !fontsLoaded) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
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
    </View>
  );
}