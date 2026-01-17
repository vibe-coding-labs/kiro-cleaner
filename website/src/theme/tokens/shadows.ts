// Shadow tokens for flat design system
// True flat design: all shadows set to 'none'

export const shadowTokens = {
  // Elevation shadows - all set to none for flat design
  elevation: {
    none: 'none',
    sm: 'none',
    md: 'none',
    lg: 'none',
    xl: 'none',
    '2xl': 'none',
  },
  
  // Colored shadows - all set to none for flat design
  colored: {
    primary: 'none',
    secondary: 'none',
    accent: 'none',
  },
  
  // Glow effects - all set to none for flat design
  glow: {
    sm: 'none',
    md: 'none',
    lg: 'none',
  },
} as const;

export type ShadowTokens = typeof shadowTokens;
