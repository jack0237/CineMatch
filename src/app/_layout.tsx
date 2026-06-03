import { DarkTheme, ThemeProvider } from 'expo-router';
import { Redirect, Stack } from 'expo-router';
import { AuthContext, useAuthState } from '@/hooks/useAuth';

export default function RootLayout() {
  const auth = useAuthState();

  if (auth.isLoading) return null;

  return (
    <AuthContext.Provider value={auth}>
      <ThemeProvider value={DarkTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="movie/[id]"
            options={{
              headerShown: true,
              headerTransparent: true,
              headerTitle: '',
              headerTintColor: '#FFFFFF',
              headerBackButtonDisplayMode: 'minimal',
            }}
          />
        </Stack>
      </ThemeProvider>
    </AuthContext.Provider>
  );
}
