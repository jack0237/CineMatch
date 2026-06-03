import { Stack, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontSize, Spacing } from '@/constants/theme';
import { useColors } from '@/hooks/use-theme';

export default function MovieDetailScreen() {
  const C = useColors();
  const { id, title } = useLocalSearchParams<{ id: string; title?: string }>();

  return (
    <>
      <Stack.Screen options={{ title: title ?? `Film #${id}` }} />
      <SafeAreaView style={[styles.container, { backgroundColor: C.bg }]}>
        <View style={styles.content}>
          <Text style={[styles.title, { color: C.textPrimary }]}>{title ?? `Film #${id}`}</Text>
          <Text style={[styles.subtitle, { color: C.textMuted }]}>Issues #15 #36 #16 #17</Text>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing['2xl'],
    gap: 8,
  },
  title: { fontSize: FontSize['2xl'], fontWeight: '700', textAlign: 'center' },
  subtitle: { fontSize: FontSize.sm },
});
