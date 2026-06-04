import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { ShimmerBlock } from './ShimmerBlock';
import { Radius, Spacing } from '@/constants/theme';
import { useColors } from '@/hooks/use-theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const HERO_H = Math.round(SCREEN_HEIGHT * 0.74);

// Mirrors the layout of src/app/movie/[id].tsx
export function MovieDetailSkeleton() {
  const C = useColors();
  const insets = useSafeAreaInsets();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.root, { backgroundColor: C.bg }]}>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 + insets.bottom }}>
          {/* Hero */}
          <View style={[styles.hero, { height: HERO_H }]}>
            <ShimmerBlock height={HERO_H} borderRadius={0} style={StyleSheet.absoluteFill as any} />
            {/* Title block at bottom of hero */}
            <View style={styles.heroBottom}>
              <ShimmerBlock height={36} borderRadius={8} style={{ width: '85%', marginBottom: 8 }} />
              <ShimmerBlock height={36} borderRadius={8} style={{ width: '60%', marginBottom: 14 }} />
              <View style={styles.metaRow}>
                <ShimmerBlock height={28} borderRadius={Radius.pill} style={{ width: 80 }} />
                <ShimmerBlock height={28} borderRadius={Radius.pill} style={{ width: 70 }} />
                <ShimmerBlock height={18} borderRadius={6} style={{ width: 60 }} />
              </View>
            </View>
          </View>

          <View style={styles.body}>
            {/* Synopsis section */}
            <View style={styles.section}>
              <ShimmerBlock height={12} borderRadius={4} style={{ width: 80, marginBottom: 12 }} />
              <ShimmerBlock height={14} borderRadius={6} style={{ marginBottom: 6 }} />
              <ShimmerBlock height={14} borderRadius={6} style={{ marginBottom: 6 }} />
              <ShimmerBlock height={14} borderRadius={6} style={{ width: '90%', marginBottom: 6 }} />
              <ShimmerBlock height={14} borderRadius={6} style={{ width: '70%' }} />
            </View>

            {/* Cast section */}
            <View style={styles.section}>
              <ShimmerBlock height={12} borderRadius={4} style={{ width: 50, marginBottom: 16 }} />
              <View style={styles.castRow}>
                {[0, 1, 2, 3, 4].map((i) => (
                  <View key={i} style={styles.castItem}>
                    <ShimmerBlock height={80} borderRadius={40} style={{ width: 80 }} />
                    <ShimmerBlock height={10} borderRadius={5} style={{ width: 64, marginTop: 6 }} />
                    <ShimmerBlock height={10} borderRadius={5} style={{ width: 48, marginTop: 3 }} />
                  </View>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Floating header placeholder */}
        <View style={[styles.header, { paddingTop: insets.top }]}>
          <ShimmerBlock height={40} borderRadius={Radius.pill} style={{ width: 40 }} />
          <View style={styles.headerRight}>
            <ShimmerBlock height={40} borderRadius={Radius.pill} style={{ width: 40 }} />
            <ShimmerBlock height={40} borderRadius={Radius.pill} style={{ width: 40 }} />
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  hero: { overflow: 'hidden' },
  heroBottom: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  section: {
    marginBottom: 28,
  },
  castRow: {
    flexDirection: 'row',
    gap: 16,
  },
  castItem: {
    alignItems: 'center',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 'auto' as any,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: 12,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 8,
  },
});
