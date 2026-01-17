/**
 * Animation Presets
 * 
 * Predefined animation configurations for common UI patterns.
 * These presets ensure consistent animation behavior across the application.
 */

export interface AnimationPreset {
  initial: Record<string, any>;
  animate: Record<string, any>;
  transition: {
    duration: number;
    ease?: number[] | string;
    delay?: number;
  };
}

export const animationPresets = {
  // Fade animations
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.6 },
  },
  
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
  },
  
  fadeInDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
  },
  
  // Scale animations
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
  },
  
  scaleInBounce: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { 
      duration: 0.5, 
      ease: [0.68, -0.55, 0.265, 1.55] // Bounce easing
    },
  },
  
  // Slide animations
  slideInLeft: {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
  },
  
  slideInRight: {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
  },
  
  slideInUp: {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
  },
  
  slideInDown: {
    initial: { opacity: 0, y: -50 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
  },
  
  // Stagger container
  staggerContainer: {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
    transition: { duration: 0 },
  },
  
  // Stagger item (to be used with staggerContainer)
  staggerItem: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  },
  
  // Rotate animations
  rotateIn: {
    initial: { opacity: 0, rotate: -10 },
    animate: { opacity: 1, rotate: 0 },
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
  },
  
  // Blur animations
  blurIn: {
    initial: { opacity: 0, filter: 'blur(10px)' },
    animate: { opacity: 1, filter: 'blur(0px)' },
    transition: { duration: 0.6 },
  },
} as const;

export type AnimationPresetName = keyof typeof animationPresets;

/**
 * Get animation preset with optional delay
 */
export function getAnimationPreset(
  name: AnimationPresetName,
  delay: number = 0
): AnimationPreset {
  const preset = animationPresets[name];
  return {
    ...preset,
    transition: {
      ...preset.transition,
      delay,
    },
  };
}

/**
 * Create stagger animation for multiple items
 */
export function createStaggerAnimation(
  itemCount: number,
  baseDelay: number = 0,
  staggerDelay: number = 0.1
): AnimationPreset[] {
  return Array.from({ length: itemCount }, (_, index) => ({
    ...animationPresets.fadeInUp,
    transition: {
      ...animationPresets.fadeInUp.transition,
      delay: baseDelay + index * staggerDelay,
    },
  }));
}
