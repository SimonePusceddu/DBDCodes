import { Platform } from 'react-native';

// === DBD COLOR PALETTE ===
export const DBDColors = {
  // Primary backgrounds
  background: {
    primary: '#1a1a1a',
    secondary: '#242424',
    tertiary: '#2d2d2d',
    elevated: '#333333',
  },

  // Blood red accents
  accent: {
    primary: '#8B0000',
    secondary: '#DC143C',
    tertiary: '#B22222',
    glow: 'rgba(220, 20, 60, 0.3)',
  },

  // Text colors
  text: {
    primary: '#FFFFFF',
    secondary: '#E0E0E0',
    muted: '#9E9E9E',
    accent: '#DC143C',
  },

  // Semantic colors
  status: {
    success: '#4CAF50',
    warning: '#FFA726',
    error: '#EF5350',
    info: '#29B6F6',
  },

  // Borders and dividers
  border: {
    subtle: '#333333',
    default: '#444444',
    accent: '#8B0000',
  },

  // Shrine specific
  shrine: {
    survivor: '#4CAF50',
    killer: '#DC143C',
    shards: '#0288D1', // Darker blue for iridescent shards
  },
};

// === SPACING ===
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// === BORDER RADIUS ===
export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

// === SHADOWS ===
export const Shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  elevated: {
    shadowColor: '#DC143C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  glow: {
    shadowColor: '#DC143C',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 12,
  },
};

// === TYPOGRAPHY ===
export const Typography = {
  header: {
    fontSize: 28,
    fontWeight: 'bold' as const,
    letterSpacing: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold' as const,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600' as const,
  },
  body: {
    fontSize: 16,
    fontWeight: 'normal' as const,
  },
  caption: {
    fontSize: 14,
    fontWeight: 'normal' as const,
  },
  small: {
    fontSize: 12,
    fontWeight: 'normal' as const,
  },
  code: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    letterSpacing: 2,
    fontFamily: Platform.select({
      ios: 'Menlo',
      android: 'monospace',
      default: 'monospace',
    }),
  },
};

// === COLORS EXPORT FOR COMPATIBILITY ===
export const Colors = {
  light: {
    text: DBDColors.text.primary,
    background: DBDColors.background.primary,
    tint: DBDColors.accent.secondary,
    icon: DBDColors.text.muted,
    tabIconDefault: DBDColors.text.muted,
    tabIconSelected: DBDColors.accent.secondary,
  },
  dark: {
    text: DBDColors.text.primary,
    background: DBDColors.background.primary,
    tint: DBDColors.accent.secondary,
    icon: DBDColors.text.muted,
    tabIconDefault: DBDColors.text.muted,
    tabIconSelected: DBDColors.accent.secondary,
  },
};

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
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
