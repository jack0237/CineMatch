import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { SwipeCard } from '@/components/SwipeCard';
import { Cinema, FontSize, Radius, Spacing } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { getPopularMovies } from '@/services/tmdb';
import { getSwipedMovieIds, saveSwipe } from '@/services/swipe';
import type { Movie } from '@/types/tmdb';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.35;
const CARD_HEIGHT = Dimensions.get('window').height * 0.55;
const STACK_SIZE = 3; // visible cards in stack

export default function SwipeScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [deck, setDeck] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const page = useRef(1);
  const swipedIds = useRef<Set<number>>(new Set());
  const isFetching = useRef(false);

  // Reanimated shared values for the top card
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  // ── Load movies ────────────────────────────────────────────────────────────
  const loadMovies = useCallback(async () => {
    if (isFetching.current) return;
    isFetching.current = true;
    try {
      const { results } = await getPopularMovies(page.current);
      page.current += 1;
      const fresh = results.filter((m) => !swipedIds.current.has(m.id));
      setDeck((prev) => [...prev, ...fresh]);
    } catch {
      setError('Impossible de charger les films. Vérifie ta connexion.');
    } finally {
      isFetching.current = false;
    }
  }, []);

  useEffect(() => {
    async function init() {
      if (!user) return;
      try {
        const ids = await getSwipedMovieIds(user.id);
        swipedIds.current = new Set(ids);
      } catch {
        // non-blocking — worst case, user sees already-swiped films
      }
      await loadMovies();
      setLoading(false);
    }
    init();
  }, [user, loadMovies]);

  // Preload next page when stack is running low
  useEffect(() => {
    if (!loading && deck.length <= STACK_SIZE + 1) {
      loadMovies();
    }
  }, [deck.length, loading, loadMovies]);

  // ── Swipe action ───────────────────────────────────────────────────────────
  const handleSwipe = useCallback(
    (action: 'like' | 'dislike') => {
      const movie = deck[0];
      if (!movie || !user) return;

      swipedIds.current.add(movie.id);
      setDeck((prev) => prev.slice(1));

      saveSwipe(user.id, movie, action).catch(() => {
        // silent — do not block UX on network error
      });
    },
    [deck, user],
  );

  // ── Pan gesture (Stitch: swipe left/right with rotation) ──────────────────
  const gesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX;
      translateY.value = e.translationY * 0.3;
    })
    .onEnd((e) => {
      if (e.translationX > SWIPE_THRESHOLD) {
        // Like — fly right
        translateX.value = withTiming(SCREEN_WIDTH * 1.5, { duration: 280 }, () => {
          translateX.value = 0;
          translateY.value = 0;
          runOnJS(handleSwipe)('like');
        });
      } else if (e.translationX < -SWIPE_THRESHOLD) {
        // Dislike — fly left
        translateX.value = withTiming(-SCREEN_WIDTH * 1.5, { duration: 280 }, () => {
          translateX.value = 0;
          translateY.value = 0;
          runOnJS(handleSwipe)('dislike');
        });
      } else {
        // Snap back
        translateX.value = withSpring(0, { damping: 20, stiffness: 200 });
        translateY.value = withSpring(0, { damping: 20, stiffness: 200 });
      }
    });

  // ── Button press swipe ─────────────────────────────────────────────────────
  function pressSwipe(action: 'like' | 'dislike') {
    const direction = action === 'like' ? 1 : -1;
    translateX.value = withTiming(direction * SCREEN_WIDTH * 1.5, { duration: 280 }, () => {
      translateX.value = 0;
      translateY.value = 0;
      runOnJS(handleSwipe)(action);
    });
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color={Cinema.primary} />
        <Text style={styles.loadingText}>Chargement des films…</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.centered}>
        <Ionicons name="wifi-outline" size={48} color={Cinema.textMuted} />
        <Text style={styles.errorText}>{error}</Text>
        <Pressable onPress={() => { setError(''); loadMovies(); }} style={styles.retryBtn}>
          <Text style={styles.retryText}>Réessayer</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  if (deck.length === 0) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.emptyEmoji}>🎬</Text>
        <Text style={styles.emptyTitle}>Vous avez tout vu !</Text>
        <Text style={styles.emptySubtitle}>Revenez demain pour de nouveaux films.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header — "CineMatch" + filter icon (Stitch) */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>CineMatch</Text>
        <Ionicons name="options-outline" size={24} color={Cinema.textPrimary} />
      </View>

      {/* Card stack */}
      <View style={styles.deckContainer}>
        {/* Render up to STACK_SIZE cards, bottom first */}
        {deck
          .slice(0, STACK_SIZE)
          .reverse()
          .map((movie, revIdx) => {
            const idx = STACK_SIZE - 1 - revIdx; // 2, 1, 0 (0 = top)
            const isTop = idx === 0;
            return isTop ? (
              <GestureDetector key={movie.id} gesture={gesture}>
                <SwipeCard
                  movie={movie}
                  translateX={translateX}
                  translateY={translateY}
                  isTop
                  index={0}
                />
              </GestureDetector>
            ) : (
              <SwipeCard
                key={movie.id}
                movie={movie}
                translateX={translateX}
                translateY={translateY}
                isTop={false}
                index={idx}
              />
            );
          })}
      </View>

      {/* Action buttons (Stitch: X, ℹ️, ❤️) */}
      <View style={styles.actions}>
        {/* Nope */}
        <Pressable
          style={({ pressed }) => [styles.actionBtn, styles.actionBtnLg, pressed && styles.actionBtnNope]}
          onPress={() => pressSwipe('dislike')}>
          {({ pressed }) => (
            <Ionicons name="close" size={28} color={pressed ? Cinema.nope : Cinema.textSecondary} />
          )}
        </Pressable>

        {/* Info — navigate to detail */}
        <Pressable
          style={[styles.actionBtn, styles.actionBtnSm]}
          onPress={() => {
            const movie = deck[0];
            if (movie) router.push({ pathname: '/movie/[id]', params: { id: movie.id, title: movie.title } });
          }}>
          <Ionicons name="information-circle-outline" size={22} color={Cinema.textSecondary} />
        </Pressable>

        {/* Like */}
        <Pressable
          style={({ pressed }) => [styles.actionBtn, styles.actionBtnLg, pressed && styles.actionBtnLike]}
          onPress={() => pressSwipe('like')}>
          {({ pressed }) => (
            <Ionicons name="heart" size={28} color={pressed ? Cinema.like : Cinema.textSecondary} />
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Cinema.bg },

  // Header (Stitch: "CineMatch" + filter icon)
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  headerTitle: {
    color: Cinema.primary,
    fontSize: FontSize.xl,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  // Card deck
  deckContainer: {
    flex: 1,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    height: CARD_HEIGHT,
  },

  // Action buttons (Stitch: X center ❤️)
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.xl,
    paddingVertical: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  actionBtn: {
    width: 60,
    height: 60,
    borderRadius: Radius.pill,
    backgroundColor: Cinema.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Cinema.border,
  },
  actionBtnSm: {
    width: 48,
    height: 48,
  },
  actionBtnLg: {
    width: 68,
    height: 68,
  },
  actionBtnNope: {
    backgroundColor: Cinema.nopeDim,
    borderColor: Cinema.nope,
  },
  actionBtnLike: {
    backgroundColor: Cinema.likeDim,
    borderColor: Cinema.like,
  },

  // States
  centered: {
    flex: 1,
    backgroundColor: Cinema.bg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing['2xl'],
  },
  loadingText: { color: Cinema.textSecondary, fontSize: FontSize.sm },
  errorText: { color: Cinema.textSecondary, fontSize: FontSize.base, textAlign: 'center' },
  retryBtn: {
    marginTop: Spacing.sm,
    backgroundColor: Cinema.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: Radius.pill,
  },
  retryText: { color: '#FFFFFF', fontWeight: '600' },
  emptyEmoji: { fontSize: 56 },
  emptyTitle: { color: Cinema.textPrimary, fontSize: FontSize['2xl'], fontWeight: '700' },
  emptySubtitle: { color: Cinema.textSecondary, fontSize: FontSize.base, textAlign: 'center' },
});
