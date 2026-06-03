import { useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  TextInput,
  type TextInputProps,
  View,
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Cinema, FontSize, Stitch } from '@/constants/theme';

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
  isPassword?: boolean;
}

export function Input({ label, error, isPassword, value, style, onFocus, onBlur, ...rest }: InputProps) {
  const [focused, setFocused] = useState(false);
  const [secure, setSecure] = useState(true);
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

  const lift = () =>
    Animated.timing(anim, { toValue: 1, duration: 200, useNativeDriver: false }).start();

  const drop = () => {
    if (!value)
      Animated.timing(anim, { toValue: 0, duration: 200, useNativeDriver: false }).start();
  };

  const labelTop  = anim.interpolate({ inputRange: [0, 1], outputRange: [12, -10] });
  const labelSize = anim.interpolate({ inputRange: [0, 1], outputRange: [16, 13] });
  const labelColor = focused
    ? Cinema.primary
    : value
      ? Cinema.textSecondary
      : Cinema.textMuted;

  return (
    <View style={styles.outer}>
      <View style={styles.wrapper}>
        <Animated.Text
          style={[styles.label, { top: labelTop, fontSize: labelSize, color: labelColor }]}
          pointerEvents="none"
        >
          {label}
        </Animated.Text>

        <View style={[
          styles.row,
          focused && styles.rowActive,
          !!error && styles.rowError,
        ]}>
          <TextInput
            style={[styles.input, style]}
            value={value}
            secureTextEntry={isPassword && secure}
            onFocus={(e) => {
              setFocused(true);
              lift();
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              drop();
              onBlur?.(e);
            }}
            placeholderTextColor="transparent"
            selectionColor={Cinema.primary}
            autoCapitalize="none"
            {...rest}
          />
          {isPassword && (
            <Pressable onPress={() => setSecure((s) => !s)} hitSlop={8}>
              <Ionicons
                name={secure ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={Cinema.textMuted}
              />
            </Pressable>
          )}
        </View>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    gap: 4,
  },
  wrapper: {
    height: 56,
    justifyContent: 'flex-end',
  },
  label: {
    position: 'absolute',
    left: 0,
    lineHeight: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Stitch.outlineVariant,
    paddingBottom: 8,
  },
  rowActive: {
    borderBottomColor: Cinema.primary,
  },
  rowError: {
    borderBottomColor: Stitch.error,
  },
  input: {
    flex: 1,
    color: Cinema.textPrimary,
    fontSize: FontSize.base,
    lineHeight: 24,
    paddingVertical: 0,
  },
  error: {
    color: Stitch.error,
    fontSize: FontSize.xs,
  },
});
