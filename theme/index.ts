import { Platform, useColorScheme } from 'react-native';
import { useSettings } from '../contexts/SettingsContext';

// Base theme values that don't change between light and dark modes
const baseTheme = {
  fontFamily: {
    default: 'Montserrat-Regular',
    medium: 'Montserrat-Medium',
    semiBold: 'Montserrat-SemiBold',
    bold: 'Montserrat-Bold',
    extraBold: 'Montserrat-ExtraBold',
  },
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
      fontFamily: baseTheme.fontFamily.extraBold,
      fontSize: 26,
      lineHeight: 32,
    },
    heading2: {
      fontFamily: baseTheme.fontFamily.extraBold,
      fontSize: 20,
      lineHeight: 28,
    },
    bodyLead: {
      fontFamily: baseTheme.fontFamily.default,
      fontSize: 18,
      lineHeight: 28,
    },
    bodyShortStory: {
      fontFamily: baseTheme.fontFamily.extraBold,
      fontSize: 24,
      lineHeight: 32,
    },
    body1: {
      fontFamily: baseTheme.fontFamily.default,
      fontSize: 16,
      lineHeight: 24,
    },
    bodyBold: {
      fontFamily: baseTheme.fontFamily.semiBold,
      fontSize: 16,
      lineHeight: 24,
    },
    body2: {
      fontFamily: baseTheme.fontFamily.default,
      fontSize: 14,
      lineHeight: 20,
    },
    body3: {
      fontFamily: baseTheme.fontFamily.default,
      fontSize: 13,
      lineHeight: 16,
    },
    caption: {
      fontFamily: baseTheme.fontFamily.medium,
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
  white: '#FFFFFF',
  pageBackground: '#F8F8F8',
  cardBackground: '#FFFFFF',
  
  primary: {
    50:  'rgba(18, 177, 198, 0.2)', // very light green
    100: 'rgba(104, 212, 249, 1)', // light green
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