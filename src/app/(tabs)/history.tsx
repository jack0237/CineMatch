import { StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/use-theme';

export default function HistoryScreen() {
  const C = useColors();
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: C.bg }]}>
      <Text style={[styles.title, { color: C.textPrimary }]}>Historique</Text>
      <Text style={[styles.subtitle, { color: C.textMuted }]}>Issue #19</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  title: { fontSize: 28, fontWeight: '700' },
  subtitle: { fontSize: 13 },
});
