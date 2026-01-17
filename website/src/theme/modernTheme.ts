import { createTheme, type Shadows } from '@mui/material/styles';
import { colorTokens } from './tokens';

// Create array of 'none' for all shadow levels
const noShadows = Array(25).fill('none') as Shadows;

export const modernTheme = createTheme({
  shadows: noShadows,
  
  palette: {
    primary: {
      main: colorTokens.brand.primary,
      dark: colorTokens.brand.primaryDark,
      light: colorTokens.brand.primaryLight,
      contrastText: '#ffffff',
    },
    secondary: {
      main: colorTokens.brand.secondary,
      dark: colorTokens.brand.secondaryDark,
      light: colorTokens.brand.secondaryLight,
      contrastText: '#ffffff',
    },
    background: {
      default: colorTokens.background.default,
      paper: colorTokens.background.paper,
    },
    text: {
      primary: colorTokens.text.primary,
      secondary: colorTokens.text.secondary,
      disabled: colorTokens.text.disabled,
    },
  },
  
  shape: {
    borderRadius: 4,
  },
});
