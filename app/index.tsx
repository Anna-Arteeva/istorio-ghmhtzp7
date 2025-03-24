import { Redirect } from 'expo-router';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Index() {
  const { hasCompletedOnboarding } = useLanguage();
  
  if (hasCompletedOnboarding === undefined) {
    return null; // Return null while loading to prevent flashing
  }
  
  return <Redirect href={hasCompletedOnboarding ? '/(tabs)' : '/onboarding'} />;
}