import React from 'react';
import { Tabs } from 'expo-router';
import { theme, useTheme } from '@/theme';
import { useTranslation } from '@/hooks/useTranslation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLevel } from '@/contexts/LevelContext';
import { LanguageLevelBadge } from '@/components/LanguageLevelBadge';
import { View, Platform, SafeAreaView, Text } from 'react-native';
import { Stories, Phrases, Practice } from '@/components/CustomIcons';

export default function TabLayout() {
  const { t } = useTranslation();
  const { targetLanguage } = useLanguage();
  const { level } = useLevel();
  const currentTheme = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: currentTheme.colors.pageBackground }}>
      <SafeAreaView style={{ backgroundColor: currentTheme.colors.pageBackground }}>
        <View style={{ height: Platform.OS === 'ios' ? 0 : 20 }} />
      </SafeAreaView>
      <Tabs
        screenOptions={{
          tabBarStyle: {
            backgroundColor: currentTheme.colors.pageBackground,
            borderTopColor: currentTheme.colors.pageBackground,
          },
          tabBarActiveTintColor: currentTheme.colors.primary[500],
          tabBarInactiveTintColor: currentTheme.colors.gray[500],
          header: ({ route }) => {
            const title = t(`navigation.tabs.${route.name}`) || '';
            return title ? (
              <LanguageLevelBadge 
                language={targetLanguage} 
                level={level}
                title={title}
              />
            ) : null;
          },
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: t('navigation.tabs.stories'),
            tabBarIcon: ({ color, size }) => <Stories size={16} color={color} />,
          }}
        />
        <Tabs.Screen
          name="phrases"
          options={{
            title: t('navigation.tabs.phrases'),
            tabBarIcon: ({ color, size }) => <Phrases size={16} color={color} />,
          }}
        />
        <Tabs.Screen
          name="practice"
          options={{
            title: t('navigation.tabs.practice'),
            tabBarIcon: ({ color, size }) => <Practice size={18} color={color} />,
            headerShown: false,
            tabBarStyle: { display: 'none' },
          }}
        />
      </Tabs>
    </View>
  );
}