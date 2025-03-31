import { useRouter, useLocalSearchParams } from 'expo-router';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSelectionScreen } from '@/components/shared/LanguageSelectionScreen';

export default function LanguageScreen() {
  const router = useRouter();
  const { type } = useLocalSearchParams();
  const {
    nativeLanguage,
    targetLanguage,
    setNativeLanguage,
    setTargetLanguage,
  } = useLanguage();

  const handleSelect = async (code: string) => {
    if (type === 'native') {
      await setNativeLanguage(code);
    } else {
      await setTargetLanguage(code);
    }
    router.back();
  };

  const selectedCode = type === 'native' ? nativeLanguage : targetLanguage;

  return (
    <LanguageSelectionScreen
      type={type as 'native' | 'target'}
      onSelect={handleSelect}
      onBack={() => router.back()}
      showBackButton={true}
      selectedCode={selectedCode}
    />
  );
}