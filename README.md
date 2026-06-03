# CineMatch

> L'app qui met fin aux débats interminables pour choisir un film.

Application mobile (iOS, Android) — Évaluation React Native M1, SUP de Vinci. Sujet 1 — CineMatch.

---

## Team

| Nom           | Rôle                          |
| ------------- | ----------------------------- |
| Wilfreid Jack | Full-stack development (solo) |

---

## Features

### Obligatoires

- [x] Auth via Supabase (inscription, connexion, déconnexion, mot de passe oublié)
- [x] Écran Swipe — poster, titre, année, note TMDB — swipe gauche (dislike) / droite (like)
- [x] Matches screen — films likés triés par note, grille 2 colonnes, sauvegardés dans Supabase
- [x] Fiche film — synopsis, durée, genres, note, top 5 casting, bande-annonce YouTube
- [x] Recherche — barre de recherche avec debounce (400 ms), résultats TMDB
- [ ] Historique — tous les films swipés (likés et refusés) depuis Supabase

### Bonus

- [x] Système de filtres complet (genres, score TMDB, ère) via bottom sheet animé — Swipe + Recherche
- [ ] Animation rotation de carte pendant le swipe (Reanimated)

---

## Tech stack

| Besoin              | Outil                                         |
| ------------------- | --------------------------------------------- |
| Framework           | Expo SDK 56 + React Native 0.85               |
| Langage             | TypeScript                                    |
| Navigation          | Expo Router v4 (file-based)                   |
| Base de données     | Supabase (PostgreSQL + RLS)                   |
| Auth                | Supabase Auth                                 |
| API films           | The Movie Database (TMDB v3)                  |
| Gestes              | react-native-gesture-handler ~2.31            |
| Animations          | react-native-reanimated 4.3                   |
| Images              | expo-image                                    |
| Debounce recherche  | use-debounce                                  |
| Liens externes      | React Native Linking (YouTube trailer)        |
| Styling             | StyleSheet + tokens Stitch M3 (`theme.ts`)    |

---

## Installation

### 1. Cloner le repo

```bash
git clone https://github.com/jack0237/NGUEGUIM-WILFRIED-CineMatch.git
cd NGUEGUIM-WILFRIED-CineMatch
npm install
```

### 2. Variables d'environnement

```bash
cp .env.example .env
```

Remplir `.env` :

```env
EXPO_PUBLIC_SUPABASE_URL=...
EXPO_PUBLIC_SUPABASE_ANON_KEY=...
EXPO_PUBLIC_TMDB_API_KEY=...
EXPO_PUBLIC_TMDB_BASE_URL=https://api.themoviedb.org/3
EXPO_PUBLIC_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
```

### 3. Clé API TMDB

1. Créer un compte sur [developers.themoviedb.org](https://developers.themoviedb.org)
2. **Settings → API** → copier la **API key (v3 auth)**
3. Coller dans `.env` → `EXPO_PUBLIC_TMDB_API_KEY`

### 4. Clés Supabase

1. Créer un projet sur [supabase.com](https://supabase.com)
2. **Project Settings → API**
3. Copier **Project URL** → `EXPO_PUBLIC_SUPABASE_URL`
4. Copier **anon public** key → `EXPO_PUBLIC_SUPABASE_ANON_KEY`

### 5. Lancer l'app

```bash
npx expo start            # Expo Dev Tools
npx expo start --ios      # Simulateur iOS
npx expo start --android  # Émulateur Android
```

Scanner le QR code avec **Expo Go** sur votre téléphone.

---

## Structure du projet

```text
src/
  app/
    (auth)/              # Écrans non authentifiés (login, register, forgot-password)
    (tabs)/              # Tab navigator : swipe, matches, search, history, profile
    movie/[id].tsx       # Fiche film (Stack, header transparent)
    _layout.tsx          # Root layout + auth guard + fonts
  components/
    FilterSheet.tsx      # Bottom sheet filtres partagé (genres, score, ère)
    MovieListItem.tsx    # Item liste horizontal (poster + métadonnées)
    SearchBar.tsx        # Input recherche avec spinner debounce
    SearchResultCard.tsx # Carte glass résultats de recherche
    SwipeCard.tsx        # Carte swipable (poster, overlays, genres)
    Button.tsx / Input.tsx
    ui/TabIcon.tsx
  constants/
    theme.ts             # Tokens Stitch M3 (Cinema, Fonts, Spacing, Radius)
  hooks/
    useAuth.ts           # AuthContext + useAuthState
    use-theme.ts         # useColors, useTheme
  services/
    tmdb.ts              # getPopularMovies, discoverMovies, searchMovies, getMovieDetails...
    supabase.ts          # Client Supabase configuré
    swipe.ts             # saveSwipe, getLikedMovies, getAllSwipes
  types/
    tmdb.ts              # Movie, Genre, CastMember, Video...
    supabase.ts          # Database, SwipeHistory, Profile
  utils/
    format.ts            # posterUrl, backdropUrl, profileUrl, formatRuntime, formatYear
assets/                  # Images et icônes
```

---

## Variables d'environnement

| Variable                          | Description            | Où l'obtenir              |
| --------------------------------- | ---------------------- | ------------------------- |
| `EXPO_PUBLIC_SUPABASE_URL`        | URL du projet Supabase | Project Settings → API    |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY`   | Clé anon Supabase      | Project Settings → API    |
| `EXPO_PUBLIC_TMDB_API_KEY`        | Clé API TMDB v3        | developers.themoviedb.org |
| `EXPO_PUBLIC_TMDB_BASE_URL`       | Base URL TMDB          | Voir `.env.example`       |
| `EXPO_PUBLIC_TMDB_IMAGE_BASE_URL` | Base URL images TMDB   | Voir `.env.example`       |

> Ne jamais committer le fichier `.env`. Il est dans `.gitignore`.

---

## Progression

26 / 38 issues terminées — voir [ROADMAP.md](./ROADMAP.md) pour le détail par bloc.

## Project board

GitHub Projects : [github.com/users/jack0237/projects/7](https://github.com/users/jack0237/projects/7)
