/**
 * Feature Detection Utilities
 * 
 * Detects browser feature support and provides fallback strategies.
 * Ensures graceful degradation for unsupported features.
 * 
 * Requirements: 6.3, 1.4
 */

/**
 * Check if backdrop-filter is supported
 * Used for glassmorphism effects
 */
export const supportsBackdropFilter = (): boolean => {
  if (typeof window === 'undefined' || typeof CSS === 'undefined' || !CSS) {
    return false;
  }
  
  // Check if CSS.supports is a function
  if (typeof CSS.supports !== 'function') {
    return false;
  }
  
  return (
    CSS.supports('backdrop-filter', 'blur(10px)') ||
    CSS.supports('-webkit-backdrop-filter', 'blur(10px)')
  );
};

/**
 * Check if CSS gradients are supported
 */
export const supportsGradients = (): boolean => {
  if (typeof window === 'undefined' || typeof CSS === 'undefined' || !CSS) {
    return false;
  }
  
  // Check if CSS.supports is a function
  if (typeof CSS.supports !== 'function') {
    return false;
  }
  
  return (
    CSS.supports('background', 'linear-gradient(red, blue)') ||
    CSS.supports('background', '-webkit-linear-gradient(red, blue)')
  );
};

/**
 * Check if CSS animations are supported
 */
export const supportsAnimations = (): boolean => {
  if (typeof window === 'undefined' || typeof CSS === 'undefined' || !CSS) {
    return false;
  }
  
  // Check if CSS.supports is a function
  if (typeof CSS.supports !== 'function') {
    return false;
  }
  
  return (
    CSS.supports('animation', 'test 1s') ||
    CSS.supports('-webkit-animation', 'test 1s')
  );
};

/**
 * Get glassmorphism styles with fallback
 * Returns glass effect if supported, solid background otherwise
 * 
 * @param glassColor - Glass effect color (with alpha)
 * @param fallbackColor - Solid fallback color
 * @param blurAmount - Blur amount (default: 10px)
 * @returns Style object with appropriate background
 */
export const getGlassmorphismStyles = (
  glassColor: string,
  fallbackColor: string,
  blurAmount: string = '10px'
) => {
  const hasBackdropFilter = supportsBackdropFilter();
  
  if (hasBackdropFilter) {
    return {
      backgroundColor: glassColor,
      backdropFilter: `blur(${blurAmount})`,
      WebkitBackdropFilter: `blur(${blurAmount})`,
    };
  }
  
  // Fallback to solid background
  return {
    backgroundColor: fallbackColor,
  };
};

/**
 * Get gradient styles with fallback
 * Returns gradient if supported, solid color otherwise
 * 
 * @param gradient - CSS gradient string
 * @param fallbackColor - Solid fallback color
 * @returns Style object with appropriate background
 */
export const getGradientStyles = (gradient: string, fallbackColor: string) => {
  const hasGradients = supportsGradients();
  
  if (hasGradients) {
    return {
      background: gradient,
    };
  }
  
  // Fallback to solid color
  return {
    backgroundColor: fallbackColor,
  };
};

/**
 * Get animation styles with fallback
 * Returns animation if supported, static styles otherwise
 * 
 * @param animationStyles - Animation CSS properties
 * @param fallbackStyles - Static fallback styles
 * @returns Style object with appropriate properties
 */
export const getAnimationStyles = (
  animationStyles: Record<string, any>,
  fallbackStyles: Record<string, any> = {}
) => {
  const hasAnimations = supportsAnimations();
  
  if (hasAnimations) {
    return animationStyles;
  }
  
  // Fallback to static styles
  return fallbackStyles;
};

/**
 * Feature detection results cache
 */
let featureCache: {
  backdropFilter?: boolean;
  gradients?: boolean;
  animations?: boolean;
} = {};

/**
 * Initialize feature detection and cache results
 * Call this once on app initialization for better performance
 */
export const initializeFeatureDetection = () => {
  featureCache = {
    backdropFilter: supportsBackdropFilter(),
    gradients: supportsGradients(),
    animations: supportsAnimations(),
  };
  
  return featureCache;
};

/**
 * Get cached feature detection results
 * Falls back to live detection if cache is empty
 */
export const getCachedFeatureSupport = () => {
  if (Object.keys(featureCache).length === 0) {
    return initializeFeatureDetection();
  }
  
  return featureCache;
};
