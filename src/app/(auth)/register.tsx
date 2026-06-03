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

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleSignUp() {
    if (!email || !password || !confirm) {
      setError('Veuillez remplir tous les champs.');
      return;
    }
    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }
    if (password !== confirm) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    setError('');
    setLoading(true);
    const { error: authError } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (authError) {
      setError(authError.message);
    } else {
      setSuccess(true);
    }
  }

  if (success) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.successContainer}>
          <Text style={styles.successIcon}>✓</Text>
          <Text style={styles.successTitle}>Compte créé !</Text>
          <Text style={styles.successSub}>
            Vérifie ta boîte mail pour confirmer ton adresse.
          </Text>
          <Button
            label="Se connecter"
            onPress={() => router.replace('/(auth)/login')}
            style={styles.btn}
          />
        </View>
      </SafeAreaView>
    );
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

          {/* Hero */}
          <View style={styles.hero}>
            <View style={styles.phoneMockup}>
              <View style={styles.phoneScreen} />
            </View>
          </View>

          {/* Brand */}
          <Text style={styles.brand}>CineMatch</Text>
          <Text style={styles.tagline}>Create your account.</Text>

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
              autoComplete="new-password"
              textContentType="newPassword"
            />
            <Input
              label="Confirm Password"
              value={confirm}
              onChangeText={(t) => { setConfirm(t); setError(''); }}
              isPassword
              autoComplete="new-password"
              textContentType="newPassword"
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>

          <View style={styles.spacer} />

          <Button label="Sign Up  →" loading={loading} onPress={handleSignUp} style={styles.btn} />

          <View style={styles.signinRow}>
            <Text style={styles.signinText}>{'Already have an account?  '}</Text>
            <Link href="/(auth)/login" asChild>
              <Pressable>
                <Text style={styles.signinLink}>Sign In</Text>
              </Pressable>
            </Link>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Cinema.bg },
  flex: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: Spacing['2xl'],
    paddingBottom: Spacing['2xl'],
  },
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
  brand: {
    color: Cinema.textPrimary,
    fontSize: 42,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  tagline: {
    color: Cinema.textSecondary,
    fontSize: FontSize.base,
    marginTop: Spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: '#1F1F2E',
    marginVertical: Spacing.xl,
  },
  form: { gap: Spacing.xl },
  errorText: { color: '#EF4444', fontSize: FontSize.sm, textAlign: 'center' },
  spacer: { flex: 1, minHeight: Spacing['3xl'] },
  btn: { marginBottom: Spacing.md },
  signinRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  signinText: { color: Cinema.textSecondary, fontSize: FontSize.sm },
  signinLink: { color: Cinema.primary, fontSize: FontSize.sm, fontWeight: '600' },
  // Success state
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing['2xl'],
    gap: Spacing.lg,
  },
  successIcon: { fontSize: 56, color: Cinema.primary },
  successTitle: { color: Cinema.textPrimary, fontSize: FontSize['2xl'], fontWeight: '700' },
  successSub: {
    color: Cinema.textSecondary,
    fontSize: FontSize.base,
    textAlign: 'center',
    lineHeight: 24,
  },
});
