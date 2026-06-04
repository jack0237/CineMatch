import { useEffect, useState } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

const SHIMMER_W = 180;
const DURATION = 1300;
const BASE = '#1e1d1d';

interface Props {
  height: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function ShimmerBlock({ height, borderRadius = 8, style }: Props) {
  const [containerW, setContainerW] = useState(0);
  const offset = useSharedValue(-SHIMMER_W);

  useEffect(() => {
    if (containerW <= 0) return;
    offset.value = -SHIMMER_W;
    offset.value = withRepeat(
      withTiming(containerW + SHIMMER_W, { duration: DURATION, easing: Easing.linear }),
      -1,
      false,
    );
  }, [containerW]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }],
  }));

  return (
    <View
      style={[{ height, borderRadius, backgroundColor: BASE, overflow: 'hidden' }, style]}
      onLayout={(e) => setContainerW(e.nativeEvent.layout.width)}
    >
      {containerW > 0 && (
        <Animated.View style={[styles.sweep, animStyle]}>
          <LinearGradient
            colors={[
              'transparent',
              'rgba(255,255,255,0.05)',
              'rgba(255,255,255,0.1)',
              'rgba(255,255,255,0.05)',
              'transparent',
            ]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.gradient}
          />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  sweep: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: SHIMMER_W,
  },
  gradient: { flex: 1 },
});
