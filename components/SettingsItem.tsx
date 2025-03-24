import { View, Text, Pressable, StyleSheet } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { theme } from '@/theme';
import * as Icons from '@/components/CustomIcons';

interface SettingsItemProps {
  label: string;
  value?: string;
  icon?: string;
  onPress?: () => void;
  showArrow?: boolean;
  selected?: boolean;
  description?: string;
}

export function SettingsItem({
  label,
  value,
  icon,
  onPress,
  showArrow = true,
  selected = false,
  description,
}: SettingsItemProps) {
  const IconComponent = icon ? (Icons as any)[icon] : null;

  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={onPress}
    >
      <View style={styles.content}>
        {IconComponent && (
          <View style={styles.iconContainer}>
            <IconComponent size={24} color={theme.colors.gray[800]} />
          </View>
        )}
        <View style={styles.textContainer}>
          <Text style={[styles.label, selected && styles.labelSelected]}>
            {label}
          </Text>
          {description && (
            <Text style={styles.description}>{description}</Text>
          )}
        </View>
      </View>
      <View style={styles.right}>
        {value && (
          <Text style={[styles.value, selected && styles.valueSelected]}>
            {value}
          </Text>
        )}
        {showArrow && <ChevronRight size={22} color={theme.colors.gray[400]} />}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    marginHorizontal: 24,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray[100],
  },
  pressed: {
    backgroundColor: theme.colors.gray[50],
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: theme.spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    ...theme.typography.body1,
    color: theme.colors.gray[900],
  },
  description: {
    ...theme.typography.body2,
    color: theme.colors.gray[500],
    marginTop: 2,
  },
  labelSelected: {
    fontFamily: 'Montserrat-SemiBold',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  value: {
    ...theme.typography.body1,
    color: theme.colors.gray[900],
  },
  valueSelected: {
    fontFamily: 'Montserrat-SemiBold',
  },
});