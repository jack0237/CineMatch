import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/Button';
import { FontSize, Radius, Spacing } from '@/constants/theme';
import { useColors } from '@/hooks/use-theme';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/services/supabase';

interface Stats {
  total: number;
  liked: number;
  disliked: number;
}

export default function ProfileScreen() {
  const C = useColors();
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
    <SafeAreaView style={[styles.safe, { backgroundColor: C.bg }]}>
      <View style={[styles.header, { borderBottomColor: C.border }]}>
        <Text style={[styles.headerTitle, { color: C.textPrimary }]}>Profil</Text>
      </View>

      <View style={styles.content}>
        {/* Avatar */}
        <View style={[styles.avatar, { backgroundColor: C.primary }]}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>

        <Text style={[styles.email, { color: C.textPrimary }]}>{user?.email}</Text>
        <Text style={[styles.memberSince, { color: C.textMuted }]}>
          Membre depuis {new Date(user?.created_at ?? '').getFullYear()}
        </Text>

        {/* Stats */}
        {loading ? (
          <ActivityIndicator color={C.primary} style={styles.loader} />
        ) : (
          <View style={styles.statsRow}>
            <StatCard icon="film" value={stats.total} label="Swipés" color={C.primary} surfaceColor={C.surfaceElevated} />
            <StatCard icon="heart" value={stats.liked} label="Matches" color={C.like} surfaceColor={C.surfaceElevated} />
            <StatCard icon="close-circle" value={stats.disliked} label="Refusés" color={C.nope} surfaceColor={C.surfaceElevated} />
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
  color,
  surfaceColor,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  value: number;
  label: string;
  color: string;
  surfaceColor: string;
}) {
  const C = useColors();
  return (
    <View style={[styles.statCard, { backgroundColor: surfaceColor }]}>
      <Ionicons name={icon} size={22} color={color} />
      <Text style={[styles.statValue, { color: C.textPrimary }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: C.textSecondary }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },

  header: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
  },
  headerTitle: {
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
    fontSize: FontSize.lg,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  memberSince: {
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
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  statValue: {
    fontSize: FontSize['2xl'],
    fontWeight: '700',
  },
  statLabel: {
    fontSize: FontSize.xs,
  },

  spacer: { flex: 1 },
});
