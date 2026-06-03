import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Fonts, FontSize, Radius, Spacing, Stitch } from '@/constants/theme';
import { useColors } from '@/hooks/use-theme';
import type { Movie } from '@/types/tmdb';
import { formatYear, posterUrl } from '@/utils/format';

interface MovieListItemProps {
  movie: Movie;
  onPress: () => void;
}

export function MovieListItem({ movie, onPress }: MovieListItemProps) {
  const C = useColors();
  const uri = posterUrl(movie.poster_path, 'w342') ?? undefined;
  const year = movie.release_date ? formatYear(movie.release_date) : '—';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        { opacity: pressed ? 0.75 : 1 },
      ]}
    >
      {/* Poster */}
      <Image
        source={uri}
        style={[styles.poster, { backgroundColor: C.surfaceElevated }]}
        contentFit="cover"
        transition={200}
      />

      {/* Info */}
      <View style={styles.info}>
        <Text style={[styles.title, { color: C.textPrimary }]} numberOfLines={2}>
          {movie.title}
        </Text>
        <View style={styles.meta}>
          <Text style={[styles.year, { color: C.textMuted }]}>{year}</Text>
          {movie.vote_average > 0 && (
            <>
              <Text style={[styles.dot, { color: C.textDisabled }]}>·</Text>
              <Ionicons name="star" size={12} color={Stitch.secondary} />
              <Text style={[styles.rating, { color: Stitch.secondary }]}>
                {movie.vote_average.toFixed(1)}
              </Text>
            </>
          )}
        </View>
        {movie.overview ? (
          <Text style={[styles.overview, { color: C.textSecondary }]} numberOfLines={2}>
            {movie.overview}
          </Text>
        ) : null}
      </View>

      <Ionicons name="chevron-forward" size={16} color={C.textDisabled} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  poster: {
    width: 52,
    height: 78,
    borderRadius: Radius.md,
  },
  info: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontFamily: Fonts.semibold,
    fontSize: FontSize.base,
    lineHeight: 22,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  year: {
    fontFamily: Fonts.regular,
    fontSize: FontSize.sm,
  },
  dot: {
    fontFamily: Fonts.regular,
    fontSize: FontSize.sm,
  },
  rating: {
    fontFamily: Fonts.semibold,
    fontSize: FontSize.sm,
  },
  overview: {
    fontFamily: Fonts.regular,
    fontSize: FontSize.sm,
    lineHeight: 18,
  },
});
