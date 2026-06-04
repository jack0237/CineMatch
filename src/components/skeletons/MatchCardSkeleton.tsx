import { Dimensions, StyleSheet, View, type ViewStyle } from 'react-native';
import { ShimmerBlock } from './ShimmerBlock';
import { Spacing } from '@/constants/theme';
import { useColors } from '@/hooks/use-theme';

const H_PAD = 20;
const GAP = Spacing.lg;
const CARD_WIDTH = (Dimensions.get('window').width - H_PAD * 2 - GAP) / 2;
const POSTER_H = Math.round(CARD_WIDTH * 1.5);

function MatchCardSkeletonItem() {
  const C = useColors();
  return (
    <View style={[styles.card, { borderColor: C.border }]}>
      <ShimmerBlock height={POSTER_H} borderRadius={0} style={{ width: '100%' }} />
      <View style={styles.footer}>
        <ShimmerBlock height={14} borderRadius={6} style={{ width: '85%' }} />
        <ShimmerBlock height={12} borderRadius={6} style={{ width: 56, marginTop: 4 }} />
      </View>
    </View>
  );
}

interface Props {
  count?: number;
  style?: ViewStyle;
}

export function MatchCardSkeleton({ count = 6, style }: Props) {
  const items = Array.from({ length: count });
  const left = items.filter((_, i) => i % 2 === 0);
  const right = items.filter((_, i) => i % 2 !== 0);

  return (
    <View style={[styles.columns, style]}>
      <View style={styles.column}>
        {left.map((_, i) => <MatchCardSkeletonItem key={`l${i}`} />)}
      </View>
      <View style={styles.column}>
        {right.map((_, i) => <MatchCardSkeletonItem key={`r${i}`} />)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  columns: {
    flexDirection: 'row',
    gap: GAP,
  },
  column: {
    flex: 1,
    gap: GAP,
  },
  card: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
  },
});
