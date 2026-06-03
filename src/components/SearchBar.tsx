import { ActivityIndicator, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Fonts, FontSize, Radius, Spacing } from '@/constants/theme';
import { useColors } from '@/hooks/use-theme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  isLoading?: boolean;
}

export function SearchBar({
  value,
  onChangeText,
  placeholder = 'Rechercher un film...',
  isLoading = false,
}: SearchBarProps) {
  const C = useColors();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: C.surfaceElevated, borderColor: C.border },
      ]}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={C.textMuted} />
      ) : (
        <Ionicons name="search-outline" size={18} color={C.textMuted} />
      )}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={C.textMuted}
        style={[styles.input, { color: C.textPrimary }]}
        autoCorrect={false}
        autoCapitalize="none"
        returnKeyType="search"
      />
      {value.length > 0 && (
        <Pressable onPress={() => onChangeText('')} hitSlop={10}>
          <Ionicons name="close-circle" size={18} color={C.textMuted} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm + 2,
    borderRadius: Radius.pill,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    fontFamily: Fonts.regular,
    fontSize: FontSize.base,
    padding: 0,
    includeFontPadding: false,
  },
});
