export function formatRuntime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}min`;
  return m === 0 ? `${h}h` : `${h}h ${m}min`;
}

export function formatYear(releaseDate: string): string {
  return releaseDate?.slice(0, 4) ?? '—';
}

export function formatRating(value: number): string {
  return value.toFixed(1);
}

export function posterUrl(path: string | null, size: 'w342' | 'w500' | 'w780' | 'original' = 'w500'): string | null {
  if (!path) return null;
  const base = process.env.EXPO_PUBLIC_TMDB_IMAGE_BASE_URL ?? 'https://image.tmdb.org/t/p';
  return `${base}/${size}${path}`;
}

export function profileUrl(path: string | null, size: 'w185' | 'w342' = 'w185'): string | null {
  if (!path) return null;
  const base = process.env.EXPO_PUBLIC_TMDB_IMAGE_BASE_URL ?? 'https://image.tmdb.org/t/p';
  return `${base}/${size}${path}`;
}
