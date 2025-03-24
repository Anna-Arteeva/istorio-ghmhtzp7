import { Pressable, StyleSheet } from 'react-native';
import { X } from 'lucide-react-native';
import { theme } from '@/theme';

interface CloseButtonProps {
  onPress: () => void;
  size?: number;
}

export function CloseButton({ onPress, size = 40 }: CloseButtonProps) {
  return (
    <Pressable
      style={[styles.button, { width: size, height: size }]}
      onPress={onPress}
    >
      <X size={24} color={theme.colors.gray[900]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.gray[50],
    justifyContent: 'center',
    alignItems: 'center',
  },
});
