import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { FontSize, Fonts, Radius, Spacing, Stitch } from '@/constants/theme';
import { useColors } from '@/hooks/use-theme';
import { getMovieCredits, getMovieDetails, getMovieVideos } from '@/services/tmdb';
import type { CastMember, Movie, Video } from '@/types/tmdb';
import { backdropUrl, formatRuntime, posterUrl, profileUrl } from '@/utils/format';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const HERO_HEIGHT = Math.round(SCREEN_HEIGHT * 0.74);
const AVATAR_OUTER = 80;
const AVATAR_INNER = AVATAR_OUTER - 12; // 2px border + 4px padding each side

export default function MovieDetailScreen() {
  const C = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const movieId = Number(id);

  const [movie, setMovie] = useState<Movie | null>(null);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [trailer, setTrailer] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getMovieDetails(movieId),
      getMovieCredits(movieId),
      getMovieVideos(movieId),
    ])
      .then(([movieData, creditsData, videosData]) => {
        setMovie(movieData);
        setCast(creditsData.cast.slice(0, 5));
        const yt = videosData.results.find(
          v => v.site === 'YouTube' && v.type === 'Trailer',
        );
        setTrailer(yt ?? null);
      })
      .catch(() => setError('Impossible de charger les détails.'))
      .finally(() => setLoading(false));
  }, [movieId]);

  if (loading) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={[styles.center, { backgroundColor: C.bg }]}>
          <ActivityIndicator color={C.primary} size="large" />
        </View>
      </>
    );
  }

  if (error || !movie) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={[styles.center, { backgroundColor: C.bg }]}>
          <Text style={[styles.feedbackText, { color: C.textMuted }]}>
            {error || 'Film introuvable.'}
          </Text>
          <Pressable onPress={() => router.back()}>
            <Text style={[styles.retryLabel, { color: C.primary }]}>Retour</Text>
          </Pressable>
        </View>
      </>
    );
  }

  const heroUri =
    backdropUrl(movie.backdrop_path) ?? posterUrl(movie.poster_path, 'w780') ?? undefined;
  const genres = movie.genres ?? [];
  const headerHeight = 56 + insets.top;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.root, { backgroundColor: C.bg }]}>

        {/* ── Scrollable body ───────────────────────────────────── */}
        <ScrollView
          style={styles.scroll}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 + insets.bottom }}
        >
          {/* Hero */}
          <View style={[styles.hero, { height: HERO_HEIGHT }]}>
            <Image
              source={heroUri}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
              transition={300}
            />
            {/* top darkening so header icons stay readable */}
            <LinearGradient
              colors={['rgba(0,0,0,0.35)', 'transparent']}
              locations={[0, 0.4]}
              style={StyleSheet.absoluteFill}
            />
            {/* bottom fade into background */}
            <LinearGradient
              colors={['transparent', C.bg]}
              locations={[0.52, 1]}
              style={StyleSheet.absoluteFill}
            />

            {/* Title block */}
            <View style={styles.heroBottom}>
              <Text style={styles.displayTitle} numberOfLines={3}>
                {movie.title.toUpperCase()}
              </Text>
              <View style={styles.metaRow}>
                {genres.slice(0, 2).map(g => (
                  <View key={g.id} style={styles.genreChip}>
                    <Text style={styles.genreLabel}>{g.name}</Text>
                  </View>
                ))}
                {genres.length > 0 && !!movie.runtime && (
                  <View style={styles.metaDot} />
                )}
                {!!movie.runtime && (
                  <Text style={[styles.runtimeText, { color: Stitch.primaryFixedDim }]}>
                    {formatRuntime(movie.runtime)}
                  </Text>
                )}
              </View>
            </View>
          </View>

          {/* Content */}
          <View style={styles.body}>
            {/* Synopsis */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>SYNOPSIS</Text>
              <Text style={[styles.synopsis, { color: Stitch.onSurface }]}>
                {movie.overview || 'Aucun synopsis disponible.'}
              </Text>
            </View>

            {/* Cast */}
            {cast.length > 0 && (
              <View style={styles.section}>
                <View style={styles.castHeader}>
                  <Text style={styles.sectionLabel}>CAST</Text>
                  <Text style={[styles.seeAll, { color: C.primary }]}>Voir tout</Text>
                </View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.castRow}
                >
                  {cast.map((member, idx) => {
                    const avatarUri = profileUrl(member.profile_path) ?? undefined;
                    return (
                      <View key={member.id} style={styles.castItem}>
                        <View
                          style={[
                            styles.avatarRing,
                            {
                              borderColor: idx === 0
                                ? `${C.primary}40`
                                : 'rgba(255,255,255,0.12)',
                            },
                          ]}
                        >
                          <Image
                            source={avatarUri}
                            style={styles.avatarImg}
                            contentFit="cover"
                            transition={200}
                          />
                        </View>
                        <Text
                          style={[styles.castName, { color: Stitch.onSurface }]}
                          numberOfLines={2}
                        >
                          {member.name}
                        </Text>
                      </View>
                    );
                  })}
                </ScrollView>
              </View>
            )}
          </View>
        </ScrollView>

        {/* ── Floating header ──────────────────────────────────── */}
        <View
          style={[
            styles.header,
            { paddingTop: insets.top, height: headerHeight },
          ]}
        >
          <Pressable
            onPress={() => router.back()}
            hitSlop={10}
            style={styles.headerBtn}
          >
            <Ionicons name="chevron-back" size={26} color={C.primary} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: C.primary }]}>CineMatch</Text>
          {/* symmetry placeholder — no action for now */}
          <View style={styles.headerBtn}>
            <Ionicons name="options-outline" size={22} color={C.primary} />
          </View>
        </View>

        {/* ── Watch Trailer FAB ─────────────────────────────────── */}
        {trailer && (
          <View style={[styles.fabWrap, { bottom: 28 + insets.bottom }]}>
            <Pressable
              onPress={() =>
                Linking.openURL(`https://www.youtube.com/watch?v=${trailer.key}`)
              }
              style={({ pressed }) => [
                styles.fab,
                { backgroundColor: C.primary, opacity: pressed ? 0.85 : 1 },
              ]}
            >
              <Ionicons name="play" size={18} color={Stitch.onPrimary} />
              <Text style={[styles.fabLabel, { color: Stitch.onPrimary }]}>
                Watch Trailer
              </Text>
            </Pressable>
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { flex: 1 },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  feedbackText: {
    fontFamily: Fonts.regular,
    fontSize: FontSize.base,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  retryLabel: { fontFamily: Fonts.semibold, fontSize: FontSize.base },

  // ── Hero ─────────────────────────────────────────────────────
  hero: { width: '100%', justifyContent: 'flex-end' },
  heroBottom: {
    paddingHorizontal: 20,
    paddingBottom: Spacing.xl,
    gap: Spacing.md,
  },
  displayTitle: {
    fontFamily: Fonts.extrabold,
    fontSize: FontSize.display,
    lineHeight: 52,
    color: '#FFFFFF',
    letterSpacing: -1,
    textShadowColor: 'rgba(0,0,0,0.55)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 14,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  genreChip: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: Spacing.lg,
    paddingVertical: 5,
    borderRadius: Radius.pill,
  },
  genreLabel: {
    fontFamily: Fonts.light,
    fontSize: 12,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: Stitch.onSurfaceVariant,
  },
  metaDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: `${Stitch.primary}55`,
    marginHorizontal: 2,
  },
  runtimeText: {
    fontFamily: Fonts.semibold,
    fontSize: FontSize.sm,
    letterSpacing: 0.4,
  },

  // ── Header ───────────────────────────────────────────────────
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: 'rgba(19,19,19,0.08)',
  },
  headerBtn: { width: 36, alignItems: 'center' },
  headerTitle: {
    fontFamily: Fonts.bold,
    fontSize: FontSize['2xl'],
    letterSpacing: -0.5,
  },

  // ── Body ─────────────────────────────────────────────────────
  body: {
    paddingHorizontal: 20,
    gap: Spacing.xl + Spacing.md,
  },
  section: { gap: Spacing.lg },
  sectionLabel: {
    fontFamily: Fonts.semibold,
    fontSize: FontSize.sm,
    letterSpacing: 2.5,
    color: `${Stitch.onSurfaceVariant}88`,
  },
  synopsis: {
    fontFamily: Fonts.regular,
    fontSize: FontSize.base,
    lineHeight: 26,
  },

  // Cast
  castHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  seeAll: {
    fontFamily: Fonts.light,
    fontSize: 12,
    letterSpacing: 0.5,
  },
  castRow: {
    gap: Spacing.lg,
    paddingBottom: Spacing.sm,
    paddingHorizontal: 2,
  },
  castItem: {
    width: AVATAR_OUTER,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  avatarRing: {
    width: AVATAR_OUTER,
    height: AVATAR_OUTER,
    borderRadius: AVATAR_OUTER / 2,
    borderWidth: 2,
    padding: 4,
    overflow: 'hidden',
  },
  avatarImg: {
    width: AVATAR_INNER,
    height: AVATAR_INNER,
    borderRadius: AVATAR_INNER / 2,
  },
  castName: {
    fontFamily: Fonts.light,
    fontSize: 11,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    textAlign: 'center',
    lineHeight: 16,
  },

  // ── FAB ──────────────────────────────────────────────────────
  fabWrap: {
    position: 'absolute',
    left: 20,
    right: 30,
  },
  fab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: 16,
    borderRadius: Radius.pill,
    shadowColor: Stitch.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.28,
    shadowRadius: 24,
    elevation: 10,
  },
  fabLabel: {
    fontFamily: Fonts.semibold,
    fontSize: FontSize.sm,
    letterSpacing: 0.8,
  },
});
