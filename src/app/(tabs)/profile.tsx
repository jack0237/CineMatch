import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/Button';
import { Cinema, FontSize, Radius, Spacing } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/services/supabase';

interface Stats {
  total: number;
  liked: number;
  disliked: number;
}

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const [stats, setStats] = useState<Stats>({ total: 0, liked: 0, disliked: 0 });
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('swipe_history')
      .select('action')
      .eq('user_id', user.id)
      .then(({ data }) => {
        const rows = data ?? [];
        setStats({
          total: rows.length,
          liked: rows.filter((r) => r.action === 'like').length,
          disliked: rows.filter((r) => r.action === 'dislike').length,
        });
        setLoading(false);
      });
  }, [user]);

  async function handleSignOut() {
    setSigningOut(true);
    await signOut();
  }

  const initials = user?.email?.slice(0, 2).toUpperCase() ?? '??';

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profil</Text>
      </View>

      <View style={styles.content}>
        {/* Avatar */}
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>

        <Text style={styles.email}>{user?.email}</Text>
        <Text style={styles.memberSince}>
          Membre depuis {new Date(user?.created_at ?? '').getFullYear()}
        </Text>

        {/* Stats */}
        {loading ? (
          <ActivityIndicator color={Cinema.primary} style={styles.loader} />
        ) : (
          <View style={styles.statsRow}>
            <StatCard icon="film" value={stats.total} label="Swipés" />
            <StatCard icon="heart" value={stats.liked} label="Matches" color={Cinema.like} />
            <StatCard icon="close-circle" value={stats.disliked} label="Refusés" color={Cinema.nope} />
          </View>
        )}

        <View style={styles.spacer} />

        <Button
          label={signingOut ? '' : 'Se déconnecter'}
          variant="ghost"
          loading={signingOut}
          onPress={handleSignOut}
        />
      </View>
    </SafeAreaView>
  );
}

function StatCard({
  icon,
  value,
  label,
  color = Cinema.primary,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  value: number;
  label: string;
  color?: string;
}) {
  return (
    <View style={styles.statCard}>
      <Ionicons name={icon} size={22} color={color} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Cinema.bg },

  header: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Cinema.border,
  },
  headerTitle: {
    color: Cinema.textPrimary,
    fontSize: FontSize.xl,
    fontWeight: '700',
  },

  content: {
    flex: 1,
    paddingHorizontal: Spacing['2xl'],
    paddingTop: Spacing['2xl'],
    paddingBottom: Spacing['2xl'],
    alignItems: 'center',
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: Radius.pill,
    backgroundColor: Cinema.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: FontSize['2xl'],
    fontWeight: '700',
  },
  email: {
    color: Cinema.textPrimary,
    fontSize: FontSize.lg,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  memberSince: {
    color: Cinema.textMuted,
    fontSize: FontSize.sm,
    marginBottom: Spacing['2xl'],
  },

  loader: { marginVertical: Spacing['2xl'] },

  statsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    width: '100%',
  },
  statCard: {
    flex: 1,
    backgroundColor: Cinema.surfaceElevated,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  statValue: {
    color: Cinema.textPrimary,
    fontSize: FontSize['2xl'],
    fontWeight: '700',
  },
  statLabel: {
    color: Cinema.textSecondary,
    fontSize: FontSize.xs,
  },

  spacer: { flex: 1 },
});
