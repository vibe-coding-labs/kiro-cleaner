import { createTheme, type Shadows } from '@mui/material/styles';
import { flatColors } from './colors';
import { flatTypography } from './typography';
import { spacingUnit } from './spacing';
import { validatePaletteContrast } from './contrast';

// Validate color palette contrast on theme creation
validatePaletteContrast(flatColors);

// Create array of 'none' for all shadow levels (Material-UI uses 25 levels)
const noShadows = Array(25).fill('none') as Shadows;

export const flatTheme = createTheme({
  // Disable all shadows globally
  shadows: noShadows,
  
  palette: {
    primary: {
      main: flatColors.primary,
      dark: flatColors.primaryDark,
      light: flatColors.primaryLight,
    },
    secondary: {
      main: flatColors.secondary,
      dark: flatColors.secondaryDark,
      light: flatColors.secondaryLight,
    },
    error: {
      main: flatColors.accent,
      dark: flatColors.accentDark,
      light: flatColors.accentLight,
    },
    background: {
      default: flatColors.background,
      paper: flatColors.surface,
    },
    text: {
      primary: flatColors.textPrimary,
      secondary: flatColors.textSecondary,
    },
  },
  
  typography: {
    fontFamily: flatTypography.fontFamily,
    h1: flatTypography.h1,
    h2: flatTypography.h2,
    h3: flatTypography.h3,
    h4: flatTypography.h4,
    h5: flatTypography.h5,
    h6: flatTypography.h6,
    body1: flatTypography.body1,
    body2: flatTypography.body2,
  },
  
  spacing: spacingUnit,
  
  // Override component defaults to enforce flat design
  components: {
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          boxShadow: 'none',
          backgroundImage: 'none',
        },
      },
    },
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          boxShadow: 'none',
          backgroundImage: 'none',
          border: `1px solid ${flatColors.border}`,
        },
      },
    },
    MuiAppBar: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          boxShadow: 'none',
          backgroundImage: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          backgroundImage: 'none',
          textTransform: 'none',
          fontWeight: 600,
          '&:hover': {
            boxShadow: 'none',
          },
          '&:active': {
            boxShadow: 'none',
          },
          '&:focus': {
            boxShadow: 'none',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: 'none',
          },
        },
        outlined: {
          borderWidth: '2px',
          '&:hover': {
            borderWidth: '2px',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          borderBottom: `2px solid ${flatColors.border}`,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
});
