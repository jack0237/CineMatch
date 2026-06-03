import { StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
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

const GENRE_NAMES: Record<number, string> = {
  28: 'Action', 12: 'Aventure', 16: 'Animation', 35: 'Comédie',
  80: 'Crime', 99: 'Documentaire', 18: 'Drame', 10751: 'Famille',
  14: 'Fantastique', 36: 'Histoire', 27: 'Horreur', 10402: 'Musique',
  9648: 'Mystère', 10749: 'Romance', 878: 'Science-Fiction',
  10770: 'Téléfilm', 53: 'Thriller', 10752: 'Guerre', 37: 'Western',
};

interface OverlayProps {
  translateX: SharedValue<number>;
}

function LikeOverlay({ translateX }: OverlayProps) {
  const style = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, 80], [0, 1], 'clamp'),
  }));
  return (
    <Animated.View style={[StyleSheet.absoluteFill, styles.overlayLike, style]}>
      <View style={styles.overlayBadgeLike}>
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
      <View style={styles.overlayBadgeNope}>
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
  index: number;
}

export function SwipeCard({ movie, translateX, translateY, isTop, index }: SwipeCardProps) {
  const poster = posterUrl(movie.poster_path, 'w500');
  const year = formatYear(movie.release_date);
  const rating = formatRating(movie.vote_average);

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

  const genreNames = (movie.genre_ids ?? [])
    .slice(0, 2)
    .map((id) => GENRE_NAMES[id])
    .filter(Boolean) as string[];

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

        {/* Rating badge — top right (green star per Stitch) */}
        <View style={styles.ratingBadge}>
          <Ionicons name="star" size={11} color={Cinema.like} />
          <Text style={styles.ratingValue}>{rating}</Text>
        </View>

        {/* Gradient overlay */}
        <LinearGradient
          colors={['transparent', 'rgba(13,13,13,0.7)', Cinema.bg]}
          locations={[0.4, 0.75, 1]}
          style={styles.gradient}
        />

        {/* Genre chips — real names, only for top card */}
        {isTop && genreNames.length > 0 && (
          <View style={styles.chips}>
            {genreNames.map((name) => (
              <View key={name} style={styles.chip}>
                <Text style={styles.chipText}>{name}</Text>
              </View>
            ))}
          </View>
        )}

        {/* LIKE / NOPE overlays */}
        {isTop && <LikeOverlay translateX={translateX} />}
        {isTop && <NopeOverlay translateX={translateX} />}
      </View>

      {/* Info below poster — only top card to avoid cluttering the stack */}
      {isTop && (
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>{movie.title}</Text>
          <Text style={styles.meta}>{year}</Text>
          {movie.overview ? (
            <Text style={styles.overview} numberOfLines={2}>{movie.overview}</Text>
          ) : null}
        </View>
      )}
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

  // Rating badge — Stitch: green star + white bold text + dark bg + subtle green border
  ratingBadge: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 5,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(78,222,163,0.45)',
  },
  ratingValue: {
    color: '#FFFFFF',
    fontSize: FontSize.sm,
    fontWeight: '700',
  },

  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '55%',
  },

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
  overlayBadgeLike: {
    borderWidth: 3,
    borderColor: Cinema.like,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    transform: [{ rotate: '-15deg' }],
  },
  overlayBadgeNope: {
    borderWidth: 3,
    borderColor: Cinema.nope,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    transform: [{ rotate: '15deg' }],
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
