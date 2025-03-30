import { View, Text, Pressable, StyleSheet } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { theme, useTheme } from '@/theme';
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
  const currentTheme = useTheme();

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        { 
          backgroundColor: currentTheme.colors.white,
          borderBottomColor: currentTheme.colors.gray[100],
        },
        pressed && { backgroundColor: currentTheme.colors.gray[50] }
      ]}
      onPress={onPress}
    >
      <View style={styles.content}>
        {IconComponent && (
          <View style={[styles.iconContainer, { backgroundColor: currentTheme.colors.gray[100] }]}>
            <IconComponent size={24} color={currentTheme.colors.gray[800]} />
          </View>
        )}
        <View style={styles.textContainer}>
          <Text style={[
            styles.label,
            { color: currentTheme.colors.gray[900] },
            selected && styles.labelSelected
          ]}>
            {label}
          </Text>
          {description && (
            <Text style={[styles.description, { color: currentTheme.colors.gray[500] }]}>
              {description}
            </Text>
          )}
        </View>
      </View>
      <View style={styles.right}>
        {value && (
          <Text style={[
            styles.value,
            { color: currentTheme.colors.gray[900] },
            selected && styles.valueSelected
          ]}>
            {value}
          </Text>
        )}
        {showArrow && <ChevronRight size={22} color={currentTheme.colors.gray[400]} />}
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
    borderBottomWidth: 1,
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    ...theme.typography.body1,
  },
  description: {
    ...theme.typography.body2,
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
  },
  valueSelected: {
    fontFamily: 'Montserrat-SemiBold',
  },
});