import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  PanResponder,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useDebounce } from 'use-debounce';
import { FontSize, Fonts, Radius, Spacing, Stitch } from '@/constants/theme';
import { useColors } from '@/hooks/use-theme';
import { discoverMovies, searchMovies } from '@/services/tmdb';
import type { Movie } from '@/types/tmdb';
import { SearchBar } from '@/components/SearchBar';
import { SearchResultCard, GENRE_NAMES } from '@/components/SearchResultCard';

// ── Constants ─────────────────────────────────────────────────────────────────

const H_PAD = 20;
const SHEET_HEIGHT = 520;
const THUMB = 24;
const MAX_RATING = 9;

const FILTER_GENRES = [
  { id: 28,    name: 'Action' },
  { id: 878,   name: 'Sci-Fi' },
  { id: 53,    name: 'Thriller' },
  { id: 18,    name: 'Drame' },
  { id: 35,    name: 'Comédie' },
  { id: 27,    name: 'Horreur' },
  { id: 10749, name: 'Romance' },
  { id: 12,    name: 'Aventure' },
  { id: 16,    name: 'Animation' },
  { id: 9648,  name: 'Mystère' },
];

// ── RatingSlider ──────────────────────────────────────────────────────────────

interface RatingSliderProps {
  value: number;
  onChange: (v: number) => void;
}

function RatingSlider({ value, onChange }: RatingSliderProps) {
  const C = useColors();
  const trackWidthRef = useRef(0);
  const [displayWidth, setDisplayWidth] = useState(0);
  const pct = value / MAX_RATING;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (e) => snap(e.nativeEvent.locationX),
      onPanResponderMove: (e) => snap(e.nativeEvent.locationX),
    }),
  ).current;

  function snap(x: number) {
    const p = Math.max(0, Math.min(1, x / trackWidthRef.current));
    // 0.5 steps
    onChange(Math.round(p * MAX_RATING * 2) / 2);
  }

  return (
    <View style={styles.sliderWrap}>
      <View
        onLayout={e => {
          trackWidthRef.current = e.nativeEvent.layout.width;
          setDisplayWidth(e.nativeEvent.layout.width);
        }}
        style={[styles.sliderTrack, { backgroundColor: C.surfaceElevated }]}
        {...panResponder.panHandlers}
      >
        {/* Filled track */}
        <View
          style={[
            styles.sliderFill,
            {
              width: `${pct * 100}%`,
              backgroundColor: Stitch.secondary,
              shadowColor: Stitch.secondary,
            },
          ]}
        />
        {/* Thumb */}
        {displayWidth > 0 && (
          <View
            style={[
              styles.sliderThumb,
              {
                left: pct * displayWidth - THUMB / 2,
                backgroundColor: Stitch.secondary,
                borderColor: Stitch.background,
                shadowColor: Stitch.secondary,
              },
            ]}
          />
        )}
      </View>
    </View>
  );
}

// ── FilterSheet (inside a Modal) ──────────────────────────────────────────────

interface FilterSheetProps {
  visible: boolean;
  onClose: () => void;
  pendingGenres: number[];
  onToggleGenre: (id: number) => void;
  pendingRating: number;
  onRatingChange: (v: number) => void;
  onApply: () => void;
  onReset: () => void;
}

