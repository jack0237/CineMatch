import { useState } from 'react';
import {
  Dimensions,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Cinema, Stitch } from '@/constants/theme';
import { supabase } from '@/services/supabase';

const HERO_URI =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBiB4v--saynh5QTQhc4wSCoDVF9BAE26400WY04nvmfTePKHCUn1SIPYFEFCZhNlh0jOK6aKe4gpVWC36JGBXcVeES_Rf--IPnZzdtvImzArQzvd6OyuOz8-nybUNnUHGsmqb1rPUYKHKussU30iv453hkUgisajyBWaJNl1CtIyV-hNqgSPvx05aPxucB9ZJGxBSo68HDk6IstplbDyNupgasWmohO2SibaHYKID1YxJaV7LLG1Toh1AgDZLCiQHlzRy9jEE7f_I';

const { height: SCREEN_H } = Dimensions.get('window');
const HERO_H = Math.min(353, Math.floor(SCREEN_H * 0.42));

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSignIn() {
    if (!email || !password) {
      setError('Veuillez remplir tous les champs.');
      return;
    }
    setError('');
    setLoading(true);
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (authError) {
      setError(authError.message);
    } else {
      router.replace('/(tabs)/swipe');
    }
  }

  return (
    <View style={s.root}>
      {/* ── Hero image (top ~40%) ── */}
      <ImageBackground source={{ uri: HERO_URI }} style={s.hero} resizeMode="cover">
        <LinearGradient
          colors={['rgba(19,19,19,0.4)', 'rgba(19,19,19,0.6)', Cinema.bg]}
          locations={[0, 0.5, 1]}
          style={StyleSheet.absoluteFill}
        />
        <View style={[s.brand, { paddingTop: insets.top }]}>
          <Text style={s.brandTitle}>CineMatch</Text>
          <Text style={s.brandTagline}>Discover your next favorite film.</Text>
        </View>
      </ImageBackground>

      {/* ── Glass panel ── */}
      <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={s.panel}>
          <View style={s.handle} />

          <ScrollView
            style={s.flex}
            contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 24 }]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>

            <View style={s.form}>
              <Input
                label="Email Address"
                value={email}
                onChangeText={(t) => { setEmail(t); setError(''); }}
                keyboardType="email-address"
                autoComplete="email"
                textContentType="emailAddress"
              />
              <Input
                label="Password"
                value={password}
                onChangeText={(t) => { setPassword(t); setError(''); }}
                isPassword
                autoComplete="password"
                textContentType="password"
              />
            </View>

            <Link href="/(auth)/forgot-password" asChild>
              <Pressable style={s.forgotRow}>
                <Text style={s.forgotText}>Forgot password?</Text>
              </Pressable>
            </Link>

            {error ? <Text style={s.errorText}>{error}</Text> : null}

            <View style={s.spacer} />

            <Button
              variant="gradient"
              label="Sign In"
              icon="arrow-forward"
              loading={loading}
              onPress={handleSignIn}
            />

            <View style={s.signupRow}>
              <Text style={s.signupText}>{"Don't have an account?"}</Text>
              <Link href="/(auth)/register" asChild>
                <Pressable>
                  <Text style={s.signupLink}>Sign Up</Text>
                </Pressable>
              </Link>
            </View>

          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Cinema.bg },
  flex: { flex: 1 },

  hero: {
    height: HERO_H,
    width: '100%',
    justifyContent: 'flex-end',
  },
  brand: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    zIndex: 10,
  },
  brandTitle: {
    color: Cinema.textPrimary,
    fontSize: 48,
    lineHeight: 52,
    fontFamily: 'Sora-ExtraBold',
    letterSpacing: -0.96,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 12,
    marginBottom: 8,
  },
  brandTagline: {
    color: Cinema.textSecondary,
    fontSize: 20,
    lineHeight: 28,
    fontFamily: 'Sora-SemiBold',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },

  panel: {
    flex: 1,
    backgroundColor: 'rgba(19,19,19,0.97)',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -12 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 16,
    paddingTop: 16,
  },
  handle: {
    width: 48,
    height: 4,
    borderRadius: 2,
    backgroundColor: Cinema.surfaceHighest,
    alignSelf: 'center',
    marginBottom: 24,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  form: {
    gap: 32,
    marginTop: 16,
  },

  forgotRow: {
    alignSelf: 'flex-end',
    marginTop: 16,
  },
  forgotText: {
    color: Cinema.primary,
    fontSize: 14,
    fontFamily: 'Sora-SemiBold',
    letterSpacing: 0.7,
  },
  errorText: {
    color: Stitch.error,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 12,
  },

  spacer: { flex: 1, minHeight: 32 },

  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    marginTop: 24,
  },
  signupText: {
    color: Cinema.textSecondary,
    fontSize: 16,
    lineHeight: 24,
  },
  signupLink: {
    color: Cinema.primary,
    fontSize: 14,
    fontFamily: 'Sora-SemiBold',
    letterSpacing: 0.7,
  },
});
