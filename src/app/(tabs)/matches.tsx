import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useDebounce } from 'use-debounce';
import { FontSize, Fonts, Radius, Spacing, Stitch } from '@/constants/theme';
import { useColors } from '@/hooks/use-theme';
import { useAuth } from '@/hooks/useAuth';
import { getLikedMovies, type SortMode } from '@/services/swipe';
import { searchMovies } from '@/services/tmdb';
import type { Movie } from '@/types/tmdb';
import type { SwipeHistory } from '@/types/supabase';
import { posterUrl } from '@/utils/format';
import { SearchBar } from '@/components/SearchBar';
import { MovieListItem } from '@/components/MovieListItem';

const H_PAD = 20;
const GAP = Spacing.lg;
const CARD_WIDTH = (Dimensions.get('window').width - H_PAD * 2 - GAP) / 2;
const RECENT_MS = 7 * 24 * 60 * 60 * 1000;

const SORT_CHIPS: { label: string; value: SortMode }[] = [
  { label: 'Score', value: 'score' },
  { label: 'Récents', value: 'latest' },
  { label: 'Genres', value: 'genres' },
];

function isRecent(swipedAt: string): boolean {
  return Date.now() - new Date(swipedAt).getTime() < RECENT_MS;
}

// ── MatchCard ─────────────────────────────────────────────────────────────────

interface MatchCardProps {
  item: SwipeHistory;
  onPress: () => void;
}

function MatchCard({ item, onPress }: MatchCardProps) {
  const C = useColors();
  const matchPct = Math.round(item.movie_vote_average * 10);
  const recent = isRecent(item.swiped_at);
  const uri = posterUrl(item.movie_poster_path, 'w342');

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <Image
        source={uri ?? undefined}
        style={styles.poster}
        contentFit="cover"
        transition={200}
      />
      {recent && (
        <View
          style={[
            styles.notifDot,
            { backgroundColor: Stitch.error, shadowColor: Stitch.error },
          ]}
        />
      )}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.92)']}
        locations={[0, 0.55, 1]}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.cardFooter}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.movie_title}
        </Text>
        <View style={styles.cardMeta}>
          <Ionicons name="star" size={13} color={C.like} />
          <Text style={[styles.cardMatch, { color: C.like }]}>{matchPct}% Match</Text>
        </View>
      </View>
    </Pressable>
  );
}

// ── Separator for search results ─────────────────────────────────────────────

function Separator({ color }: { color: string }) {
  return <View style={[styles.separator, { backgroundColor: color }]} />;
}

// ── MatchesScreen ─────────────────────────────────────────────────────────────

