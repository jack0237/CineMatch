import { Stack, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Cinema, FontSize, Spacing } from '@/constants/theme';

export default function MovieDetailScreen() {
  const { id, title } = useLocalSearchParams<{ id: string; title?: string }>();

  return (
    <>
      <Stack.Screen options={{ title: title ?? `Film #${id}` }} />
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>{title ?? `Film #${id}`}</Text>
          <Text style={styles.subtitle}>Issues #15 #36 #16 #17</Text>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Cinema.bg },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing['2xl'],
    gap: 8,
  },
  title: { color: Cinema.textPrimary, fontSize: FontSize['2xl'], fontWeight: '700', textAlign: 'center' },
  subtitle: { color: Cinema.textMuted, fontSize: FontSize.sm },
});
