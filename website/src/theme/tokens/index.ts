// Design tokens for the flat design system
import { flatColors } from '../colors';

export const colorTokens = {
  // Brand colors
  brand: {
    primary: flatColors.primary,
    primaryDark: flatColors.primaryDark,
    primaryLight: flatColors.primaryLight,
    primarySubtle: `${flatColors.primary}10`,
    secondary: flatColors.secondary,
    secondaryDark: flatColors.secondaryDark,
    secondaryLight: flatColors.secondaryLight,
    accent: flatColors.accent,
    accentDark: flatColors.accentDark,
    accentLight: flatColors.accentLight,
  },
  
  // Background colors
  background: {
    default: flatColors.background,
    paper: flatColors.surface,
    subtle: '#f8f9fa',
  },
  
  // Text colors
  text: {
    primary: flatColors.textPrimary,
    secondary: flatColors.textSecondary,
    light: flatColors.textLight,
    inverse: '#ffffff',
    disabled: '#bdc3c7',
  },
  
  // Border colors
  border: {
    default: flatColors.border,
    light: '#e0e0e0',
    dark: '#95a5a6',
  },
  
  // Neutral colors (for code blocks, etc.)
  neutral: {
    100: '#f8f9fa',
    200: '#e9ecef',
    300: '#dee2e6',
    400: '#ced4da',
    500: '#adb5bd',
    600: '#6c757d',
    700: '#495057',
    800: '#343a40',
    900: '#212529',
  },
  
  // Semantic colors
  semantic: {
    error: flatColors.accent,
    errorLight: flatColors.accentLight,
    warning: '#f39c12',
    warningLight: '#f8c471',
    success: flatColors.secondary,
    successLight: flatColors.secondaryLight,
    info: flatColors.primary,
    infoLight: flatColors.primaryLight,
  },
} as const;

export type ColorTokens = typeof colorTokens;
