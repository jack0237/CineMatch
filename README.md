# CineMatch

> L'app qui met fin aux debats interminables pour choisir un film.

Application mobile (iOS, Android) - Evaluation React Native M1, SUP de Vinci. Sujet 1 — CineMatch.

---

## Team

| Name          | Role                          |
| ------------- | ----------------------------- |
| Wilfreid Jack | Full-stack development (solo) |

---

## Features

### Required

- [x] Auth via Supabase (sign up, sign in, sign out, password reset)
- [x] Swipe screen — poster, title, year, TMDB rating — swipe left (dislike) / right (like)
- [ ] Matches screen — liked movies sorted by TMDB rating, saved in Supabase
- [ ] Movie detail — synopsis, runtime, genres, rating, top 5 cast, YouTube trailer link
- [ ] Search — search bar with debounce
- [ ] History — all swiped movies (liked and disliked) stored in Supabase

### Bonus

- [ ] Filter system (genre, TMDB score, era) via bottom sheet
- [ ] Smooth card rotation animation during swipe (Reanimated)

---

## Tech stack

| Need                | Tool                                          |
| ------------------- | --------------------------------------------- |
| Framework           | Expo SDK 56 + React Native 0.85               |
| Language            | TypeScript                                    |
| Navigation          | Expo Router v4 (file-based)                   |
| Database + Auth     | Supabase                                      |
| Movie API           | The Movie Database (TMDB)                     |
| Gestures            | react-native-gesture-handler ~2.31            |
| Animations          | react-native-reanimated 4.3                   |
| Images              | expo-image                                    |
| External links      | expo-web-browser                              |
| Styling             | StyleSheet + design tokens (constants/theme)  |

---

## Installation

### 1. Clone the repo

```bash
git clone https://github.com/jack0237/CineMatch.git
cd CineMatch
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in the values:

```env
EXPO_PUBLIC_SUPABASE_URL=...
EXPO_PUBLIC_SUPABASE_ANON_KEY=...
EXPO_PUBLIC_TMDB_API_KEY=...
EXPO_PUBLIC_TMDB_BASE_URL=https://api.themoviedb.org/3
EXPO_PUBLIC_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
```

### 3. Get a TMDB API key

1. Create an account at [developers.themoviedb.org](https://developers.themoviedb.org)
2. Go to **Settings → API**
3. Copy the **API key (v3 auth)**
4. Paste it in `.env` as `EXPO_PUBLIC_TMDB_API_KEY`

### 4. Get Supabase keys

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **Project Settings → API**
3. Copy **Project URL** → `EXPO_PUBLIC_SUPABASE_URL`
4. Copy **anon public** key → `EXPO_PUBLIC_SUPABASE_ANON_KEY`

### 5. Start the app

```bash
npx expo start           # Expo Dev Tools
npx expo start --ios     # iOS simulator
npx expo start --android # Android emulator
```

Scan the QR code with **Expo Go** on your phone.

---

## Project structure

```text
src/
  app/
    (auth)/            # Unauthenticated screens (login, register, forgot-password)
    (tabs)/            # Tab navigator (swipe, matches, search, history, profile)
    movie/[id].tsx     # Movie detail screen (Stack)
    _layout.tsx        # Root layout + auth guard
  components/          # Reusable components (SwipeCard, MovieCard, Button, Input...)
    skeletons/         # Skeleton loading components
  constants/
    theme.ts           # Design tokens (Colors, Fonts, Spacing, Radius)
  hooks/               # Custom hooks (useAuth, useMovies, useSwipe)
  services/
    tmdb.ts            # All TMDB API calls
    supabase.ts        # Supabase client
    swipe.ts           # Swipe persistence logic
  types/
    tmdb.ts            # TypeScript interfaces (Movie, Cast, Video...)
  utils/               # Helpers (formatters, date utils)
assets/                # Images and icons
```

---

## Environment variables

| Variable                          | Description          | Where to get it           |
| --------------------------------- | -------------------- | ------------------------- |
| `EXPO_PUBLIC_SUPABASE_URL`        | Supabase project URL | Project Settings → API    |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY`   | Supabase anon key    | Project Settings → API    |
| `EXPO_PUBLIC_TMDB_API_KEY`        | TMDB v3 API key      | developers.themoviedb.org |
| `EXPO_PUBLIC_TMDB_BASE_URL`       | TMDB base URL        | See `.env.example`        |
| `EXPO_PUBLIC_TMDB_IMAGE_BASE_URL` | TMDB image base URL  | See `.env.example`        |

> Never commit the `.env` file. It is listed in `.gitignore`.

---

## Project board

GitHub Projects: [github.com/users/jack0237/projects/7](https://github.com/users/jack0237/projects/7)

38 issues covering all features, organized by sprint over 8 weeks.
