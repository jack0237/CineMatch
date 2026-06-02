import { StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SwipeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Swipe</Text>
      <Text style={styles.subtitle}>Issues #10 #11 #34</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D0D', alignItems: 'center', justifyContent: 'center', gap: 8 },
  title: { color: '#FFFFFF', fontSize: 28, fontWeight: '700' },
  subtitle: { color: '#555555', fontSize: 13 },
});
