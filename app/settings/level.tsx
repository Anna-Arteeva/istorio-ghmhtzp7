import { useRouter } from 'expo-router';
import { useLevel } from '@/contexts/LevelContext';
import { LevelSelectionScreen } from '@/components/shared/LevelSelectionScreen';

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