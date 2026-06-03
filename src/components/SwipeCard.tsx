import { StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  interpolate,
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';
import { Cinema, FontSize, Radius, Spacing } from '@/constants/theme';
import type { Movie } from '@/types/tmdb';
import { formatRating, formatYear, posterUrl } from '@/utils/format';

const CARD_BORDER_RADIUS = 20;

// Overlays visible during drag
interface OverlayProps {
  translateX: SharedValue<number>;
}

function LikeOverlay({ translateX }: OverlayProps) {
  const style = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, 80], [0, 1], 'clamp'),
  }));
  return (
    <Animated.View style={[StyleSheet.absoluteFill, styles.overlayLike, style]}>
      <View style={styles.overlayBadge}>
        <Text style={styles.overlayLikeText}>LIKE ✓</Text>
      </View>
    </Animated.View>
  );
}

function NopeOverlay({ translateX }: OverlayProps) {
  const style = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [-80, 0], [1, 0], 'clamp'),
  }));
  return (
    <Animated.View style={[StyleSheet.absoluteFill, styles.overlayNope, style]}>
      <View style={styles.overlayBadge}>
        <Text style={styles.overlayNopeText}>NOPE ✗</Text>
      </View>
    </Animated.View>
  );
}

interface SwipeCardProps {
  movie: Movie;
  translateX: SharedValue<number>;
  translateY: SharedValue<number>;
  isTop: boolean;
  index: number; // 0 = top, 1 = second, 2 = third
}

export function SwipeCard({ movie, translateX, translateY, isTop, index }: SwipeCardProps) {
  const poster = posterUrl(movie.poster_path, 'w500');
  const year = formatYear(movie.release_date);
  const rating = formatRating(movie.vote_average);

  // Stack effect: cards behind scale down and shift down
  const stackStyle = useAnimatedStyle(() => {
    if (isTop) {
      const rotate = interpolate(translateX.value, [-200, 0, 200], [-15, 0, 15], 'clamp');
      return {
        transform: [
          { translateX: translateX.value },
          { translateY: translateY.value },
          { rotate: `${rotate}deg` },
        ],
        zIndex: 10,
      };
    }
    const scale = interpolate(
      Math.abs(translateX.value),
      [0, 150],
      [1 - index * 0.04, 1 - (index - 1) * 0.04],
      'clamp',
    );
    const ty = interpolate(
      Math.abs(translateX.value),
      [0, 150],
      [index * 10, (index - 1) * 10],
      'clamp',
    );
    return {
      transform: [{ scale }, { translateY: ty }],
      zIndex: 10 - index,
    };
  });

  return (
    <Animated.View style={[StyleSheet.absoluteFill, stackStyle]}>
      <View style={styles.card}>
        {/* Poster */}
        <Image
          source={poster ? { uri: poster } : require('@/assets/images/icon.png')}
          style={styles.poster}
          contentFit="cover"
          transition={200}
        />

        {/* Rating badge — top right (Stitch: "⭐ 8.4") */}
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingStar}>⭐</Text>
          <Text style={styles.ratingValue}>{rating}</Text>
        </View>

        {/* Gradient overlay — bottom of poster */}
        <LinearGradient
          colors={['transparent', 'rgba(13,13,13,0.7)', Cinema.bg]}
          locations={[0.4, 0.75, 1]}
          style={styles.gradient}
        />

        {/* Genre chips overlaid on gradient (Stitch: "Sci-Fi", "Thriller") */}
        {movie.genre_ids && movie.genre_ids.length > 0 && (
          <View style={styles.chips}>
            {movie.genre_ids.slice(0, 2).map((id) => (
              <View key={id} style={styles.chip}>
                <Text style={styles.chipText}>#{id}</Text>
              </View>
            ))}
          </View>
        )}

        {/* LIKE / NOPE overlays */}
        {isTop && <LikeOverlay translateX={translateX} />}
        {isTop && <NopeOverlay translateX={translateX} />}
      </View>

      {/* Info section below poster (Stitch: title, year, synopsis) */}
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{movie.title}</Text>
        <Text style={styles.meta}>{year}</Text>
        {movie.overview ? (
          <Text style={styles.overview} numberOfLines={2}>{movie.overview}</Text>
        ) : null}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: CARD_BORDER_RADIUS,
    overflow: 'hidden',
    backgroundColor: Cinema.surface,
  },
  poster: {
    ...StyleSheet.absoluteFill,
  },

  // Rating badge — top right corner (Stitch design)
  ratingBadge: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.pill,
  },
  ratingStar: { fontSize: 11 },
  ratingValue: { color: Cinema.gold, fontSize: FontSize.sm, fontWeight: '700' },

  // Gradient
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '55%',
  },

  // Genre chips at bottom of poster (Stitch style)
  chips: {
    position: 'absolute',
    bottom: Spacing.md,
    left: Spacing.md,
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  chip: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: Radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  chipText: { color: Cinema.textPrimary, fontSize: 11, fontWeight: '500' },

  // LIKE overlay (right side, green — Stitch MATCH! stamp)
  overlayLike: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingLeft: Spacing.xl,
  },
  overlayNope: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: Spacing.xl,
  },
  overlayBadge: {
    borderWidth: 3,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    transform: [{ rotate: '-15deg' }],
  },
  overlayLikeText: {
    color: Cinema.like,
    fontSize: FontSize.xl,
    fontWeight: '800',
    letterSpacing: 2,
  },
  overlayNopeText: {
    color: Cinema.nope,
    fontSize: FontSize.xl,
    fontWeight: '800',
    letterSpacing: 2,
  },

  // Info below card
  info: {
    paddingHorizontal: Spacing.sm,
    paddingTop: Spacing.md,
    gap: 4,
  },
  title: {
    color: Cinema.textPrimary,
    fontSize: FontSize['2xl'],
    fontWeight: '700',
  },
  meta: {
    color: Cinema.textSecondary,
    fontSize: FontSize.sm,
  },
  overview: {
    color: Cinema.textSecondary,
    fontSize: FontSize.sm,
    lineHeight: 18,
  },
});
