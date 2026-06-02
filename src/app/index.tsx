import { Redirect } from 'expo-router';

// Auth guard sera implémenté dans l'issue #6.
// Pour l'instant on redirige directement vers les tabs.
export default function Index() {
  return <Redirect href="/(tabs)/swipe" />;
}
