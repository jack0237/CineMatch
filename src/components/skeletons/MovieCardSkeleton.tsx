import { StyleSheet, View, type ViewStyle } from 'react-native';
import { ShimmerBlock } from './ShimmerBlock';
import { Radius, Spacing } from '@/constants/theme';

interface Props {
  style?: ViewStyle;
}

// Mirrors MovieListItem layout: 52×78 poster thumbnail + title + meta + overview
export function MovieCardSkeleton({ style }: Props) {
  return (
    <View style={[styles.container, style]}>
      {/* Poster */}
      <ShimmerBlock height={78} borderRadius={Radius.md} style={{ width: 52 }} />

      {/* Text */}
      <View style={styles.info}>
        <ShimmerBlock height={16} borderRadius={6} style={{ width: '75%' }} />
        <ShimmerBlock height={12} borderRadius={6} style={{ width: '40%', marginTop: 4 }} />
        <ShimmerBlock height={12} borderRadius={6} style={{ marginTop: 6 }} />
        <ShimmerBlock height={12} borderRadius={6} style={{ width: '85%', marginTop: 3 }} />
      </View>

      {/* Chevron placeholder */}
      <ShimmerBlock height={16} borderRadius={4} style={{ width: 16 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  info: {
    flex: 1,
    gap: 0,
  },
});
