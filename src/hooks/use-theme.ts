import { Cinema, CinemaLight, Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function useTheme() {
  const scheme = useColorScheme();
  const theme = scheme === 'light' ? 'light' : 'dark';
  return Colors[theme];
}

export function useColors() {
  const scheme = useColorScheme();
  return scheme === 'light' ? CinemaLight : Cinema;
}
