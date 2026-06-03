import { Tabs } from 'expo-router';
import { Cinema, Fonts } from '@/constants/theme';
import { tabIcon } from '@/components/ui/TabIcon';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'rgba(19, 19, 19, 0.92)',
          borderTopColor: 'rgba(255, 255, 255, 0.08)',
          borderTopWidth: 1,
          height: 68,
          paddingBottom: 10,
          paddingTop: 6,
        },
        tabBarActiveTintColor: Cinema.primary,
        tabBarInactiveTintColor: Cinema.textDisabled,
        tabBarLabelStyle: {
          fontFamily: Fonts.semibold,
          fontSize: 10,
          letterSpacing: 0.4,
          marginTop: 2,
        },
      }}>

      <Tabs.Screen
        name="swipe"
        options={{
          title: 'Swipe',
          tabBarIcon: tabIcon({ name: 'cards-outline', activeName: 'cards' }),
        }}
      />

      <Tabs.Screen
        name="matches"
        options={{
          title: 'Matches',
          tabBarIcon: tabIcon({ name: 'heart-outline', activeName: 'heart' }),
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          title: 'Recherche',
          tabBarIcon: tabIcon({ name: 'magnify', activeName: 'magnify' }),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: tabIcon({ name: 'account-outline', activeName: 'account' }),
        }}
      />

      {/* History screen kept as route but hidden from the tab bar */}
      <Tabs.Screen
        name="history"
        options={{ href: null }}
      />
    </Tabs>
  );
}
