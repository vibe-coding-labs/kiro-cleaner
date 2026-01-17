/**
 * Gradient Fallback Utilities
 * 
 * Provides solid color fallbacks for complex gradients using CSS custom properties.
 * Ensures graceful degradation when gradients are not supported.
 * 
 * Requirements: 1.4
 */

import { colorTokens } from '../theme/tokens/colors';
import { supportsGradients } from './featureDetection';

/**
 * Gradient fallback configuration
 * Maps gradient names to their fallback solid colors
 */
export const gradientFallbacks = {
  // Main gradients
  hero: colorTokens.brand.primary,
  heroAlt: colorTokens.brand.primary,
  card: colorTokens.brand.accent,
  subtle: colorTokens.neutral[50],
  mesh: colorTokens.neutral[50],
  
  // Premium gradients
  premium: {
    blue: '#667eea',
    purple: '#f093fb',
    ocean: '#4facfe',
    sunset: '#fa709a',
    forest: '#0ba360',
  },
  
  // Subtle variants
  subtleVariants: {
    warm: '#fff5f5',
    cool: '#f0f9ff',
    neutral: colorTokens.neutral[50],
  },
  
  // Animated gradients
  animated: {
    rainbow: '#e81d1d',
    aurora: '#667eea',
  },
} as const;

/**
 * Generate CSS custom properties for a gradient with fallback
 * 
 * @param propertyName - CSS custom property name (e.g., '--gradient-hero')
 * @param gradient - CSS gradient string
 * @param fallbackColor - Solid fallback color
 * @returns Object with CSS custom properties
 */
export const createGradientProperty = (
  propertyName: string,
  gradient: string,
  fallbackColor: string
) => {
  const hasGradients = supportsGradients();
  
  return {
    [propertyName]: hasGradients ? gradient : fallbackColor,
    [`${propertyName}-fallback`]: fallbackColor,
  };
};

/**
 * Generate all gradient CSS custom properties
 * Creates a complete set of CSS variables for all gradients with fallbacks
 * 
 * @returns Object with all gradient CSS custom properties
 */
export const generateGradientProperties = () => {
  const hasGradients = supportsGradients();
  const properties: Record<string, string> = {};
  
  // Main gradients
  properties['--gradient-hero'] = hasGradients 
    ? colorTokens.gradients.hero 
    : gradientFallbacks.hero;
  properties['--gradient-hero-fallback'] = gradientFallbacks.hero;
  
  properties['--gradient-hero-alt'] = hasGradients 
    ? colorTokens.gradients.heroAlt 
    : gradientFallbacks.heroAlt;
  properties['--gradient-hero-alt-fallback'] = gradientFallbacks.heroAlt;
  
  properties['--gradient-card'] = hasGradients 
    ? colorTokens.gradients.card 
    : gradientFallbacks.card;
  properties['--gradient-card-fallback'] = gradientFallbacks.card;
  
  properties['--gradient-subtle'] = hasGradients 
    ? colorTokens.gradients.subtle 
    : gradientFallbacks.subtle;
  properties['--gradient-subtle-fallback'] = gradientFallbacks.subtle;
  
  properties['--gradient-mesh'] = hasGradients 
    ? colorTokens.gradients.mesh 
    : gradientFallbacks.mesh;
  properties['--gradient-mesh-fallback'] = gradientFallbacks.mesh;
  
  // Premium gradients
  Object.entries(colorTokens.gradients.premium).forEach(([key, gradient]) => {
    const fallback = gradientFallbacks.premium[key as keyof typeof gradientFallbacks.premium];
    properties[`--gradient-premium-${key}`] = hasGradients ? gradient : fallback;
    properties[`--gradient-premium-${key}-fallback`] = fallback;
  });
  
  // Subtle variants
  Object.entries(colorTokens.gradients.subtleVariants).forEach(([key, gradient]) => {
    const fallback = gradientFallbacks.subtleVariants[key as keyof typeof gradientFallbacks.subtleVariants];
    properties[`--gradient-subtle-${key}`] = hasGradients ? gradient : fallback;
    properties[`--gradient-subtle-${key}-fallback`] = fallback;
  });
  
  // Animated gradients
  Object.entries(colorTokens.gradients.animated).forEach(([key, gradient]) => {
    const fallback = gradientFallbacks.animated[key as keyof typeof gradientFallbacks.animated];
    properties[`--gradient-animated-${key}`] = hasGradients ? gradient : fallback;
    properties[`--gradient-animated-${key}-fallback`] = fallback;
  });
  
  return properties;
};

/**
 * Get gradient style with fallback using CSS custom properties
 * 
 * @param gradientVar - CSS custom property name (e.g., '--gradient-hero')
 * @returns Style object that uses CSS custom property with fallback
 */
export const useGradientProperty = (gradientVar: string) => {
  return {
    background: `var(${gradientVar}, var(${gradientVar}-fallback))`,
  };
};

/**
 * Apply gradient with inline fallback
 * For cases where CSS custom properties are not available
 * 
 * @param gradient - CSS gradient string
 * @param fallbackColor - Solid fallback color
 * @returns Style object with gradient or fallback
 */
export const applyGradientWithFallback = (
  gradient: string,
  fallbackColor: string
) => {
  const hasGradients = supportsGradients();
  
  if (hasGradients) {
    return {
      background: gradient,
      // Fallback for older browsers
      backgroundColor: fallbackColor,
    };
  }
  
  return {
    backgroundColor: fallbackColor,
  };
};

/**
 * Create gradient text style with fallback
 * For gradient text effects using background-clip
 * 
 * @param gradient - CSS gradient string
 * @param fallbackColor - Solid text color fallback
 * @returns Style object for gradient text
 */
export const createGradientTextStyle = (
  gradient: string,
  fallbackColor: string
) => {
  const hasGradients = supportsGradients();
  
  if (hasGradients) {
    return {
      background: gradient,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      // Fallback for browsers that don't support background-clip: text
      color: fallbackColor,
    };
  }
  
  return {
    color: fallbackColor,
  };
};

/**
 * Initialize gradient CSS custom properties
 * Should be called once on app initialization to set up CSS variables
 * 
 * @returns Style object with all gradient CSS custom properties
 */
export const initializeGradientProperties = () => {
  return generateGradientProperties();
};
