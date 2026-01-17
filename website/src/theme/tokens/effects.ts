// Effect tokens for flat design
// True flat design: no glassmorphism, gradients, or blur effects
import { flatColors } from '../colors';

export const effectTokens = {
  // Glass effects - disabled for flat design
  glass: {
    light: {
      background: flatColors.surface,
      border: `1px solid ${flatColors.border}`,
      blur: '0px',
    },
    dark: {
      background: flatColors.textPrimary,
      border: `1px solid ${flatColors.border}`,
      blur: '0px',
    },
  },
  
  // Backdrop blur values - all set to none for flat design
  blur: {
    none: '0px',
    sm: '0px',
    md: '0px',
    lg: '0px',
    xl: '0px',
  },
} as const;

export type EffectTokens = typeof effectTokens;
