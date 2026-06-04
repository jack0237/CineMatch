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
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useDebounce } from 'use-debounce';
import { FontSize, Fonts, Radius, Spacing, Stitch } from '@/constants/theme';
import { useColors } from '@/hooks/use-theme';
import { discoverMovies, searchMovies } from '@/services/tmdb';
import type { Movie } from '@/types/tmdb';
import { SearchBar } from '@/components/SearchBar';
import { SearchResultCard } from '@/components/SearchResultCard';
import {
  FilterSheet,
  ERA_DATE_RANGES,
  INITIAL_FILTER,
  type FilterState,
} from '@/components/FilterSheet';

const H_PAD = 20;

// ── SearchScreen ──────────────────────────────────────────────────────────────

export default function SearchScreen() {
  const C = useColors();
  const router = useRouter();

  // Search
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebounce(query, 400);
  const [results, setResults] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter state
  const [filterVisible, setFilterVisible]   = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<FilterState>(INITIAL_FILTER);

  // Derived
  const isPending = query.trim().length > 0 && query !== debouncedQuery;
  const isSearchMode = query.trim().length > 0;
  const hasActiveFilters =
    appliedFilters.genres.length > 0 ||
    appliedFilters.minScore > 0 ||
    appliedFilters.era !== null;
  const showLoader = isPending || isLoading;
  const showEmpty =
    !showLoader &&
    results.length === 0 &&
    isSearchMode &&
    debouncedQuery.trim().length > 0;

  // Fetch: discovery (no query) or search (with query)
  useEffect(() => {
    const q = debouncedQuery.trim();
    setIsLoading(true);
    const eraRange = appliedFilters.era ? ERA_DATE_RANGES[appliedFilters.era] : {};

    const doFetch = q
      ? searchMovies(q).then(res => {
          let data = res.results;
          if (appliedFilters.genres.length > 0) {
            data = data.filter(m =>
              m.genre_ids.some(id => appliedFilters.genres.includes(id)),
            );
          }
          if (appliedFilters.minScore > 0) {
            data = data.filter(m => m.vote_average >= appliedFilters.minScore);
          }
          return data;
        })
      : discoverMovies({
          ...(appliedFilters.genres.length > 0
            ? { with_genres: appliedFilters.genres.join(',') }
            : {}),
          ...(appliedFilters.minScore > 0
            ? { 'vote_average.gte': String(appliedFilters.minScore) }
            : {}),
          ...eraRange,
        }).then(res => res.results);

    doFetch
      .then(setResults)
      .catch(() => setResults([]))
      .finally(() => setIsLoading(false));
  }, [debouncedQuery, appliedFilters]);

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: C.bg }]} edges={['top']}>

      {/* ── Header ───────────────────────────────────────────────────────────── */}
      <View style={[styles.header, { borderBottomColor: C.border }]}>
        <Text style={[styles.headerTitle, { color: C.primary }]}>CineMatch</Text>
        <Pressable onPress={() => setFilterVisible(true)} hitSlop={8} style={styles.filterBtn}>
          <Ionicons name="options-outline" size={22} color={C.primary} />
          {hasActiveFilters && (
            <View style={[styles.filterDot, { backgroundColor: Stitch.secondary }]} />
          )}
        </Pressable>
      </View>

      {/* ── Search bar ───────────────────────────────────────────────────────── */}
      <View style={styles.searchWrap}>
        <SearchBar
          value={query}
          onChangeText={setQuery}
          placeholder="Search films, directors, moods..."
          isLoading={isPending}
        />
      </View>

      {/* ── Results area ─────────────────────────────────────────────────────── */}
      {showLoader ? (
        <View style={styles.center}>
          <ActivityIndicator color={C.primary} size="large" />
        </View>
      ) : showEmpty ? (
        <View style={styles.center}>
          <Ionicons name="film-outline" size={44} color={C.textDisabled} />
          <Text style={[styles.emptyTitle, { color: C.textPrimary }]}>
            Aucun film trouvé
          </Text>
          <Text style={[styles.emptyText, { color: C.textMuted }]}>
            pour &ldquo;{debouncedQuery}&rdquo;
          </Text>
        </View>
      ) : (
        <FlatList<Movie>
          data={results}
          keyExtractor={item => String(item.id)}
          renderItem={({ item }) => (
            <SearchResultCard
              movie={item}
              onPress={() => router.push(`/movie/${item.id}`)}
            />
          )}
          ItemSeparatorComponent={() => (
            <View style={[styles.separator, { backgroundColor: C.border }]} />
          )}
          ListHeaderComponent={
            !isSearchMode ? (
              <Text style={[styles.sectionLabel, { color: `${Stitch.onSurfaceVariant}99` }]}>
                {hasActiveFilters ? 'RÉSULTATS FILTRÉS' : 'POPULAIRES EN CE MOMENT'}
              </Text>
            ) : null
          }
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        />
      )}

      {/* ── Filter bottom sheet ───────────────────────────────────────────────── */}
      <FilterSheet
        visible={filterVisible}
        initialState={appliedFilters}
        onClose={() => setFilterVisible(false)}
        onApply={setAppliedFilters}
      />
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1 },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: H_PAD,
    height: 56,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerTitle: {
    fontFamily: Fonts.bold,
    fontSize: FontSize['2xl'],
    letterSpacing: -0.5,
  },
  filterBtn: { position: 'relative', padding: 4 },
  filterDot: {
    position: 'absolute',
    top: 4,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  // Search
  searchWrap: {
    paddingHorizontal: H_PAD,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
  },

  // List
  list: { flex: 1 },
  listContent: {
    paddingHorizontal: H_PAD,
    paddingBottom: 100,
    gap: Spacing.md,
  },
  sectionLabel: {
    fontFamily: Fonts.semibold,
    fontSize: FontSize.xs,
    letterSpacing: 2.5,
    marginBottom: Spacing.sm,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 2,
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
  emptyText: {
    fontFamily: Fonts.regular,
    fontSize: FontSize.sm,
    textAlign: 'center',
  },

});
