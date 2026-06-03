import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Cinema, FontSize, Spacing } from '@/constants/theme';
import { supabase } from '@/services/supabase';

export default function LoginScreen() {
  const router = useRouter();
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
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>

          {/* Phone mockup — decorative hero (Stitch Auth screen) */}
          <View style={styles.hero}>
            <View style={styles.phoneMockup}>
              <View style={styles.phoneScreen} />
            </View>
          </View>

          {/* Brand */}
          <Text style={styles.brand}>CineMatch</Text>
          <Text style={styles.tagline}>Discover your next favorite film.</Text>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Form */}
          <View style={styles.form}>
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

            {/* Forgot password — right-aligned violet (Stitch) */}
            <Link href="/(auth)/forgot-password" asChild>
              <Pressable style={styles.forgotRow}>
                <Text style={styles.forgotText}>Forgot password?</Text>
              </Pressable>
            </Link>

            {/* Global error */}
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>

          <View style={styles.spacer} />

          {/* CTA — violet pill (Stitch) */}
          <Button label="Sign In  →" loading={loading} onPress={handleSignIn} />

          {/* Sign up link */}
          <View style={styles.signupRow}>
            <Text style={styles.signupText}>{"Don't have an account?  "}</Text>
            <Link href="/(auth)/register" asChild>
              <Pressable>
                <Text style={styles.signupLink}>Sign Up</Text>
              </Pressable>
            </Link>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Cinema.bg,
  },
  flex: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: Spacing['2xl'],
    paddingBottom: Spacing['2xl'],
  },

  // Hero — phone mockup (decorative, matches Stitch layout)
  hero: {
    alignItems: 'center',
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
    height: 220,
    justifyContent: 'center',
  },
  phoneMockup: {
    width: 140,
    height: 200,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#2A2A3A',
    backgroundColor: '#141420',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneScreen: {
    width: '80%',
    height: '70%',
    backgroundColor: '#1E1E30',
    borderRadius: 8,
  },

  // Brand
  brand: {
    color: Cinema.textPrimary,
    fontSize: 42,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  tagline: {
    color: Cinema.textSecondary,
    fontSize: FontSize.base,
    fontWeight: '400',
    marginTop: Spacing.xs,
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: '#1F1F2E',
    marginVertical: Spacing.xl,
  },

  // Form
  form: {
    gap: Spacing.xl,
  },
  forgotRow: {
    alignSelf: 'flex-end',
  },
  forgotText: {
    color: Cinema.primary,
    fontSize: FontSize.sm,
    fontWeight: '500',
  },
  errorText: {
    color: '#EF4444',
    fontSize: FontSize.sm,
    textAlign: 'center',
  },

  spacer: { flex: 1, minHeight: Spacing['3xl'] },

  // Sign up
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  signupText: {
    color: Cinema.textSecondary,
    fontSize: FontSize.sm,
  },
  signupLink: {
    color: Cinema.primary,
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
});
