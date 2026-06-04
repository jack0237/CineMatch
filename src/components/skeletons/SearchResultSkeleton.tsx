import { StyleSheet, View, type ViewStyle } from 'react-native';
import { ShimmerBlock } from './ShimmerBlock';
import { Radius, Spacing } from '@/constants/theme';

interface Props {
  count?: number;
  style?: ViewStyle;
}

// One skeleton row — mirrors SearchResultCard: 96×144 poster + title + chips + rating
function SearchResultItemSkeleton() {
  return (
    <View style={styles.card}>
      {/* Poster */}
      <ShimmerBlock height={144} borderRadius={Radius.lg} style={{ width: 96 }} />

      {/* Metadata */}
      <View style={styles.meta}>
        <ShimmerBlock height={20} borderRadius={7} style={{ width: '80%' }} />
        <View style={styles.chipRow}>
          <ShimmerBlock height={24} borderRadius={Radius.pill} style={{ width: 70 }} />
          <ShimmerBlock height={24} borderRadius={Radius.pill} style={{ width: 60 }} />
        </View>
        <View style={styles.ratingRow}>
          <ShimmerBlock height={14} borderRadius={5} style={{ width: 36 }} />
          <ShimmerBlock height={14} borderRadius={5} style={{ width: 40 }} />
        </View>
      </View>
    </View>
  );
}

export function SearchResultSkeleton({ count = 5, style }: Props) {
  return (
    <View style={[styles.list, style]}>
      {Array.from({ length: count }).map((_, i) => (
        <SearchResultItemSkeleton key={i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: Spacing.md,
  },
  card: {
    flexDirection: 'row',
    gap: Spacing.lg,
    backgroundColor: 'rgba(28,27,27,0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    borderRadius: Radius.lg + 4,
    padding: Spacing.sm,
  },
  meta: {
    flex: 1,
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
    paddingRight: Spacing.sm,
  },
  chipRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  ratingRow: {
    flexDirection: 'row',
    gap: 6,
  },
});
