import { useEffect } from 'react';
import { DarkTheme, ThemeProvider } from 'expo-router';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import {
  Sora_300Light,
  Sora_400Regular,
  Sora_600SemiBold,
  Sora_700Bold,
  Sora_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/sora';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthContext, useAuthState } from '@/hooks/useAuth';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const auth = useAuthState();

  const [fontsLoaded] = useFonts({
    'Sora-Light':     Sora_300Light,
    'Sora-Regular':   Sora_400Regular,
    'Sora-SemiBold':  Sora_600SemiBold,
    'Sora-Bold':      Sora_700Bold,
    'Sora-ExtraBold': Sora_800ExtraBold,
  });

  useEffect(() => {
    if (fontsLoaded && !auth.isLoading) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, auth.isLoading]);

  if (!fontsLoaded || auth.isLoading) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
    </GestureHandlerRootView>
  );
}
