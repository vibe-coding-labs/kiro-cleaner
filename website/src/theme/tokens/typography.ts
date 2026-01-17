/**
 * Modern Typography Tokens
 * 
 * A comprehensive typography system using Inter font family
 * with a Major Third (1.25) type scale.
 */

export const typographyTokens = {
  // Font Families
  fontFamily: {
    primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
    mono: "'Fira Code', 'SF Mono', 'Consolas', 'Monaco', 'Courier New', monospace",
  },
  
  // Font Sizes - Major Third Scale (1.25)
  fontSize: {
    h1: '3.052rem',      // ~48.8px
    h2: '2.441rem',      // ~39px
    h3: '1.953rem',      // ~31.2px
    h4: '1.563rem',      // ~25px
    h5: '1.25rem',       // ~20px
    h6: '1rem',          // 16px
    body1: '1rem',       // 16px
    body2: '0.875rem',   // 14px
    caption: '0.75rem',  // 12px
    overline: '0.625rem', // 10px
  },
  
  // Font Weights
  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  
  // Line Heights
  lineHeight: {
    tight: 1.2,
    snug: 1.3,
    normal: 1.5,
    relaxed: 1.6,
    loose: 1.8,
  },
  
  // Letter Spacing
  letterSpacing: {
    tighter: '-0.02em',
    tight: '-0.01em',
    normal: '0',
    wide: '0.01em',
    wider: '0.02em',
  },
  
  // Responsive Font Sizes
  responsive: {
    mobile: {
      base: '14px',
      h1: '2.441rem',    // 85% of desktop
      h2: '1.953rem',
      h3: '1.563rem',
      h4: '1.25rem',
    },
    tablet: {
      base: '15px',
      h1: '2.75rem',     // 90% of desktop
      h2: '2.2rem',
      h3: '1.75rem',
      h4: '1.4rem',
    },
    desktop: {
      base: '16px',
      h1: '3.052rem',
      h2: '2.441rem',
      h3: '1.953rem',
      h4: '1.563rem',
    },
  },
} as const;

// Type-safe typography access
export type TypographyTokens = typeof typographyTokens;
export type FontSize = keyof typeof typographyTokens.fontSize;
export type FontWeight = keyof typeof typographyTokens.fontWeight;
export type LineHeight = keyof typeof typographyTokens.lineHeight;
