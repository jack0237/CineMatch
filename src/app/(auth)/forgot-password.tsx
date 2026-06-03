import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Cinema, FontSize, Spacing } from '@/constants/theme';
import { supabase } from '@/services/supabase';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  async function handleReset() {
    if (!email) {
      setError("Saisissez votre adresse email.");
      return;
    }
    setError('');
    setLoading(true);
    const { error: authError } = await supabase.auth.resetPasswordForEmail(email);
    setLoading(false);
    if (authError) {
      setError(authError.message);
    } else {
      setSent(true);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

        {/* Back button */}
        <Pressable style={styles.back} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={Cinema.textPrimary} />
        </Pressable>

        <View style={styles.content}>
          {sent ? (
            // Success state
            <View style={styles.sentContainer}>
              <Text style={styles.sentIcon}>✉️</Text>
              <Text style={styles.title}>Email envoyé</Text>
              <Text style={styles.subtitle}>
                {"Vérifie ta boîte mail.\nClique sur le lien pour réinitialiser ton mot de passe."}
              </Text>
              <Button
                label="Retour à la connexion"
                onPress={() => router.replace('/(auth)/login')}
                style={styles.btn}
              />
            </View>
          ) : (
            // Form state
            <>
              <Text style={styles.title}>Mot de passe oublié</Text>
              <Text style={styles.subtitle}>
                Saisis ton email et nous t'enverrons un lien de réinitialisation.
              </Text>

              <View style={styles.form}>
                <Input
                  label="Email Address"
                  value={email}
                  onChangeText={(t) => { setEmail(t); setError(''); }}
                  keyboardType="email-address"
                  autoComplete="email"
                  textContentType="emailAddress"
                />
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
              </View>

              <View style={styles.spacer} />

              <Button
                label="Envoyer le lien  →"
                loading={loading}
                onPress={handleReset}
                style={styles.btn}
              />

              <Pressable style={styles.backToLogin} onPress={() => router.back()}>
                <Text style={styles.backToLoginText}>Retour à la connexion</Text>
              </Pressable>
            </>
          )}
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Cinema.bg },
  flex: { flex: 1 },
  back: {
    padding: Spacing.lg,
    paddingBottom: 0,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing['2xl'],
    paddingTop: Spacing.xl,
    paddingBottom: Spacing['2xl'],
  },
  title: {
    color: Cinema.textPrimary,
    fontSize: FontSize['3xl'],
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: Spacing.md,
  },
  subtitle: {
    color: Cinema.textSecondary,
    fontSize: FontSize.base,
    lineHeight: 24,
    marginBottom: Spacing.xl,
  },
  form: { gap: Spacing.xl },
  errorText: { color: '#EF4444', fontSize: FontSize.sm },
  spacer: { flex: 1, minHeight: Spacing['3xl'] },
  btn: { marginBottom: Spacing.md },
  backToLogin: { alignItems: 'center', paddingVertical: Spacing.md },
  backToLoginText: { color: Cinema.primary, fontSize: FontSize.sm, fontWeight: '500' },
  // Success
  sentContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.lg },
  sentIcon: { fontSize: 56 },
});
