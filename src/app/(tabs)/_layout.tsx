import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import type { ColorValue } from 'react-native';
import { Cinema } from '@/constants/theme';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

function icon(base: IoniconName, active: IoniconName) {
  return ({ color, focused }: { color: ColorValue; focused: boolean }) => (
    <Ionicons name={focused ? active : base} size={24} color={color as string} />
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Cinema.tabBar,
          borderTopColor: Cinema.border,
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: Cinema.tabBarActive,
        tabBarInactiveTintColor: Cinema.tabBarInactive,
        tabBarLabelStyle: { fontSize: 10, fontWeight: '500' },
      }}>
      {/* 1 — Swipe (clapperboard icon — matches Stitch) */}
      <Tabs.Screen
        name="swipe"
        options={{ title: 'Swipe', tabBarIcon: icon('film-outline', 'film') }}
      />
      {/* 2 — Matches (heart — matches Stitch) */}
      <Tabs.Screen
        name="matches"
        options={{ title: 'Matches', tabBarIcon: icon('heart-outline', 'heart') }}
      />
      {/* 3 — Search (search icon — for evaluation) */}
      <Tabs.Screen
        name="search"
        options={{ title: 'Recherche', tabBarIcon: icon('search-outline', 'search') }}
      />
      {/* 4 — History (time/grid icon — matches Stitch 3rd tab) */}
      <Tabs.Screen
        name="history"
        options={{ title: 'Historique', tabBarIcon: icon('grid-outline', 'grid') }}
      />
      {/* 5 — Profile (person — matches Stitch) */}
      <Tabs.Screen
        name="profile"
        options={{ title: 'Profil', tabBarIcon: icon('person-outline', 'person') }}
      />
    </Tabs>
  );
}
