/**
 * Effect Tokens - Visual effects system
 * 
 * Provides glassmorphism, gradient overlays, mesh gradients, and shimmer effects
 * for creating modern, premium visual experiences.
 */

export interface GlassEffect {
  background: string;
  backdropFilter: string;
  border: string;
}

export const effectTokens = {
  // Glassmorphism effects
  glass: {
    light: {
      background: 'rgba(255, 255, 255, 0.7)',
      backdropFilter: 'blur(10px) saturate(180%)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
    },
    medium: {
      background: 'rgba(255, 255, 255, 0.5)',
      backdropFilter: 'blur(20px) saturate(180%)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
    },
    dark: {
      background: 'rgba(0, 0, 0, 0.3)',
      backdropFilter: 'blur(20px) saturate(180%)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    },
  },
  
  // Gradient overlays
  overlays: {
    subtle: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.8) 100%)',
    medium: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 100%)',
    strong: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 100%)',
  },
  
  // Mesh gradients (for backgrounds)
  mesh: {
    hero: `
      radial-gradient(at 27% 37%, hsla(215, 98%, 61%, 0.15) 0px, transparent 50%),
      radial-gradient(at 97% 21%, hsla(125, 98%, 72%, 0.15) 0px, transparent 50%),
      radial-gradient(at 52% 99%, hsla(354, 98%, 61%, 0.15) 0px, transparent 50%),
      radial-gradient(at 10% 29%, hsla(256, 96%, 67%, 0.15) 0px, transparent 50%),
      radial-gradient(at 92% 85%, hsla(46, 98%, 61%, 0.15) 0px, transparent 50%)
    `,
    subtle: `
      radial-gradient(at 40% 20%, hsla(215, 98%, 61%, 0.05) 0px, transparent 50%),
      radial-gradient(at 80% 0%, hsla(256, 96%, 67%, 0.05) 0px, transparent 50%),
      radial-gradient(at 0% 50%, hsla(125, 98%, 72%, 0.05) 0px, transparent 50%)
    `,
  },
  
  // Shimmer effect (for loading states)
  shimmer: {
    gradient: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
    animation: 'shimmer 2s infinite',
  },
} as const;

// Type-safe effect access
export type EffectTokens = typeof effectTokens;
export type GlassVariant = keyof typeof effectTokens.glass;
export type OverlayVariant = keyof typeof effectTokens.overlays;
export type MeshVariant = keyof typeof effectTokens.mesh;
