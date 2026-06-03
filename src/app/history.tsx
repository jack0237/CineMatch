// Route collision guard: (tabs)/history.tsx and history.tsx both resolve to /history.
// Expo Router picks (tabs)/history when navigating from within tabs context.
// This file acts as a fallback redirect.
import { Redirect } from 'expo-router';

export default function HistoryRootRedirect() {
  return <Redirect href="/(tabs)/history" />;
}
