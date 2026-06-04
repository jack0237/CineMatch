import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Fonts, FontSize, Radius, Spacing, Stitch } from '@/constants/theme';
import { useColors } from '@/hooks/use-theme';
import type { Movie } from '@/types/tmdb';
import { posterUrl } from '@/utils/format';

// Shared genre map (mirrors SwipeCard + movie detail)
export const GENRE_NAMES: Record<number, string> = {
  28: 'Action', 12: 'Aventure', 16: 'Animation', 35: 'Comédie',
  80: 'Crime', 99: 'Documentaire', 18: 'Drame', 10751: 'Famille',
  14: 'Fantastique', 36: 'Histoire', 27: 'Horreur', 10402: 'Musique',
  9648: 'Mystère', 10749: 'Romance', 878: 'Sci-Fi',
  10770: 'Téléfilm', 53: 'Thriller', 10752: 'Guerre', 37: 'Western',
};

function formatVoteCount(n: number): string {
  if (n >= 1000) return `(${(n / 1000).toFixed(1)}k)`;
  return `(${n})`;
}

interface SearchResultCardProps {
  movie: Movie;
  onPress: () => void;
}

export function SearchResultCard({ movie, onPress }: SearchResultCardProps) {
  const C = useColors();
  const uri = posterUrl(movie.poster_path, 'w342') ?? undefined;
  const genres = movie.genre_ids
    .slice(0, 2)
    .map(id => GENRE_NAMES[id])
    .filter(Boolean) as string[];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: C.surface, borderColor: C.border },
        pressed && { backgroundColor: C.surfaceElevated, borderColor: C.borderLight },
      ]}
    >
      {/* Poster */}
      <View style={[styles.posterWrap, { backgroundColor: C.chip }]}>
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

      {/* Metadata */}
      <View style={styles.meta}>
        <Text style={[styles.title, { color: C.textPrimary }]} numberOfLines={1}>
          {movie.title}
        </Text>

        {genres.length > 0 && (
          <View style={styles.genreRow}>
            {genres.map(name => (
              <View key={name} style={[styles.genreChip, { backgroundColor: C.chip, borderColor: C.border }]}>
                <Text style={[styles.genreLabel, { color: C.textSecondary }]}>{name}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.ratingRow}>
          <Ionicons name="star" size={16} color={C.like} />
          <Text style={[styles.ratingValue, { color: C.textPrimary }]}>{movie.vote_average.toFixed(1)}</Text>
          {movie.vote_count > 0 && (
            <Text style={[styles.voteCount, { color: C.textMuted }]}>
              {formatVoteCount(movie.vote_count)}
            </Text>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: Spacing.lg,
    borderWidth: 1,
    borderRadius: Radius.lg + 4,
    padding: Spacing.sm,
  },
  cardPressed: {},

  // Poster
  posterWrap: {
    width: 96,
    height: 144,
    flexShrink: 0,
    borderRadius: Radius.lg,
    overflow: 'hidden',
  },

  // Metadata
  meta: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    paddingRight: Spacing.sm,
    gap: Spacing.sm,
  },
  title: {
    fontFamily: Fonts.semibold,
    fontSize: FontSize.xl,
    color: Stitch.onSurface,
    lineHeight: 28,
  },
  genreRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  genreChip: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.pill,
  },
  genreLabel: {
    fontFamily: Fonts.light,
    fontSize: 12,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 'auto',
  },
  ratingValue: {
    fontFamily: Fonts.semibold,
    fontSize: FontSize.sm,
  },
  voteCount: {
    fontFamily: Fonts.light,
    fontSize: 12,
    letterSpacing: 0.5,
  },
});
