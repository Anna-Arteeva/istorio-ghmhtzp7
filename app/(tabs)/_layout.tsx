import { Tabs } from 'expo-router';
import { theme } from '@/theme';
import { useTranslation } from '@/hooks/useTranslation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLevel } from '@/contexts/LevelContext';
import { LanguageLevelBadge } from '@/components/LanguageLevelBadge';
import { View, Platform, SafeAreaView } from 'react-native';
import { Stories, Phrases, Practice, FaceThinkingIcon } from '@/components/CustomIcons';

export default function TabLayout() {
  const { t } = useTranslation();
  const { targetLanguage } = useLanguage();
  const { level } = useLevel();

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={{ backgroundColor: theme.colors.white }}>
        <View style={{ height: Platform.OS === 'ios' ? 0 : 20 }} />
      </SafeAreaView>
      <Tabs
        screenOptions={{
          tabBarStyle: {
            backgroundColor: theme.colors.white,
            borderTopColor: theme.colors.gray[200],
          },
          tabBarActiveTintColor: theme.colors.primary[500],
          tabBarInactiveTintColor: theme.colors.gray[500],
          header: ({ route }) => (
            <LanguageLevelBadge 
              language={targetLanguage} 
              level={level}
              title={t(`navigation.tabs.${route.name}`)}
            />
          ),
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: t('navigation.tabs.stories'),
            tabBarIcon: ({ color, size }) => <Stories size={16} color={color} />,
          }}
        />
        <Tabs.Screen
          name="feed"
          options={{
            title: t('navigation.tabs.feed'),
            tabBarIcon: ({ color, size }) => <FaceThinkingIcon size={16} color={color} />,
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