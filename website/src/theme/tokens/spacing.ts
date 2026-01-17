/**
 * Modern Spacing Tokens
 * 
 * A consistent spacing system based on an 8px base unit.
 * All values are multiples of 8px for visual consistency.
 */

export const spacingTokens = {
  0: '0px',
  1: '4px',      // 0.5 * base (exception for fine-tuning)
  2: '8px',      // 1 * base
  3: '12px',     // 1.5 * base
  4: '16px',     // 2 * base
  5: '20px',     // 2.5 * base
  6: '24px',     // 3 * base
  8: '32px',     // 4 * base
  10: '40px',    // 5 * base
  12: '48px',    // 6 * base
  16: '64px',    // 8 * base
  20: '80px',    // 10 * base
  24: '96px',    // 12 * base
  32: '128px',   // 16 * base
  40: '160px',   // 20 * base
  48: '192px',   // 24 * base
} as const;

// Semantic spacing names for common use cases
export const semanticSpacing = {
  // Component internal spacing
  componentPaddingSmall: spacingTokens[4],    // 16px
  componentPadding: spacingTokens[6],         // 24px
  componentPaddingLarge: spacingTokens[8],    // 32px
  
  // Between related elements
  gapSmall: spacingTokens[2],                 // 8px
  gap: spacingTokens[4],                      // 16px
  gapLarge: spacingTokens[6],                 // 24px
  
  // Between sections
  sectionGapSmall: spacingTokens[16],         // 64px
  sectionGap: spacingTokens[20],              // 80px
  sectionGapLarge: spacingTokens[24],         // 96px
  
  // Container padding
  containerPaddingMobile: spacingTokens[4],   // 16px
  containerPaddingTablet: spacingTokens[6],   // 24px
  containerPaddingDesktop: spacingTokens[12], // 48px
} as const;

// Type-safe spacing access
export type SpacingTokens = typeof spacingTokens;
export type SpacingKey = keyof typeof spacingTokens;
export type SemanticSpacing = typeof semanticSpacing;
