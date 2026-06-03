import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Cinema, FontSize, Radius, Spacing } from '@/constants/theme';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

interface ButtonProps extends PressableProps {
  label: string;
  loading?: boolean;
  variant?: 'primary' | 'gradient' | 'ghost';
  icon?: IoniconName;
  style?: StyleProp<ViewStyle>;
}

export function Button({
  label,
  loading = false,
  variant = 'primary',
  icon,
  style,
  disabled,
  ...rest
}: ButtonProps) {
  const isGradient = variant === 'gradient';
  const isGhost    = variant === 'ghost';
  const isDisabled = disabled || loading;
  const textColor  = isGhost ? Cinema.textSecondary : '#FFFFFF';

  const inner = loading ? (
    <ActivityIndicator color={textColor} size="small" />
  ) : (
    <View style={styles.row}>
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
      {icon && <Ionicons name={icon} size={18} color={textColor} />}
    </View>
  );

  if (isGradient) {
    return (
      <Pressable
        disabled={isDisabled}
        style={({ pressed }) => [
          styles.gradientWrap,
          isDisabled && styles.disabled,
          pressed && !isDisabled && styles.pressed,
          style,
        ]}
        {...rest}>
        <LinearGradient
          colors={[Cinema.gradientFrom, Cinema.gradientTo]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.gradient}>
          {inner}
        </LinearGradient>
      </Pressable>
    );
  }

  return (
    <Pressable
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        isGhost ? styles.ghost : styles.primary,
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
        style,
      ]}
      {...rest}>
      {inner}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  // Shared
  base: {
    height: 56,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    letterSpacing: 0.7,
  },
  disabled: { opacity: 0.5 },
  pressed:  { opacity: 0.85 },

  // Solid primary (violet fill)
  primary: {
    backgroundColor: Cinema.gradientFrom, // #a078ff
  },

  // Ghost (transparent + border)
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Cinema.border,
  },

  // Gradient variant wrapper
  gradientWrap: {
    borderRadius: Radius.pill,
    overflow: 'hidden',
    shadowColor: Cinema.gradientTo,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
  },
  gradient: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
});
