import { StyleSheet, View, type ViewStyle } from 'react-native';
import { ShimmerBlock } from './ShimmerBlock';
import { Spacing } from '@/constants/theme';
import { useColors } from '@/hooks/use-theme';

function HistoryItemSkeletonItem() {
  const C = useColors();
  return (
    <View style={[styles.card, { backgroundColor: C.surfaceElevated, borderColor: C.border }]}>
      <ShimmerBlock height={96} borderRadius={8} style={{ width: 64, flexShrink: 0 }} />
      <View style={styles.details}>
        <ShimmerBlock height={18} borderRadius={6} style={{ width: '75%' }} />
        <View style={styles.metaRow}>
          <ShimmerBlock height={12} borderRadius={4} style={{ width: 60 }} />
          <ShimmerBlock height={12} borderRadius={4} style={{ width: 80 }} />
        </View>
      </View>
      <ShimmerBlock height={40} borderRadius={20} style={{ width: 40, flexShrink: 0 }} />
    </View>
  );
}

interface Props {
  count?: number;
  style?: ViewStyle;
}

export function HistoryItemSkeleton({ count = 6, style }: Props) {
  return (
    <View style={[styles.list, style]}>
      {Array.from({ length: count }).map((_, i) => (
        <HistoryItemSkeletonItem key={i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
    borderWidth: 1,
    borderRadius: 24,
    padding: 12,
  },
  details: {
    flex: 1,
    gap: 8,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 8,
  },
});
