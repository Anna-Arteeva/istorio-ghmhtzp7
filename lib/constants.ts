import { theme } from '@/theme';
// Language level configuration with consistent colors
export const LANGUAGE_LEVELS = {
  A1: {
    color: '#DEF6A8',
    textColor: theme.colors.gray[900], // dark text for light backgrounds
  },
  A2: {
    color: '#B8E986',
    textColor: theme.colors.gray[900], // dark text for light backgrounds
  },
  B1: {
    color: 'rgba(143, 239, 252, 1)',
    textColor: theme.colors.gray[900], // dark text for light backgrounds
  },
  B2: {
    color: 'rgba(104, 212, 249, 1)',
    textColor: theme.colors.gray[900], // dark text for light backgrounds
  },
  C1: {
    color: 'rgba(255, 199, 238, 1)',
    textColor: theme.colors.gray[900], // dark text for light backgrounds
  },
  C2: {
    color: 'rgba(246, 164, 235, 1)',
    textColor: theme.colors.gray[900], // dark text for light backgrounds
  },
} as const;

export type LanguageLevel = keyof typeof LANGUAGE_LEVELS;
