import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { Cinema, FontSize, Radius, Spacing } from '@/constants/theme';

interface ButtonProps extends PressableProps {
  label: string;
  loading?: boolean;
  variant?: 'primary' | 'ghost';
  style?: StyleProp<ViewStyle>;
}

export function Button({
  label,
  loading = false,
  variant = 'primary',
  style,
  disabled,
  ...rest
}: ButtonProps) {
  const isPrimary = variant === 'primary';
  const isDisabled = disabled || loading;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.base,
        isPrimary ? styles.primary : styles.ghost,
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
        style,
      ]}
      disabled={isDisabled}
      {...rest}>
      {loading ? (
        <ActivityIndicator color={isPrimary ? '#FFFFFF' : Cinema.primary} size="small" />
      ) : (
        <Text style={[styles.label, !isPrimary && styles.labelGhost]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 54,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  primary: {
    backgroundColor: Cinema.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Cinema.border,
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.85,
  },
  label: {
    color: '#FFFFFF',
    fontSize: FontSize.base,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  labelGhost: {
    color: Cinema.textSecondary,
  },
});
