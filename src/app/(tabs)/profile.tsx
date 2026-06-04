import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/Button';
import { FontSize, Fonts, Radius, Spacing, Stitch } from '@/constants/theme';
import { useColors } from '@/hooks/use-theme';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/services/supabase';

interface Stats {
  total: number;
  liked: number;
  disliked: number;
}

// ── StatCard ──────────────────────────────────────────────────────────────────

function StatCard({
  icon,
  value,
  label,
  color,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  value: number;
  label: string;
  color: string;
}) {
  const C = useColors();
  return (
    <View style={[styles.statCard, { backgroundColor: C.surfaceElevated }]}>
      <Ionicons name={icon} size={22} color={color} />
      <Text style={[styles.statValue, { color: C.textPrimary }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: C.textSecondary }]}>{label}</Text>
    </View>
  );
}

// ── NavRow ────────────────────────────────────────────────────────────────────

function NavRow({
  icon,
  label,
  onPress,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  onPress: () => void;
}) {
  const C = useColors();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.navRow,
        {
          backgroundColor: pressed ? C.surfaceHighest : C.surfaceElevated,
          borderColor: C.border,
        },
      ]}
    >
      <View style={[styles.navIcon, { backgroundColor: `${C.primary}1A` }]}>
        <Ionicons name={icon} size={18} color={C.primary} />
      </View>
      <Text style={[styles.navLabel, { color: C.textPrimary }]}>{label}</Text>
      <Ionicons name="chevron-forward" size={16} color={C.textMuted} />
    </Pressable>
  );
}

// ── ProfileScreen ─────────────────────────────────────────────────────────────

export default function ProfileScreen() {
  const C = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
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
          liked: rows.filter(r => r.action === 'like').length,
          disliked: rows.filter(r => r.action === 'dislike').length,
        });
        setLoading(false);
      });
  }, [user?.id]);

  async function handleSignOut() {
    setSigningOut(true);
    await signOut();
  }

  const initials = user?.email?.slice(0, 2).toUpperCase() ?? '??';

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: C.bg }]} edges={['top']}>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <View style={[styles.header, { borderBottomColor: 'rgba(255,255,255,0.06)' }]}>
        <Text style={[styles.headerTitle, { color: C.primary }]}>Profil</Text>
      </View>

      {/* ── Content ──────────────────────────────────────────────────────────── */}
      <ScrollView
        style={styles.flex}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom + Spacing.lg, Spacing['2xl']) },
        ]}
        showsVerticalScrollIndicator={false}>

        {/* Avatar + identity */}
        <View style={[styles.avatar, { backgroundColor: C.primary }]}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <Text
          style={[styles.email, { color: C.textPrimary }]}
          numberOfLines={1}
          ellipsizeMode="middle">
          {user?.email}
        </Text>
        <Text style={[styles.memberSince, { color: C.textMuted }]}>
          Membre depuis {new Date(user?.created_at ?? '').getFullYear()}
        </Text>

        {/* Stats */}
        {loading ? (
          <ActivityIndicator color={C.primary} style={styles.loader} />
        ) : (
          <View style={styles.statsRow}>
            <StatCard icon="film"         value={stats.total}    label="Swipés"  color={C.primary} />
            <StatCard icon="heart"        value={stats.liked}    label="Aimés"   color={C.like} />
            <StatCard icon="close-circle" value={stats.disliked} label="Passés"  color={C.nope} />
          </View>
        )}

        {/* Navigation rows */}
        <View style={styles.navSection}>
          <NavRow
            icon="time-outline"
            label="Historique des swipes"
            onPress={() => router.push('/history')}
          />
        </View>

        <View style={styles.spacer} />

        <Button
          label={signingOut ? '' : 'Se déconnecter'}
          variant="ghost"
          loading={signingOut}
          onPress={handleSignOut}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },

  // Header — same height as other screens
  header: {
    height: 56,
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerTitle: {
    fontFamily: Fonts.bold,
    fontSize: FontSize['2xl'],
    letterSpacing: -0.5,
  },

  content: {
    flex: 1,
    paddingHorizontal: Spacing['2xl'],
    paddingTop: Spacing['2xl'],
    paddingBottom: Spacing['2xl'],
    alignItems: 'center',
  },

  // Avatar
  avatar: {
    width: 80,
    height: 80,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  avatarText: {
    color: Stitch.onPrimary,
    fontFamily: Fonts.bold,
    fontSize: FontSize['2xl'],
  },

  email: {
    fontFamily: Fonts.semibold,
    fontSize: FontSize.lg,
    marginBottom: Spacing.xs,
  },
  memberSince: {
    fontFamily: Fonts.regular,
    fontSize: FontSize.sm,
    marginBottom: Spacing['2xl'],
  },

  loader: { marginVertical: Spacing['2xl'] },

  // Stats
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    width: '100%',
    marginBottom: Spacing.xl,
  },
  statCard: {
    flex: 1,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  statValue: {
    fontFamily: Fonts.bold,
    fontSize: FontSize['2xl'],
  },
  statLabel: {
    fontFamily: Fonts.regular,
    fontSize: FontSize.xs,
  },

  // Navigation rows
  navSection: {
    width: '100%',
    gap: Spacing.sm,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
  },
  navIcon: {
    width: 32,
    height: 32,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navLabel: {
    flex: 1,
    fontFamily: Fonts.semibold,
    fontSize: FontSize.base,
  },

  spacer: { flex: 1 },
});
