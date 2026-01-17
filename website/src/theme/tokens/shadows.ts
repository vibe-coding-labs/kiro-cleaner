/**
 * Shadow Tokens - Multi-level shadow system
 * 
 * Provides elevation shadows, colored shadows, inner shadows, and glow effects
 * for creating visual depth and hierarchy.
 */

export const shadowTokens = {
  // Elevation shadows (subtle to dramatic)
  elevation: {
    xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  },
  
  // Colored shadows (for brand elements)
  colored: {
    primary: '0 8px 16px -4px rgba(0, 112, 243, 0.3)',
    secondary: '0 8px 16px -4px rgba(121, 40, 202, 0.3)',
    accent: '0 8px 16px -4px rgba(255, 0, 128, 0.3)',
  },
  
  // Inner shadows (for depth)
  inner: {
    sm: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    md: 'inset 0 2px 8px 0 rgba(0, 0, 0, 0.1)',
  },
  
  // Glow effects
  glow: {
    sm: '0 0 10px rgba(0, 112, 243, 0.5)',
    md: '0 0 20px rgba(0, 112, 243, 0.5)',
    lg: '0 0 40px rgba(0, 112, 243, 0.5)',
  },
} as const;

// Type-safe shadow access
export type ShadowTokens = typeof shadowTokens;
export type ElevationLevel = keyof typeof shadowTokens.elevation;
export type ColoredShadow = keyof typeof shadowTokens.colored;
export type InnerShadow = keyof typeof shadowTokens.inner;
export type GlowSize = keyof typeof shadowTokens.glow;
