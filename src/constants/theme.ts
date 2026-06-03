import '@/global.css';

import { Platform } from 'react-native';

// ─── Theme-variant colors (used by ThemedText / ThemedView via useTheme()) ───

export const Colors = {
  light: {
    text: '#0D0D0D',
    background: '#F5F5F7',
    backgroundElement: '#E5E5EA',
    backgroundSelected: '#D1D1D6',
    textSecondary: '#636366',
    // Extended cinema tokens — light variant (fallback, app is dark-first)
    primary: '#7C3AED',
    primaryDim: 'rgba(124, 58, 237, 0.12)',
    gold: '#B8860B',
    surface: '#FFFFFF',
    surfaceElevated: '#F2F2F7',
    border: '#D1D1D6',
    tabBar: '#F5F5F7',
    tabBarActive: '#7C3AED',
    tabBarInactive: '#8E8E93',
  },
  dark: {
    // ── Base surfaces ──────────────────────────────────────
    text: '#FFFFFF',
    background: '#0D0D0D',       // Main app background — near-black (Stitch Swipe Engine)
    backgroundElement: '#1A1A24', // Cards, elevated surfaces — slight purple tint (Stitch bottom sheet)
    backgroundSelected: '#252535', // Chips inactive, selected items (Stitch genre chips)
    textSecondary: '#9CA3AF',    // Secondary text, labels, runtime info (Stitch Movie Detail)

    // ── Extended cinema tokens ─────────────────────────────
    primary: '#8B5CF6',          // Brand violet — buttons, active chips, slider (Stitch Sign In / Apply Filter)
    primaryDim: 'rgba(139, 92, 246, 0.15)',
    gold: '#F5C518',             // Star rating badge (Stitch "⭐ 8.4")
    surface: '#141418',          // Slightly elevated surface (cards, list items)
    surfaceElevated: '#1A1A24',  // Bottom sheets, modals (Stitch Refine Search sheet)
    border: '#1F1F2E',           // Subtle borders, dividers
    tabBar: '#0D0D0D',           // Tab bar background
    tabBarActive: '#FFFFFF',     // Active tab icon
    tabBarInactive: '#4B5563',   // Inactive tab icon
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

// ─── Cinema-global tokens (not theme-variant) ─────────────────────────────────
// Use these directly in StyleSheet — they never change with light/dark mode
// because CineMatch is dark-first by design.

export const Cinema = {
  // Backgrounds
  bg: '#0D0D0D',
  bgAlt: '#0B0B0F',
  surface: '#141418',
  surfaceElevated: '#1A1A24',
  chip: '#252535',

  // Brand
  primary: '#8B5CF6',
  primaryDark: '#7C3AED',
  primaryLight: '#A78BFA',
  primaryDim: 'rgba(139, 92, 246, 0.15)',

  // Ratings
  gold: '#F5C518',
  goldDim: 'rgba(245, 197, 24, 0.15)',

  // Swipe feedback
  like: '#10B981',              // MATCH! green stamp (Stitch Swipe Engine)
  likeDim: 'rgba(16, 185, 129, 0.15)',
  nope: '#EF4444',
  nopeDim: 'rgba(239, 68, 68, 0.15)',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#9CA3AF',
  textMuted: '#6B7280',
  textDisabled: '#374151',

  // Borders & overlays
  border: '#1F1F2E',
  borderLight: '#2D2D3F',
  overlay: 'rgba(0, 0, 0, 0.75)',
  overlayLight: 'rgba(0, 0, 0, 0.45)',

  // Chip states
  chipActive: '#8B5CF6',
  chipText: '#9CA3AF',
  chipTextActive: '#FFFFFF',

  // Tab bar
  tabBar: '#0D0D0D',
  tabBarBorder: '#1A1A24',
  tabBarActive: '#FFFFFF',
  tabBarInactive: '#4B5563',
} as const;

// ─── Typography ───────────────────────────────────────────────────────────────

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const FontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 32,
  display: 48,
} as const;

export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};

// ─── Spacing (4px grid) ───────────────────────────────────────────────────────

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
  // Named aliases for readability
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  '3xl': 48,
} as const;

// ─── Border radius ────────────────────────────────────────────────────────────
// Observed from Stitch screens:
// - Chips/pills: fully rounded (~24px)
// - Cards/posters: 12px
// - Bottom sheets: top corners 16px
// - Buttons: 12px
// - Inputs: 8px bottom-only (Stitch Auth uses underline style)

export const Radius = {
  sm: 6,
  md: 10,
  lg: 12,
  xl: 16,
  '2xl': 20,
  pill: 999,
} as const;

// ─── Legacy exports (kept for backward compat) ───────────────────────────────

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
