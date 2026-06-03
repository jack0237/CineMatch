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
import { FontSize, Spacing, Stitch } from '@/constants/theme';
import { useColors } from '@/hooks/use-theme';
import { supabase } from '@/services/supabase';

export default function ForgotPasswordScreen() {
  const C = useColors();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  async function handleReset() {
    if (!email) {
      setError('Saisissez votre adresse email.');
      return;
    }
    setError('');
    setLoading(true);
    const { error: authError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'cinematch://reset-password',
    });
    setLoading(false);
    if (authError) {
      setError(authError.message);
    } else {
      setSent(true);
    }
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: C.bg }]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

        {/* Back button */}
        <Pressable style={styles.back} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={C.textPrimary} />
        </Pressable>

        <View style={styles.content}>
          {sent ? (
            <View style={styles.sentContainer}>
              <View style={[styles.sentIconWrap, { backgroundColor: C.primaryDim }]}>
                <Ionicons name="mail-outline" size={36} color={C.primary} />
              </View>
              <Text style={[styles.title, { color: C.textPrimary }]}>Email envoyé</Text>
              <Text style={[styles.subtitle, { color: C.textSecondary }]}>
                {"Vérifie ta boîte mail.\nClique sur le lien pour réinitialiser ton mot de passe."}
              </Text>
              <Button
                variant="gradient"
                label="Retour à la connexion"
                icon="arrow-forward"
                onPress={() => router.replace('/(auth)/login')}
                style={styles.btn}
              />
            </View>
          ) : (
            <>
              <Text style={[styles.title, { color: C.textPrimary }]}>Mot de passe oublié</Text>
              <Text style={[styles.subtitle, { color: C.textSecondary }]}>
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
                variant="gradient"
                label="Envoyer le lien"
                icon="arrow-forward"
                loading={loading}
                onPress={handleReset}
                style={styles.btn}
              />

              <Pressable style={styles.backToLogin} onPress={() => router.back()}>
                <Text style={[styles.backToLoginText, { color: C.primary }]}>Retour à la connexion</Text>
              </Pressable>
            </>
          )}
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
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
    fontSize: FontSize['3xl'],
    fontFamily: 'Sora-Bold',
    letterSpacing: -0.5,
    marginBottom: Spacing.md,
  },
  subtitle: {
    fontSize: FontSize.base,
    lineHeight: 24,
    marginBottom: Spacing.xl,
  },
  form: { gap: Spacing.xl },
  errorText: { color: Stitch.error, fontSize: FontSize.sm },
  spacer: { flex: 1, minHeight: Spacing['3xl'] },
  btn: { marginBottom: Spacing.md },
  backToLogin: { alignItems: 'center', paddingVertical: Spacing.md },
  backToLoginText: { fontSize: FontSize.sm, fontWeight: '500' },

  sentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.lg,
  },
  sentIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
});
