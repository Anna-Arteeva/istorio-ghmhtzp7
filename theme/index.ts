import { Platform, useColorScheme } from 'react-native';
import { useSettings } from '../contexts/SettingsContext';

// Base theme values that don't change between light and dark modes
const baseTheme = {
  shadows: {
    sm: Platform.select({
      ios: {
        shadowColor: 'rgba(26, 27, 48, 1)',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
      default: {
        shadowColor: 'rgba(26, 27, 48, 1)',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
    }),
    md: Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    }),
    lg: Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
      },
      android: {
        elevation: 8,
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
      },
    }),
  },
  typography: {
    heading1: {
      fontFamily: 'Montserrat-ExtraBold',
      fontSize: 26,
      lineHeight: 32,
    },
    heading2: {
      fontFamily: 'Montserrat-ExtraBold',
      fontSize: 20,
      lineHeight: 28,
    },
    bodyLead: {
      fontFamily: 'Montserrat-Regular',
      fontSize: 18,
      lineHeight: 24,
    },
    bodyShortStory: {
      fontFamily: 'Montserrat-ExtraBold',
      fontSize: 24,
      lineHeight: 32,
    },
    body1: {
      fontFamily: 'Montserrat-Regular',
      fontSize: 16,
      lineHeight: 24,
    },
    bodyBold: {
      fontFamily: 'Montserrat-SemiBold',
      fontSize: 16,
      lineHeight: 24,
    },
    body2: {
      fontFamily: 'Montserrat-Regular',
      fontSize: 14,
      lineHeight: 20,
    },
    caption: {
      fontFamily: 'Montserrat-Medium',
      fontSize: 12,
      lineHeight: 16,
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },
} as const;

// Light theme colors (current theme)
const lightColors = {
  primary: {
    50: 'rgba(222, 246, 168, 0.20)', // very light green
    100: 'rgba(222, 246, 168, 1)', // light green
    500: 'rgba(26, 27, 48, 1)', // dark gray
    600: '#4F46E5',
    700: '#7A9F00',
  },
  gray: {
    50: 'rgba(26, 27, 48, 0.05)', // background
    100: 'rgba(26, 27, 48, 0.1)',
    200: 'rgba(26, 27, 48, 0.12)', // outline
    300: 'rgba(26, 27, 48, 0.3)',
    400: 'rgba(26, 27, 48, 0.5)',
    500: 'rgba(27, 28, 50, 0.65)', // secondary color
    600: 'rgba(26, 27, 48, 0.7)',
    700: 'rgba(26, 27, 48, 0.8)',
    800: 'rgba(26, 27, 48, 0.9)', // text
    900: 'rgba(26, 27, 48, 1)',
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
} as const;

// Dark theme colors
const darkColors = {
  primary: {
    50: 'rgba(222, 246, 168, 0.10)', // darker very light green
    100: 'rgba(222, 246, 168, 0.8)', // darker light green
    500: 'rgba(222, 246, 168, 1)', // light green for contrast
    600: '#6D64FF', // lighter purple
    700: '#96C400', // lighter green
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
    50: 'rgba(0, 0, 0, 0.05)',
    100: 'rgba(0, 0, 0, 0.1)',
    200: 'rgba(0, 0, 0, 0.2)',
    300: 'rgba(0, 0, 0, 0.3)',
    400: 'rgba(0, 0, 0, 0.4)',
    500: 'rgba(0, 0, 0, 0.5)',
    600: 'rgba(0, 0, 0, 0.6)',
    700: 'rgba(0, 0, 0, 0.7)',
    800: 'rgba(0, 0, 0, 0.8)',
    900: 'rgba(0, 0, 0, 0.9)',
  },
  white: '#1A1B30', // Dark mode background
  pageBackground: '#13141F',
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