/**
 * Modern Color Tokens - Refined
 * 
 * A sophisticated color system inspired by top-tier design systems.
 */

export const colorTokens = {
  // Brand Colors - Refined palette
  brand: {
    primary: '#0070f3',      // Vercel blue - more vibrant
    primaryDark: '#0761d1',
    primaryLight: '#3291ff',
    primarySubtle: '#e6f2ff',
    
    secondary: '#7928ca',    // Purple accent
    secondaryDark: '#6b21a8',
    secondaryLight: '#9333ea',
    
    accent: '#ff0080',       // Hot pink for emphasis
    accentDark: '#e00070',
    accentLight: '#ff3399',
  },
  
  // Neutral Colors - Warmer grays
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },
  
  // Semantic Colors
  semantic: {
    success: '#00d084',
    successLight: '#d1fae5',
    warning: '#f5a623',
    warningLight: '#fef3c7',
    error: '#ff3b30',
    errorLight: '#fee2e2',
    info: '#0070f3',
    infoLight: '#e6f2ff',
  },
  
  // Gradient Colors - More dramatic
  gradients: {
    hero: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    heroAlt: 'linear-gradient(135deg, #0070f3 0%, #7928ca 100%)',
    card: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    subtle: 'linear-gradient(180deg, #ffffff 0%, #fafafa 100%)',
    mesh: 'radial-gradient(at 27% 37%, hsla(215, 98%, 61%, 0.3) 0px, transparent 50%), radial-gradient(at 97% 21%, hsla(125, 98%, 72%, 0.3) 0px, transparent 50%), radial-gradient(at 52% 99%, hsla(354, 98%, 61%, 0.3) 0px, transparent 50%), radial-gradient(at 10% 29%, hsla(256, 96%, 67%, 0.3) 0px, transparent 50%)',
    
    // Premium gradients
    premium: {
      blue: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      purple: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      ocean: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      sunset: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      forest: 'linear-gradient(135deg, #0ba360 0%, #3cba92 100%)',
    },
    
    // Subtle gradients (for backgrounds)
    subtleVariants: {
      warm: 'linear-gradient(180deg, #ffffff 0%, #fff5f5 100%)',
      cool: 'linear-gradient(180deg, #ffffff 0%, #f0f9ff 100%)',
      neutral: 'linear-gradient(180deg, #ffffff 0%, #fafafa 100%)',
    },
    
    // Animated gradients (for special effects)
    animated: {
      rainbow: 'linear-gradient(124deg, #ff2400, #e81d1d, #e8b71d, #e3e81d, #1de840, #1ddde8, #2b1de8, #dd00f3, #dd00f3)',
      aurora: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    },
  },
  
  // Surface colors (for layering)
  surface: {
    base: '#ffffff',
    raised: '#ffffff',
    overlay: 'rgba(255, 255, 255, 0.95)',
    frosted: 'rgba(255, 255, 255, 0.7)',
  },
  
  // Background Colors
  background: {
    default: '#ffffff',
    paper: '#ffffff',
    elevated: '#ffffff',
    subtle: '#fafafa',
  },
  
  // Text Colors
  text: {
    primary: '#171717',
    secondary: '#525252',
    tertiary: '#737373',
    disabled: '#a3a3a3',
    inverse: '#ffffff',
  },
  
  // Border Colors
  border: {
    default: '#e5e5e5',
    strong: '#d4d4d4',
    subtle: '#f5f5f5',
  },
} as const;

// Type-safe color access
export type ColorTokens = typeof colorTokens;
export type BrandColor = keyof typeof colorTokens.brand;
export type NeutralColor = keyof typeof colorTokens.neutral;
export type SemanticColor = keyof typeof colorTokens.semantic;
