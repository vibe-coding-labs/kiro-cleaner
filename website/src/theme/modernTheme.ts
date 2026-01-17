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


// Create array of 'none' for all shadow levels
const noShadows = Array(25).fill('none') as Shadows;

// Override shadows for specific elevations (subtle shadows for depth)
const modernShadows = [...noShadows] as Shadows;
modernShadows[1] = '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)';
modernShadows[2] = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
modernShadows[3] = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
modernShadows[4] = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';

export const modernTheme = createTheme({
  // Disable shadows by default, use subtle ones when needed
  shadows: modernShadows,
  
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
    error: {
      main: colorTokens.semantic.error,
      light: colorTokens.semantic.errorLight,
    },
    warning: {
      main: colorTokens.semantic.warning,
      light: colorTokens.semantic.warningLight,
    },
    info: {
      main: colorTokens.semantic.info,
      light: colorTokens.semantic.infoLight,
    },
    success: {
      main: colorTokens.semantic.success,
      light: colorTokens.semantic.successLight,
    },
    grey: colorTokens.neutral,
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
  
  typography: {
    fontFamily: typographyTokens.fontFamily.primary,
    h1: {
      fontSize: typographyTokens.fontSize.h1,
      fontWeight: typographyTokens.fontWeight.bold,
      lineHeight: typographyTokens.lineHeight.tight,
      letterSpacing: typographyTokens.letterSpacing.tighter,
    },
    h2: {
      fontSize: typographyTokens.fontSize.h2,
      fontWeight: typographyTokens.fontWeight.bold,
      lineHeight: typographyTokens.lineHeight.snug,
      letterSpacing: typographyTokens.letterSpacing.tight,
    },
    h3: {
      fontSize: typographyTokens.fontSize.h3,
      fontWeight: typographyTokens.fontWeight.semibold,
      lineHeight: typographyTokens.lineHeight.snug,
      letterSpacing: typographyTokens.letterSpacing.tight,
    },
    h4: {
      fontSize: typographyTokens.fontSize.h4,
      fontWeight: typographyTokens.fontWeight.semibold,
      lineHeight: typographyTokens.lineHeight.normal,
      letterSpacing: typographyTokens.letterSpacing.normal,
    },
    h5: {
      fontSize: typographyTokens.fontSize.h5,
      fontWeight: typographyTokens.fontWeight.semibold,
      lineHeight: typographyTokens.lineHeight.normal,
      letterSpacing: typographyTokens.letterSpacing.normal,
    },
    h6: {
      fontSize: typographyTokens.fontSize.h6,
      fontWeight: typographyTokens.fontWeight.semibold,
      lineHeight: typographyTokens.lineHeight.normal,
      letterSpacing: typographyTokens.letterSpacing.normal,
    },
    body1: {
      fontSize: typographyTokens.fontSize.body1,
      fontWeight: typographyTokens.fontWeight.regular,
      lineHeight: typographyTokens.lineHeight.relaxed,
      letterSpacing: typographyTokens.letterSpacing.normal,
    },
    body2: {
      fontSize: typographyTokens.fontSize.body2,
      fontWeight: typographyTokens.fontWeight.regular,
      lineHeight: typographyTokens.lineHeight.relaxed,
      letterSpacing: typographyTokens.letterSpacing.normal,
    },
    caption: {
      fontSize: typographyTokens.fontSize.caption,
      fontWeight: typographyTokens.fontWeight.regular,
      lineHeight: typographyTokens.lineHeight.normal,
      letterSpacing: typographyTokens.letterSpacing.wide,
    },
  },
  
  spacing: 8, // Base unit
  
  shape: {
    borderRadius: 4,
  },
  
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  
  transitions: {
    duration: {
      shortest: animationTokens.duration.fastest,
      shorter: animationTokens.duration.faster,
      short: animationTokens.duration.fast,
      standard: animationTokens.duration.normal,
      complex: animationTokens.duration.complex,
      enteringScreen: 225,
      leavingScreen: 195,
    },
    easing: {
      easeInOut: animationTokens.easing.standard,
      easeOut: animationTokens.easing.decelerate,
      easeIn: animationTokens.easing.accelerate,
      sharp: animationTokens.easing.sharp,
    },
  },
  
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        * {
          box-sizing: border-box;
        }
        
        html {
          scroll-behavior: smooth;
        }
        
        body {
          font-family: ${typographyTokens.fontFamily.primary};
        }
        
        /* Focus visible styles */
        *:focus-visible {
          outline: 2px solid ${colorTokens.brand.primary};
          outline-offset: 2px;
        }
      `,
    },
    
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: typographyTokens.fontWeight.semibold,
          borderRadius: '4px',
          padding: `${spacingTokens[3]} ${spacingTokens[6]}`,
          fontSize: typographyTokens.fontSize.body1,
          transition: animationTokens.transitions.hover,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
            transform: 'translateY(-2px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
        },
        outlined: {
          borderWidth: '2px',
          '&:hover': {
            borderWidth: '2px',
          },
        },
        sizeLarge: {
          padding: `${spacingTokens[4]} ${spacingTokens[8]}`,
          fontSize: typographyTokens.fontSize.h6,
        },
      },
    },
    
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          borderRadius: '4px',
          border: `1px solid ${colorTokens.border.default}`,
          transition: animationTokens.transitions.card,
          '&:hover': {
            transform: 'translateY(-4px)',
            borderColor: colorTokens.brand.primary,
            boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
    
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        rounded: {
          borderRadius: '4px',
        },
      },
    },
    
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: spacingTokens[6],
          paddingRight: spacingTokens[6],
          '@media (max-width: 600px)': {
            paddingLeft: spacingTokens[4],
            paddingRight: spacingTokens[4],
          },
        },
        maxWidthLg: {
          maxWidth: '1200px',
        },
      },
    },
    
    MuiAppBar: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          backgroundImage: 'none',
        },
      },
    },
    
    MuiTabs: {
      styleOverrides: {
        root: {
          borderBottom: `2px solid ${colorTokens.border.default}`,
        },
        indicator: {
          height: '3px',
          borderRadius: '3px 3px 0 0',
        },
      },
    },
    
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: typographyTokens.fontWeight.semibold,
          fontSize: typographyTokens.fontSize.body1,
          transition: animationTokens.transitions.fast,
        },
      },
    },
  },
});
