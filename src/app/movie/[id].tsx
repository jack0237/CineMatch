import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MovieDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <Pressable onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backText}>← Retour</Text>
      </Pressable>
      <Text style={styles.title}>Film #{id}</Text>
      <Text style={styles.subtitle}>Issues #15 #36 #16 #17</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D0D', alignItems: 'center', justifyContent: 'center', gap: 8 },
  back: { position: 'absolute', top: 60, left: 20 },
  backText: { color: '#E50914', fontSize: 16 },
  title: { color: '#FFFFFF', fontSize: 28, fontWeight: '700' },
  subtitle: { color: '#555555', fontSize: 13 },
});
