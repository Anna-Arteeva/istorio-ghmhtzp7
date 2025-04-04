import React from 'react';
import { useRouter } from 'expo-router';
import { useLevel } from '@/contexts/LevelContext';
import { LevelSelectionScreen } from '@/components/shared/LevelSelectionScreen';
import { LanguageLevel } from '@/utils/languageUtils';

export default function LevelScreen() {
  const router = useRouter();
  const { level, setLevel } = useLevel();

  const handleSelect = async (newLevel: LanguageLevel) => {
    await setLevel(newLevel);
    router.back();
  };

  return (
    <LevelSelectionScreen
      onSelect={handleSelect}
      onBack={() => router.back()}
      showBackButton={true}
      selectedLevel={level}
    />
  );
}