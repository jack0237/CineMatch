import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { FontSize, Fonts, Radius, Spacing, Stitch } from '@/constants/theme';
import { useColors } from '@/hooks/use-theme';
import { useAuth } from '@/hooks/useAuth';
import { getAllSwipes } from '@/services/swipe';
import type { SwipeHistory } from '@/types/supabase';
import { posterUrl } from '@/utils/format';
import { GENRE_NAMES } from '@/components/SearchResultCard';

// ── Utils ─────────────────────────────────────────────────────────────────────

const MONTHS_FR = [
  'janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin',
  'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.',
];

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getDate()} ${MONTHS_FR[d.getMonth()]} ${d.getFullYear()}`;
}

// ── Filter chips ──────────────────────────────────────────────────────────────

type Filter = 'all' | 'like' | 'dislike';

const CHIPS: { id: Filter; label: string }[] = [
  { id: 'all',     label: 'Tous' },
  { id: 'like',    label: 'Aimés' },
  { id: 'dislike', label: 'Passés' },
];

// ── HistoryItem ───────────────────────────────────────────────────────────────

function HistoryItem({
  item,
  onPress,
}: {
  item: SwipeHistory;
  onPress: () => void;
}) {
  const C = useColors();
  const isLiked = item.action === 'like';
  const uri = posterUrl(item.movie_poster_path, 'w342') ?? undefined;
  const genre = item.movie_genre_ids[0]
    ? GENRE_NAMES[item.movie_genre_ids[0]]
    : null;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { borderColor: 'rgba(255,255,255,0.08)' },
        pressed && styles.cardPressed,
      ]}
    >
      {/* Poster */}
      <View style={[styles.posterWrap, { opacity: isLiked ? 1 : 0.65 }]}>
        <Image
          source={uri}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={200}
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.6)']}
          locations={[0.5, 1]}
          style={StyleSheet.absoluteFill}
        />
      </View>

      {/* Details */}
      <View style={styles.details}>
        <Text
          style={[
            styles.title,
            { color: isLiked ? Stitch.onBackground : `${Stitch.onBackground}B3` },
          ]}
          numberOfLines={1}
        >
          {item.movie_title}
        </Text>
        <View style={styles.metaRow}>
          {genre && (
            <Text style={[styles.meta, { color: Stitch.onSurfaceVariant }]}>
              {genre.toUpperCase()}
            </Text>
          )}
          {genre && (
            <View style={[styles.metaDot, { backgroundColor: `${Stitch.onSurfaceVariant}4D` }]} />
          )}
          <Text style={[styles.meta, { color: Stitch.onSurfaceVariant }]}>
            {formatDate(item.swiped_at)}
          </Text>
        </View>
      </View>

      {/* Action badge */}
      <View
        style={[
          styles.badge,
          {
            backgroundColor: isLiked
              ? 'rgba(0,165,114,0.2)'
              : 'rgba(147,0,10,0.2)',
          },
        ]}
      >
        <Ionicons
          name={isLiked ? 'heart' : 'close'}
          size={18}
          color={isLiked ? Stitch.secondary : Stitch.error}
        />
      </View>
    </Pressable>
  );
}

// ── HistoryScreen ─────────────────────────────────────────────────────────────

export default function HistoryScreen() {
  const C = useColors();
  const router = useRouter();
  const { user } = useAuth();
  const [allSwipes, setAllSwipes] = useState<SwipeHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('all');

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    getAllSwipes(user.id)
      .then(setAllSwipes)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user?.id]);

  const displayed =
    filter === 'all'
      ? allSwipes
      : allSwipes.filter(s => s.action === filter);

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: C.bg }]} edges={['top']}>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <View style={[styles.header, { borderBottomColor: 'rgba(255,255,255,0.06)' }]}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={styles.headerBtn}>
          <Ionicons name="chevron-back" size={26} color={C.primary} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: C.primary }]}>Cinematic History</Text>
        {/* spacer for centering */}
        <View style={styles.headerBtn} />
      </View>

      {/* ── Filter chips ─────────────────────────────────────────────────────── */}
      <View style={styles.chipsRow}>
        {CHIPS.map(chip => {
          const active = filter === chip.id;
          return (
            <Pressable
              key={chip.id}
              onPress={() => setFilter(chip.id)}
              style={[
                styles.chip,
                {
                  backgroundColor: active
                    ? `${C.primary}1A`
                    : 'rgba(255,255,255,0.03)',
                  borderColor: active
                    ? 'rgba(255,255,255,0.15)'
                    : 'rgba(255,255,255,0.08)',
                },
              ]}
            >
              <Text
                style={[
                  styles.chipLabel,
                  { color: active ? C.primary : Stitch.onSurfaceVariant },
                ]}
              >
                {chip.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* ── Content ──────────────────────────────────────────────────────────── */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={C.primary} size="large" />
        </View>
      ) : displayed.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="film-outline" size={48} color={C.textDisabled} />
          <Text style={[styles.emptyTitle, { color: C.textPrimary }]}>
            {filter === 'all' ? 'Aucun film swipé' : filter === 'like' ? 'Aucun film aimé' : 'Aucun film passé'}
          </Text>
          <Text style={[styles.emptyText, { color: C.textMuted }]}>
            Lance le swipe pour remplir ton historique.
          </Text>
        </View>
      ) : (
        <FlatList<SwipeHistory>
          data={displayed}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <HistoryItem
              item={item}
              onPress={() => router.push(`/movie/${item.movie_id}`)}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1 },

  // Header
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerBtn: { width: 36, alignItems: 'center' },
  headerTitle: {
    fontFamily: Fonts.bold,
    fontSize: FontSize['2xl'],
    letterSpacing: -0.5,
  },

  // Chips
  chipsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingHorizontal: 20,
    paddingVertical: Spacing.md,
  },
  chip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.pill,
    borderWidth: 1,
  },
  chipLabel: {
    fontFamily: Fonts.semibold,
    fontSize: FontSize.sm,
    letterSpacing: 0.3,
  },

  // List
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  separator: { height: Spacing.md },

  // Card
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderRadius: 24,
    padding: Spacing.md,
  },
  cardPressed: {
    backgroundColor: 'rgba(255,255,255,0.06)',
  },

  // Poster
  posterWrap: {
    width: 64,
    height: 96,
    flexShrink: 0,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    backgroundColor: Stitch.surfaceContainerHigh,
  },

  // Details
  details: {
    flex: 1,
    gap: 6,
  },
  title: {
    fontFamily: Fonts.semibold,
    fontSize: FontSize.xl,
    lineHeight: 28,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  meta: {
    fontFamily: Fonts.light,
    fontSize: 12,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  metaDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },

  // Action badge
  badge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  // Feedback
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontFamily: Fonts.bold,
    fontSize: FontSize.lg,
    textAlign: 'center',
  },
  emptyText: {
    fontFamily: Fonts.regular,
    fontSize: FontSize.sm,
    textAlign: 'center',
    lineHeight: 20,
  },
});
