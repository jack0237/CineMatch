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

| Variable          | Description                                                                   |
| ----------------- | ----------------------------------------------------------------------------- |
| `STITCH_API_KEY`  | Google Stitch API key (stored in `.claude/settings.local.json`, never commit) |

## MCP Servers

Two MCP servers are configured for this project:

### Google Stitch (`stitch`)

AI UI design tool — generates screens, design systems, and UI components from text prompts.

- Configured in `~/.claude.json` (user-level, API key in header)
- Key tools: `mcp__stitch__list_projects`, `mcp__stitch__create_project`, `mcp__stitch__generate_screen_from_text`, `mcp__stitch__get_screen`, `mcp__stitch__list_screens`
- Active Stitch project: **CineMatch UI Kit** (`projects/4189922242168599667`)

### Supabase (`supabase`)

Backend-as-a-service — database, auth, storage, edge functions.

- Configured in `.mcp.json` (project-level), authenticated via OAuth
- Project ref: `tqoajxhwapcttqfbjybg`
- Key tools: `mcp__supabase__execute_sql`, `mcp__supabase__apply_migration`, `mcp__supabase__list_tables`, `mcp__supabase__get_logs`
- Always run `list_tables` before any schema change
- Use `get_logs` + `get_advisors` before debugging

## Agent Skills

Two Supabase agent skills are installed in `.agents/skills/` and more other skills relative to this react native project:

- `supabase` — Supabase development patterns and client integration
- `supabase-postgres-best-practices` — Postgres query and schema optimization

Use the `supabase` skill for any task touching the database, auth, or storage.

## Before Writing Code

1. Check the Expo v56 docs for any API you use.
2. Follow the existing theme/token system — no inline color literals.
3. Add platform-specific files (`.web.tsx`) when behaviour must differ between native and web.
4. Keep components in `src/components/`, screens in `src/app/`.
5. For any Supabase schema change: check existing tables first with `mcp__supabase__list_tables`.
