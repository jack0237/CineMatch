import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Cinema, FontSize, Spacing } from '@/constants/theme';

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
  isPassword?: boolean;
}

export function Input({ label, error, isPassword, style, ...rest }: InputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.row, error ? styles.rowError : null]}>
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={Cinema.textMuted}
          selectionColor={Cinema.primary}
          secureTextEntry={isPassword && !visible}
          autoCapitalize="none"
          {...rest}
        />
        {isPassword && (
          <Pressable onPress={() => setVisible((v) => !v)} hitSlop={8}>
            <Ionicons
              name={visible ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={Cinema.textMuted}
            />
          </Pressable>
        )}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: Spacing.sm,
  },
  label: {
    color: Cinema.textSecondary,
    fontSize: FontSize.sm,
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A3A',
    paddingBottom: Spacing.sm,
  },
  rowError: {
    borderBottomColor: '#EF4444',
  },
  input: {
    flex: 1,
    color: Cinema.textPrimary,
    fontSize: FontSize.base,
    fontWeight: '400',
    paddingVertical: 0,
  },
  error: {
    color: '#EF4444',
    fontSize: FontSize.xs,
  },
});
