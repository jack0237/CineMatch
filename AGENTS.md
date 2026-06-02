# CineMatch — Agent Instructions

## Expo Version

This project uses **Expo SDK v56**. Always read the exact versioned docs at <https://docs.expo.dev/versions/v56.0.0/> before writing any Expo-related code. Do not rely on general Expo knowledge — APIs change between SDK versions.

## Project Overview

CineMatch is a mobile app (iOS, Android, Web) built with **Expo + React Native + TypeScript**. It uses:

- **Expo Router v4** for file-based routing (`src/app/` directory)
- **React Compiler** (experimental, enabled in `app.json`)
- **Typed routes** (experimental, enabled in `app.json`)
- **NativeWind / global CSS** (`src/global.css`) for styling on web
- **Dark/light mode** via `useColorScheme` and a custom `ThemeProvider`

## Project Structure

```text
src/
  app/          # Expo Router screens (_layout.tsx, index.tsx, explore.tsx)
  components/   # Shared UI components
  constants/    # theme.ts — Colors, Fonts, Spacing tokens
  hooks/        # Custom hooks (use-color-scheme, use-theme)
assets/         # Images and icons
scripts/        # reset-project.js
```

## Code Conventions

- **TypeScript** everywhere — no `any`, no implicit types.
- Use theme tokens from `src/constants/theme.ts` (`Colors`, `Fonts`, `Spacing`) instead of hardcoded values.
- Platform-specific files use the `.web.ts` / `.web.tsx` suffix (e.g., `animated-icon.web.tsx`).
- Path alias `@/` resolves to `src/` (configured in `tsconfig.json`).
- React Compiler is active — do **not** manually memoize (`useMemo`, `useCallback`, `React.memo`) unless you have a concrete, measured reason.

## Running the App

```bash
npm install
npx expo start          # opens Expo dev tools
npx expo start --ios    # iOS simulator
npx expo start --android
npx expo start --web
```

Reset to a blank project:

```bash
npm run reset-project
```

## Environment Variables

Copy `.env.example` to `.env` and fill in the required values before starting the app. Never commit `.env`.

## Before Writing Code

1. Check the Expo v56 docs for any API you use.
2. Follow the existing theme/token system — no inline color literals.
3. Add platform-specific files (`.web.tsx`) when behaviour must differ between native and web.
4. Keep components in `src/components/`, screens in `src/app/`.