function FilterSheet({
  visible,
  onClose,
  pendingGenres,
  onToggleGenre,
  pendingRating,
  onRatingChange,
  onApply,
  onReset,
}: FilterSheetProps) {
  const C = useColors();
  const insets = useSafeAreaInsets();
  const sheetAnim = useSharedValue(SHEET_HEIGHT);
  const backdropAnim = useSharedValue(0);

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: sheetAnim.value }],
  }));
  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropAnim.value,
  }));

  useEffect(() => {
    if (visible) {
      sheetAnim.value = withSpring(0, { damping: 22, stiffness: 200 });
      backdropAnim.value = withTiming(1, { duration: 250 });
    }
  }, [visible]);

  function handleClose() {
    backdropAnim.value = withTiming(0, { duration: 200 });
    sheetAnim.value = withSpring(
      SHEET_HEIGHT,
      { damping: 22, stiffness: 200 },
      (finished) => {
        if (finished) runOnJS(onClose)();
      },
    );
  }

  function handleApply() {
    onApply();
    handleClose();
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      {/* Backdrop */}
      <Animated.View style={[StyleSheet.absoluteFill, styles.backdrop, backdropStyle]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />
      </Animated.View>

      {/* Sheet */}
      <Animated.View
        style={[
          styles.sheet,
          { paddingBottom: insets.bottom + Spacing.lg, backgroundColor: C.surfaceElevated },
          sheetStyle,
        ]}
      >
        {/* Drag handle */}
        <View style={[styles.dragHandle, { backgroundColor: 'rgba(255,255,255,0.2)' }]} />

        {/* Header */}
        <View style={styles.sheetHeader}>
          <Text style={[styles.sheetTitle, { color: C.textPrimary }]}>Filtres</Text>
          <Pressable onPress={onReset} hitSlop={8}>
            <Text style={[styles.resetLabel, { color: C.primary }]}>Réinitialiser</Text>
          </Pressable>
        </View>

        {/* Genres */}
        <View style={styles.sheetSection}>
          <Text style={[styles.sheetSectionLabel, { color: `${Stitch.onSurfaceVariant}99` }]}>
            GENRES
          </Text>
          <View style={styles.genreGrid}>
            {FILTER_GENRES.map(g => {
              const active = pendingGenres.includes(g.id);
              return (
                <Pressable
                  key={g.id}
                  onPress={() => onToggleGenre(g.id)}
                  style={[
                    styles.genreToggle,
                    {
                      backgroundColor: active ? C.primary : 'rgba(255,255,255,0.05)',
                      borderColor: active ? C.primary : 'rgba(255,255,255,0.15)',
                      shadowColor: active ? C.primary : 'transparent',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.genreToggleLabel,
                      { color: active ? Stitch.onPrimary : C.textPrimary },
                    ]}
                  >
                    {g.name}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Rating */}
        <View style={styles.sheetSection}>
          <View style={styles.ratingHeader}>
            <Text style={[styles.sheetSectionLabel, { color: `${Stitch.onSurfaceVariant}99` }]}>
              NOTE MINIMUM
            </Text>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={14} color={Stitch.secondary} />
              <Text style={[styles.ratingBadgeLabel, { color: Stitch.secondary }]}>
                {pendingRating > 0 ? `${pendingRating}+` : 'Tout'}
              </Text>
            </View>
          </View>
          <RatingSlider value={pendingRating} onChange={onRatingChange} />
        </View>

        {/* Apply */}
        <Pressable
          onPress={handleApply}
          style={({ pressed }) => [
            styles.applyBtn,
            {
              backgroundColor: pressed
                ? C.surfaceElevated
                : C.surfaceHighest,
              borderColor: 'rgba(255,255,255,0.1)',
            },
          ]}
        >
          <Text style={[styles.applyLabel, { color: C.textPrimary }]}>
            Appliquer les filtres
          </Text>
        </Pressable>
      </Animated.View>
    </Modal>
  );
}

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
  const [filterVisible, setFilterVisible] = useState(false);
  const [pendingGenres, setPendingGenres] = useState<number[]>([]);
  const [pendingRating, setPendingRating] = useState(0);
  const [appliedGenres, setAppliedGenres] = useState<number[]>([]);
  const [appliedRating, setAppliedRating] = useState(0);

  // Derived
  const isPending = query.trim().length > 0 && query !== debouncedQuery;
  const isSearchMode = query.trim().length > 0;
  const hasActiveFilters = appliedGenres.length > 0 || appliedRating > 0;
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

    const doFetch = q
      ? searchMovies(q).then(res => {
          let data = res.results;
          if (appliedGenres.length > 0) {
            data = data.filter(m =>
              m.genre_ids.some(id => appliedGenres.includes(id)),
            );
          }
          if (appliedRating > 0) {
            data = data.filter(m => m.vote_average >= appliedRating);
          }
          return data;
        })
      : discoverMovies({
          ...(appliedGenres.length > 0
            ? { with_genres: appliedGenres.join(',') }
            : {}),
          ...(appliedRating > 0
            ? { 'vote_average.gte': String(appliedRating) }
            : {}),
        }).then(res => res.results);

    doFetch
      .then(setResults)
      .catch(() => setResults([]))
      .finally(() => setIsLoading(false));
  }, [debouncedQuery, appliedGenres, appliedRating]);

  function toggleGenre(id: number) {
    setPendingGenres(prev =>
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id],
    );
  }

  function applyFilters() {
    setAppliedGenres(pendingGenres);
    setAppliedRating(pendingRating);
  }

  function resetFilters() {
    setPendingGenres([]);
    setPendingRating(0);
  }

  function openFilter() {
    // Sync pending with currently applied
    setPendingGenres(appliedGenres);
    setPendingRating(appliedRating);
    setFilterVisible(true);
  }

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: C.bg }]} edges={['top']}>

      {/* ── Header ───────────────────────────────────────────────────────────── */}
      <View style={[styles.header, { borderBottomColor: 'rgba(255,255,255,0.08)' }]}>
        <Text style={[styles.headerTitle, { color: C.primary }]}>CineMatch</Text>
        <Pressable onPress={openFilter} hitSlop={8} style={styles.filterBtn}>
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
        onClose={() => setFilterVisible(false)}
        pendingGenres={pendingGenres}
        onToggleGenre={toggleGenre}
        pendingRating={pendingRating}
        onRatingChange={setPendingRating}
        onApply={applyFilters}
        onReset={resetFilters}
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

  // Filter backdrop
  backdrop: {
    backgroundColor: 'rgba(0,0,0,0.6)',
  },

  // Filter sheet
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: H_PAD + 4,
    paddingTop: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -24 },
    shadowOpacity: 0.6,
    shadowRadius: 32,
    elevation: 24,
  },
  dragHandle: {
    width: 48,
    height: 6,
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: Spacing.xl,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  sheetTitle: {
    fontFamily: Fonts.bold,
    fontSize: FontSize['2xl'],
  },
  resetLabel: {
    fontFamily: Fonts.semibold,
    fontSize: FontSize.sm,
    letterSpacing: 0.3,
  },
  sheetSection: { marginBottom: Spacing.xl },
  sheetSectionLabel: {
    fontFamily: Fonts.semibold,
    fontSize: FontSize.xs,
    letterSpacing: 2.5,
    marginBottom: Spacing.md,
  },

  // Genre toggles
  genreGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  genreToggle: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: 10,
    borderRadius: Radius.pill,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 2,
  },
  genreToggleLabel: {
    fontFamily: Fonts.semibold,
    fontSize: FontSize.sm,
    letterSpacing: 0.3,
  },

  // Rating header
  ratingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingBadgeLabel: {
    fontFamily: Fonts.semibold,
    fontSize: FontSize.sm,
  },

  // Slider
  sliderWrap: { marginTop: Spacing.sm },
  sliderTrack: {
    height: 8,
    borderRadius: 4,
    overflow: 'visible',
    position: 'relative',
  },
  sliderFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 4,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
  sliderThumb: {
    position: 'absolute',
    top: -(THUMB / 2) + 4,
    width: THUMB,
    height: THUMB,
    borderRadius: THUMB / 2,
    borderWidth: 4,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },

  // Apply button
  applyBtn: {
    borderWidth: 1,
    borderRadius: Radius.lg,
    paddingVertical: 16,
    alignItems: 'center',
  },
  applyLabel: {
    fontFamily: Fonts.semibold,
    fontSize: FontSize.sm,
    letterSpacing: 0.5,
  },
});
