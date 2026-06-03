# CineMatch — Agent Instructions

## Expo Version

This project uses **Expo SDK v56**. Always read the exact versioned docs at <https://docs.expo.dev/versions/v56.0.0/> before writing any Expo-related code. Do not rely on general Expo knowledge — APIs change between SDK versions.

## Project Overview

CineMatch is a mobile app (iOS, Android) built with **Expo + React Native + TypeScript**. It uses:

- **Expo Router v4** for file-based routing (`src/app/` directory)
- **React Compiler** (experimental, enabled in `app.json`)
- **Typed routes** (experimental, enabled in `app.json`)
- **Dark/light mode** via `useColorScheme` and a custom `ThemeProvider`
- **Supabase** for auth + database (`swipe_history`, `profiles` tables)
- **TMDB API** for movie data (popular, discover, search, details, credits, videos)

## Project Structure

```text
src/
  app/
    (auth)/              # login.tsx, register.tsx, forgot-password.tsx
    (tabs)/              # swipe.tsx, matches.tsx, search.tsx, history.tsx, profile.tsx
                         # history.tsx: tabBarStyle display:none — accessible via router.push('/history')
    history.tsx          # Redirect guard → /(tabs)/history (route collision prevention)
    movie/[id].tsx       # Movie detail screen (Stack, transparent header)
    _layout.tsx          # Root layout: fonts, auth guard, GestureHandlerRootView
  components/
    FilterSheet.tsx      # Shared filter bottom sheet (genres, TMDB score, era)
    MovieListItem.tsx    # Horizontal list item: poster thumbnail + metadata
    SearchBar.tsx        # Pill search input with debounce spinner + clear button
    SearchResultCard.tsx # Glass result card for search screen
    SwipeCard.tsx        # Swipable card with overlays, genre chips, rating badge
    Button.tsx           # Primary/secondary button with gradient
    Input.tsx            # Styled text input
    ui/TabIcon.tsx       # Tab bar icon with active/inactive states
  constants/
    theme.ts             # Stitch M3 tokens: Cinema (dark), CinemaLight, Fonts, Spacing, Radius
  hooks/
    useAuth.ts           # AuthContext, useAuth(), useAuthState()
    use-theme.ts         # useColors() → CinemaPalette, useTheme() → Colors variant
    use-color-scheme.ts  # Platform-aware color scheme hook
  services/
    tmdb.ts              # getPopularMovies, discoverMovies, searchMovies,
                         # getMovieDetails, getMovieCredits, getMovieVideos, getGenres
    supabase.ts          # Supabase client (anon key from env)
    swipe.ts             # saveSwipe, getSwipedMovieIds, getLikedMovies, getAllSwipes
  types/
    tmdb.ts              # Movie, Genre, CastMember, Video, MovieCredits, MoviesPage
    supabase.ts          # Database, SwipeHistory, Profile, SwipeAction
  utils/
    format.ts            # posterUrl, backdropUrl, profileUrl, formatRuntime, formatYear
assets/                  # Images and icons
```

## Code Conventions

- **TypeScript** everywhere — no `any`, no implicit types.
- Use theme tokens from `src/constants/theme.ts` (`Cinema`, `CinemaLight`, `Stitch`, `Fonts`, `Spacing`, `Radius`) — never hardcode colors or sizes.
- Path alias `@/` resolves to `src/` (configured in `tsconfig.json`).
- React Compiler is active — do **not** manually memoize (`useMemo`, `useCallback`, `React.memo`) unless there is a concrete, measured reason (e.g., a callback used as an effect dependency).
- All screens use `SafeAreaView` from `react-native-safe-area-context` with `edges={['top']}`.
- Images use `expo-image` (`<Image>` with `contentFit="cover"`), never React Native's `<Image>`.
- Gradients use `expo-linear-gradient`.

## Key Patterns

### Supabase swipe persistence

```ts
// Save a swipe
saveSwipe(userId, movie, 'like' | 'dislike')

// Get liked movies (sorted)
getLikedMovies(userId, 'score' | 'latest' | 'genres')
```

### TMDB service

```ts
// Discover with filters (genres, score, era)
discoverMovies({ with_genres: '28,878', 'vote_average.gte': '7', 'primary_release_date.gte': '2020-01-01' })

// Search
searchMovies(query, page?)

// Full detail fetch (parallel)
Promise.all([getMovieDetails(id), getMovieCredits(id), getMovieVideos(id)])
```

### FilterSheet (shared component)

```tsx
import { FilterSheet, INITIAL_FILTER, ERA_DATE_RANGES, type FilterState } from '@/components/FilterSheet';

<FilterSheet
  visible={filterVisible}
  initialState={appliedFilters}
  onClose={() => setFilterVisible(false)}
  onApply={(state: FilterState) => setAppliedFilters(state)}
/>
```

`FilterState = { genres: number[], minScore: number, era: 'newest' | '90s' | 'golden' | null }`

### Image helpers

```ts
posterUrl(path, 'w342' | 'w500' | 'w780')    // movie poster
backdropUrl(path, 'w780' | 'w1280')           // hero backdrop
profileUrl(path, 'w185' | 'w342')             // cast avatar
```

## Running the App

```bash
npm install
npx expo start           # Expo dev tools
npx expo start --ios     # iOS simulator
npx expo start --android # Android emulator
```

## Environment Variables

Copy `.env.example` to `.env`. Never commit `.env`.

| Variable                          | Description                        |
| --------------------------------- | ---------------------------------- |
| `EXPO_PUBLIC_SUPABASE_URL`        | Supabase project URL               |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY`   | Supabase anon key                  |
| `EXPO_PUBLIC_TMDB_API_KEY`        | TMDB v3 API key                    |
| `EXPO_PUBLIC_TMDB_BASE_URL`       | `https://api.themoviedb.org/3`     |
| `EXPO_PUBLIC_TMDB_IMAGE_BASE_URL` | `https://image.tmdb.org/t/p`       |
| `STITCH_API_KEY`                  | Stitch (settings.local.json only)  |

## MCP Servers

### Google Stitch (`stitch`)

AI UI design tool — generates screens from text prompts.

- Configured in `~/.claude.json` (user-level)
- Active project: **CineMatch UI Kit** (`projects/4189922242168599667`)
- Key tools: `mcp__stitch__generate_screen_from_text`, `mcp__stitch__list_screens`, `mcp__stitch__get_screen`

### Supabase (`supabase`)

- Configured in `.mcp.json` (project-level), OAuth
- Project ref: `tqoajxhwapcttqfbjybg`
- Key tools: `mcp__supabase__execute_sql`, `mcp__supabase__apply_migration`, `mcp__supabase__list_tables`
- Always run `list_tables` before any schema change
- Use `get_logs` + `get_advisors` before debugging

## Before Writing Code

1. Check Expo v56 docs for any API used.
2. Use theme tokens — no inline color literals.
3. Keep components in `src/components/`, screens in `src/app/`.
4. For Supabase schema changes: run `mcp__supabase__list_tables` first.
5. For new screens: follow the existing `SafeAreaView` + `useColors()` pattern.
