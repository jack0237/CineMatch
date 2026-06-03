import { View, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Cinema } from '@/constants/theme';

type MCIName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

export interface TabIconConfig {
  /** Outline variant shown when inactive */
  name: MCIName;
  /** Filled variant shown when active */
  activeName: MCIName;
}

interface TabIconProps extends TabIconConfig {
  color: string;
  focused: boolean;
  size?: number;
}

/**
 * Material 3-style tab icon with a pill indicator on the active state.
 * All tab screens should pass `tabBarIcon` using this component.
 *
 * Usage in _layout.tsx:
 *   tabBarIcon: tabIcon({ name: 'cards-outline', activeName: 'cards' })
 */
export function TabIcon({ name, activeName, color, focused, size = 22 }: TabIconProps) {
  return (
    <View style={styles.wrapper}>
      {focused && <View style={styles.pill} />}
      <MaterialCommunityIcons
        name={focused ? activeName : name}
        size={size}
        color={color}
      />
    </View>
  );
}

/** Factory to pass directly to Expo Router's `tabBarIcon` option */
export function tabIcon(config: TabIconConfig) {
  return ({ color, focused }: { color: string; focused: boolean }) => (
    <TabIcon {...config} color={color} focused={focused} />
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 56,
    height: 30,
  },
  pill: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 15,
    backgroundColor: Cinema.primaryDim,
  },
});
