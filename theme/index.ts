import { Platform, useColorScheme } from 'react-native';
import { useSettings } from '../contexts/SettingsContext';

// Base theme values that don't change between light and dark modes
const baseTheme = {
  typography: {
    heading1: {
      fontSize: 24,
      lineHeight: 32,
      fontFamily: 'Montserrat-Bold',
    },
    heading2: {
      fontSize: 20,
      lineHeight: 28,
      fontFamily: 'Montserrat-Bold',
    },
    bodyLead: {
      fontSize: 18,
      lineHeight: 24,
      fontFamily: 'Montserrat-Regular',
    },
    bodyShortStory: {
      fontSize: 24,
      lineHeight: 32,
      fontFamily: 'Montserrat-ExtraBold',
    },
    body1: {
      fontSize: 16,
      lineHeight: 24,
      fontFamily: 'Montserrat-Regular',
    },
    bodyBold: {
      fontSize: 16,
      lineHeight: 24,
      fontFamily: 'Montserrat-Bold',
    },
    body2: {
      fontSize: 14,
      lineHeight: 20,
      fontFamily: 'Montserrat-Regular',
    },
    body3: {
      fontSize: 12,
      lineHeight: 16,
      fontFamily: 'Montserrat-Regular',
    },
    caption: {
      fontSize: 12,
      lineHeight: 16,
      fontFamily: 'Montserrat-Regular',
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
  },
  borderRadius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 24,
    full: 9999,
  },
  colors: {
    primary: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
    },
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
    red: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
    },
    green: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
    },
    white: '#ffffff',
    black: '#000000',
  },
  shadows: {
    none: {
      shadowColor: 'transparent',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
  },
  fontFamily: {
    default: 'Montserrat-Regular',
    medium: 'Montserrat-Medium',
    semiBold: 'Montserrat-SemiBold',
    bold: 'Montserrat-Bold',
    extraBold: 'Montserrat-ExtraBold',
  },
} as const;

// Light theme colors (current theme)
const lightColors = {
  white: '#FFFFFF',
  pageBackground: 'rgba(248, 248, 248, 1)',
  cardBackground: '#FFFFFF',
  
  primary: {
    50:  'rgba(18, 177, 198, 0.2)', // very light green
    100: 'rgba(104, 212, 249, 1)', // light green
    400: 'rgba(25, 214, 240, 1)', // dark gray
    500: 'rgba(18, 177, 198, 1)', // dark gray
    600: 'rgba(18, 177, 198, 1)',
    700: 'rgba(0, 72, 85, 1)',
  },
  gray: {
    50:  'rgba(29, 29, 34, 0.05)', // background
    100: 'rgba(29, 29, 34, 0.1)',
    200: 'rgba(29, 29, 34, 0.12)', // outline
    300: 'rgba(29, 29, 34, 0.3)',
    400: 'rgba(29, 29, 34, 0.5)',
    500: 'rgba(29, 29, 34, 0.65)', // secondary color
    600: 'rgba(29, 29, 34, 0.7)',
    700: 'rgba(29, 29, 34, 0.8)',
    800: 'rgba(29, 29, 34, 0.9)', // text
    900: 'rgba(29, 29, 34, 1)',
  },
  error: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    500: '#EF4444',
    600: '#DC2626',
  },
  semiWhite: {
    50: 'rgba(255, 255, 255, 0.05)',
    100: 'rgba(255, 255, 255, 0.1)',
    200: 'rgba(255, 255, 255, 0.2)',
    300: 'rgba(255, 255, 255, 0.3)',
    400: 'rgba(255, 255, 255, 0.4)',
    500: 'rgba(255, 255, 255, 0.5)',
    600: 'rgba(255, 255, 255, 0.6)',
    700: 'rgba(255, 255, 255, 0.7)',
    800: 'rgba(255, 255, 255, 0.8)',
    900: 'rgba(255, 255, 255, 0.9)',
  },
  white: '#FFFFFF',
  pageBackground: '#F8F8F8',
  cardBackground: '#FFFFFF',
  playBackground: 'rgba(255, 255, 255, 0.05)',
  
  gradients: {
    cyan: 'rgba(143, 239, 252, 1)',
    blue: 'rgba(104, 212, 249, 1)',
    pink: 'rgba(255, 199, 238, 1)',
    rose: 'rgba(246, 164, 235, 1)',
    lime: 'rgba(222, 246, 168, 1)',
    lila: 'rgba(132, 151, 247, 1)',
  },

} as const;

// Dark theme colors
const darkColors = {

  white: 'rgba(29, 29, 34, 1)', // Dark mode background
  pageBackground: 'rgba(17, 17, 22, 1)',
  cardBackground: 'rgba(29, 29, 34, 1)',

  primary: {
    50:  'rgba(18, 177, 198, 0.2)', // very light green
    100: 'rgba(104, 212, 249, 1)', // light green
    400: 'rgba(10, 158, 179, 1)', // dark gray
    500: 'rgba(18, 177, 198, 1)', // dark gray
    600: 'rgba(18, 177, 198, 1)',
    700: 'rgba(0, 72, 85, 1)',
  },
  gray: {
    50: 'rgba(255, 255, 255, 0.05)', // dark background
    100: 'rgba(255, 255, 255, 0.1)',
    200: 'rgba(255, 255, 255, 0.12)', // outline
    300: 'rgba(255, 255, 255, 0.3)',
    400: 'rgba(255, 255, 255, 0.5)',
    500: 'rgba(255, 255, 255, 0.65)', // secondary color
    600: 'rgba(255, 255, 255, 0.7)',
    700: 'rgba(255, 255, 255, 0.8)',
    800: 'rgba(255, 255, 255, 0.9)', // text
    900: '#FFFFFF',
  },
  error: {
    50: '#3B1515',
    100: '#481B1B',
    500: '#F55',
    600: '#FF6B6B',
  },
  semiWhite: {
    50:  'rgba(29, 29, 34, 0.05)', // background
    100: 'rgba(29, 29, 34, 0.1)',
    200: 'rgba(29, 29, 34, 0.12)', // outline
    300: 'rgba(29, 29, 34, 0.3)',
    400: 'rgba(29, 29, 34, 0.5)',
    500: 'rgba(29, 29, 34, 0.65)', // secondary color
    600: 'rgba(29, 29, 34, 0.7)',
    700: 'rgba(29, 29, 34, 0.8)',
    800: 'rgba(29, 29, 34, 0.9)', // text
    900: 'rgba(29, 29, 34, 1)',
  },
  gradients: {
    cyan: 'rgba(3, 54, 66, 1)',
    blue: 'rgba(0, 30, 69, 1)',
    pink: 'rgba(65, 0, 43, 1)',
    rose: 'rgba(65, 0, 0, 1)',
    lime: 'rgba(0, 65, 0, 1)',
    lila: 'rgba(24, 23, 90, 1)',
  },
} as const;

// Create the themes by combining base theme with colors
const lightTheme = {
  ...baseTheme,
  colors: lightColors,
} as const;

const darkTheme = {
  ...baseTheme,
  colors: darkColors,
} as const;

// For backward compatibility, export the light theme as the default theme
export const theme = lightTheme;

// Export the type for TypeScript support
export type Theme = typeof theme;

// Hook to get the current theme based on settings context
export function useTheme() {
  const { currentTheme } = useSettings();
  return currentTheme === 'dark' ? darkTheme : lightTheme;
}

// Export both themes for manual usage if needed
export const themes = {
  light: lightTheme,
  dark: darkTheme,
} as const;