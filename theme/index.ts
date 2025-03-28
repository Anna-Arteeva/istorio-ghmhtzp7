import { Platform } from 'react-native';

export const theme = {
  colors: {
    primary: {
      50: 'rgba(222, 246, 168, 0.20)', // Updated primary color - very light green
      100: 'rgba(222, 246, 168, 1)', // Updated primary color - light green
      500: 'rgba(26, 27, 48, 1)', // Updated primary color - dark gray
      600: '#4F46E5',
      700: '#7A9F00',
    },
    gray: {
      50: 'rgba(26, 27, 48, 0.05)', // background
      100: 'rgba(26, 27, 48, 0.1)',
      200: 'rgba(26, 27, 48, 0.12)', // outline
      300: 'rgba(26, 27, 48, 0.3)',
      400: 'rgba(26, 27, 48, 0.5)',
      500: 'rgba(27, 28, 50, 0.65)', // Updated secondary color
      600: 'rgba(26, 27, 48, 0.7)',
      700: 'rgba(26, 27, 48, 0.8)',
      800: 'rgba(26, 27, 48, 0.9)', // Same as primary for text
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
    },
    white: '#FFFFFF',
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

export type Theme = typeof theme;