export default function MatchesScreen() {
  const C = useColors();
  const { user } = useAuth();
  const router = useRouter();

  // ── Matches state ──────────────────────────────────────────────────────────
  const [sort, setSort] = useState<SortMode>('score');
  const [movies, setMovies] = useState<SwipeHistory[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(true);
  const [errorMatches, setErrorMatches] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  // Skip the first focus (already handled by the useEffect below)
  const firstFocusRef = useRef(true);

  // ── Search state ───────────────────────────────────────────────────────────
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebounce(query, 400);
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // ── Auto-refresh when tab gains focus ─────────────────────────────────────
  useFocusEffect(
    useCallback(() => {
      if (firstFocusRef.current) {
        firstFocusRef.current = false;
        return;
      }
      setRefreshKey(k => k + 1);
    }, [])
  );

  // ── Load liked movies ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!user) return;
    setLoadingMatches(true);
    setErrorMatches('');
    getLikedMovies(user.id, sort)
      .then(setMovies)
      .catch(() => setErrorMatches('Impossible de charger tes matches.'))
      .finally(() => setLoadingMatches(false));
  }, [user?.id, sort, refreshKey]);

  // ── Debounced search ───────────────────────────────────────────────────────
  useEffect(() => {
    const q = debouncedQuery.trim();
    if (!q) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    searchMovies(q)
      .then(res => setSearchResults(res.results))
      .catch(() => setSearchResults([]))
      .finally(() => setIsSearching(false));
  }, [debouncedQuery]);

  // ── Derived ────────────────────────────────────────────────────────────────
  const isSearchMode = query.trim().length > 0;
  const isPending = isSearchMode && query !== debouncedQuery;
  const showLoader = isSearchMode && (isPending || isSearching);
  const showEmpty =
    isSearchMode && !isPending && !isSearching &&
    searchResults.length === 0 && debouncedQuery.trim().length > 0;

  const leftCol = movies.filter((_, i) => i % 2 === 0);
  const rightCol = movies.filter((_, i) => i % 2 !== 0);

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: C.bg }]} edges={['top']}>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: C.primary }]}>CineMatch</Text>
        <Pressable
          hitSlop={8}
          onPress={() => setRefreshKey(k => k + 1)}
          style={styles.headerBtn}
        >
          <Ionicons name="refresh-outline" size={22} color={C.primary} />
        </Pressable>
      </View>

      {/* ── Sort chips — hidden while searching ───────────────────────────── */}
      {!isSearchMode && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipsScroll}
          contentContainerStyle={styles.chipsRow}
        >
          {SORT_CHIPS.map(chip => {
            const active = sort === chip.value;
            return (
              <Pressable
                key={chip.value}
                onPress={() => setSort(chip.value)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: active ? C.primary : 'rgba(255,255,255,0.08)',
                    borderColor: active ? C.primary : 'rgba(255,255,255,0.12)',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.chipLabel,
                    { color: active ? Stitch.onPrimary : C.textSecondary },
                  ]}
                >
                  {chip.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      )}

      {/* ── Search bar ─────────────────────────────────────────────────────── */}
      <View style={styles.searchWrap}>
        <SearchBar value={query} onChangeText={setQuery} />
      </View>

      {/* ── Content ────────────────────────────────────────────────────────── */}
      {isSearchMode ? (
        // ── Search results ─────────────────────────────────────────────────
        showLoader ? (
          <View style={styles.center}>
            <ActivityIndicator color={C.primary} size="large" />
          </View>
        ) : showEmpty ? (
          <View style={styles.center}>
            <Ionicons name="film-outline" size={44} color={C.textDisabled} />
            <Text style={[styles.emptyTitle, { color: C.textPrimary }]}>
              Aucun film trouvé
            </Text>
            <Text style={[styles.feedbackText, { color: C.textMuted }]}>
              pour &ldquo;{debouncedQuery}&rdquo;
            </Text>
          </View>
        ) : (
          <FlatList<Movie>
            data={searchResults}
            keyExtractor={item => String(item.id)}
            renderItem={({ item }) => (
              <MovieListItem
                movie={item}
                onPress={() => router.push(`/movie/${item.id}`)}
              />
            )}
            ItemSeparatorComponent={() => <Separator color={C.border} />}
            style={styles.searchList}
            contentContainerStyle={styles.searchContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
          />
        )
      ) : (
        // ── Matches grid ───────────────────────────────────────────────────
        loadingMatches ? (
          <View style={styles.center}>
            <ActivityIndicator color={C.primary} size="large" />
          </View>
        ) : errorMatches ? (
          <View style={styles.center}>
            <Text style={[styles.feedbackText, { color: C.textMuted }]}>{errorMatches}</Text>
          </View>
        ) : movies.length === 0 ? (
          <View style={styles.center}>
            <Ionicons name="heart-outline" size={48} color={C.textDisabled} />
            <Text style={[styles.emptyTitle, { color: C.textPrimary }]}>
              Aucun match pour l&apos;instant
            </Text>
            <Text style={[styles.feedbackText, { color: C.textMuted }]}>
              Swipe des films pour les retrouver ici.
            </Text>
          </View>
        ) : (
          <ScrollView
            style={styles.gridScroll}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.grid}
          >
            <View style={styles.columns}>
              <View style={styles.column}>
                {leftCol.map(item => (
                  <MatchCard
                    key={item.id}
                    item={item}
                    onPress={() => router.push(`/movie/${item.movie_id}`)}
                  />
                ))}
              </View>
              <View style={styles.column}>
                {rightCol.map(item => (
                  <MatchCard
                    key={item.id}
                    item={item}
                    onPress={() => router.push(`/movie/${item.movie_id}`)}
                  />
                ))}
              </View>
            </View>
          </ScrollView>
        )
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: H_PAD,
    height: 56,
  },
  headerTitle: {
    fontFamily: Fonts.bold,
    fontSize: FontSize['2xl'],
    letterSpacing: -0.5,
  },
  headerBtn: { padding: 4 },

  // Chips
  chipsScroll: { flexGrow: 0 },
  chipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: H_PAD,
    paddingBottom: Spacing.md,
    gap: Spacing.sm,
  },
  chip: {
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.pill,
    borderWidth: 1,
  },
  chipLabel: {
    fontFamily: Fonts.semibold,
    fontSize: FontSize.sm,
    letterSpacing: 0.4,
  },

  // Search bar wrapper
  searchWrap: {
    paddingHorizontal: H_PAD,
    paddingBottom: Spacing.md,
  },

  // Search results
  searchList: { flex: 1 },
  searchContent: {
    paddingHorizontal: H_PAD,
    paddingBottom: 100,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginLeft: H_PAD + 52 + Spacing.lg, // align with text, after poster
  },

  // Matches grid
  gridScroll: { flex: 1 },
  grid: {
    paddingHorizontal: H_PAD,
    paddingBottom: 100,
  },
  columns: {
    flexDirection: 'row',
    gap: GAP,
  },
  column: {
    flex: 1,
    gap: GAP,
  },

  // MatchCard
  card: {
    width: CARD_WIDTH,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  cardPressed: { transform: [{ scale: 0.97 }] },
  poster: {
    width: '100%',
    aspectRatio: 2 / 3,
  },
  notifDot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 10,
    height: 10,
    borderRadius: 5,
    zIndex: 10,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 4,
  },
  cardFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.md,
    gap: 4,
  },
  cardTitle: {
    fontFamily: Fonts.semibold,
    fontSize: FontSize.md,
    color: Stitch.onSurface,
    lineHeight: 22,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cardMatch: {
    fontFamily: Fonts.semibold,
    fontSize: FontSize.xs,
    letterSpacing: 0.3,
  },

  // Feedback
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingHorizontal: H_PAD,
  },
  emptyTitle: {
    fontFamily: Fonts.bold,
    fontSize: FontSize.lg,
    textAlign: 'center',
  },
  feedbackText: {
    fontFamily: Fonts.regular,
    fontSize: FontSize.sm,
    textAlign: 'center',
    lineHeight: 20,
  },
});
