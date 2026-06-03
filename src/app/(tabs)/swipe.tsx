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
  interpolate,
  interpolateColor,
  runOnJS,
  useAnimatedStyle,
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
const STACK_SIZE = 3;

export default function SwipeScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [deck, setDeck] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const page = useRef(1);
  const swipedIds = useRef<Set<number>>(new Set());
  const isFetching = useRef(false);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  // Press state — merge with swipe progress for unified animation
  const isLikePressed = useSharedValue(0);
  const isNopePressed = useSharedValue(0);

  // ── Like button animation ──────────────────────────────────────────────────
  const likeButtonStyle = useAnimatedStyle(() => {
    const swipeProgress = interpolate(translateX.value, [0, SWIPE_THRESHOLD], [0, 1], 'clamp');
    const progress = Math.max(swipeProgress, isLikePressed.value);
    return {
      transform: [{ scale: interpolate(progress, [0, 1], [1, 1.18]) }],
      backgroundColor: interpolateColor(progress, [0, 1], [Cinema.surfaceElevated, Cinema.likeDim]),
      borderColor: interpolateColor(progress, [0, 1], [Cinema.border, Cinema.like]),
    };
  });

  const likeIconStyle = useAnimatedStyle(() => {
    const swipeProgress = interpolate(translateX.value, [0, SWIPE_THRESHOLD * 0.6], [0, 1], 'clamp');
    return { opacity: Math.max(swipeProgress, isLikePressed.value) };
  });

  // ── Nope button animation ──────────────────────────────────────────────────
  const nopeButtonStyle = useAnimatedStyle(() => {
    const swipeProgress = interpolate(translateX.value, [-SWIPE_THRESHOLD, 0], [1, 0], 'clamp');
    const progress = Math.max(swipeProgress, isNopePressed.value);
    return {
      transform: [{ scale: interpolate(progress, [0, 1], [1, 1.18]) }],
      backgroundColor: interpolateColor(progress, [0, 1], [Cinema.surfaceElevated, Cinema.nopeDim]),
      borderColor: interpolateColor(progress, [0, 1], [Cinema.border, Cinema.nope]),
    };
  });

  const nopeIconStyle = useAnimatedStyle(() => {
    const swipeProgress = interpolate(translateX.value, [-SWIPE_THRESHOLD * 0.6, 0], [1, 0], 'clamp');
    return { opacity: Math.max(swipeProgress, isNopePressed.value) };
  });

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
        // non-blocking
      }
      await loadMovies();
      setLoading(false);
    }
    init();
  }, [user, loadMovies]);

  useEffect(() => {
    if (!loading && deck.length <= STACK_SIZE + 1) loadMovies();
  }, [deck.length, loading, loadMovies]);

  // ── Swipe action ───────────────────────────────────────────────────────────
  const handleSwipe = useCallback(
    (action: 'like' | 'dislike') => {
      const movie = deck[0];
      if (!movie || !user) return;
      swipedIds.current.add(movie.id);
      setDeck((prev) => prev.slice(1));
      saveSwipe(user.id, movie, action).catch(() => {});
    },
    [deck, user],
  );

  // ── Pan gesture ────────────────────────────────────────────────────────────
  const gesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX;
      translateY.value = e.translationY * 0.3;
    })
    .onEnd((e) => {
      if (e.translationX > SWIPE_THRESHOLD) {
        translateX.value = withTiming(SCREEN_WIDTH * 1.5, { duration: 280 }, () => {
          translateX.value = 0;
          translateY.value = 0;
          runOnJS(handleSwipe)('like');
        });
      } else if (e.translationX < -SWIPE_THRESHOLD) {
        translateX.value = withTiming(-SCREEN_WIDTH * 1.5, { duration: 280 }, () => {
          translateX.value = 0;
          translateY.value = 0;
          runOnJS(handleSwipe)('dislike');
        });
      } else {
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
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>CineMatch</Text>
        <Ionicons name="options-outline" size={24} color={Cinema.textPrimary} />
      </View>

      {/* Card stack */}
      <View style={styles.deckContainer}>
        {deck
          .slice(0, STACK_SIZE)
          .reverse()
          .map((movie, revIdx) => {
            const idx = STACK_SIZE - 1 - revIdx;
            const isTop = idx === 0;
            return isTop ? (
              <GestureDetector key={movie.id} gesture={gesture}>
                <SwipeCard movie={movie} translateX={translateX} translateY={translateY} isTop index={0} />
              </GestureDetector>
            ) : (
              <SwipeCard key={movie.id} movie={movie} translateX={translateX} translateY={translateY} isTop={false} index={idx} />
            );
          })}
      </View>

      {/* Action buttons */}
      <View style={styles.actions}>
        {/* Nope */}
        <Pressable
          onPress={() => pressSwipe('dislike')}
          onPressIn={() => { isNopePressed.value = withTiming(1, { duration: 120 }); }}
          onPressOut={() => { isNopePressed.value = withTiming(0, { duration: 200 }); }}>
          <Animated.View style={[styles.actionBtn, styles.actionBtnLg, nopeButtonStyle]}>
            <Ionicons name="close" size={28} color={Cinema.textSecondary} />
            <Animated.View style={[StyleSheet.absoluteFill, styles.iconOverlay, nopeIconStyle]}>
              <Ionicons name="close" size={28} color={Cinema.nope} />
            </Animated.View>
          </Animated.View>
        </Pressable>

        {/* Info */}
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
          onPress={() => pressSwipe('like')}
          onPressIn={() => { isLikePressed.value = withTiming(1, { duration: 120 }); }}
          onPressOut={() => { isLikePressed.value = withTiming(0, { duration: 200 }); }}>
          <Animated.View style={[styles.actionBtn, styles.actionBtnLg, likeButtonStyle]}>
            <Ionicons name="heart" size={28} color={Cinema.textSecondary} />
            <Animated.View style={[StyleSheet.absoluteFill, styles.iconOverlay, likeIconStyle]}>
              <Ionicons name="heart" size={28} color={Cinema.like} />
            </Animated.View>
          </Animated.View>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Cinema.bg },

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

  deckContainer: {
    flex: 1,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    height: CARD_HEIGHT,
  },

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
    overflow: 'hidden',
  },
  actionBtnSm: {
    width: 48,
    height: 48,
  },
  actionBtnLg: {
    width: 68,
    height: 68,
  },
  iconOverlay: {
    alignItems: 'center',
    justifyContent: 'center',
  },

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
