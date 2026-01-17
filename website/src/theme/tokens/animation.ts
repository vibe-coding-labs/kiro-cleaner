/**
 * Modern Animation Tokens
 * 
 * Consistent animation timing and easing functions
 * for smooth, performant transitions.
 */

export const animationTokens = {
  // Duration Scale (in milliseconds)
  duration: {
    instant: 0,
    fastest: 100,
    faster: 150,
    fast: 200,
    normal: 250,
    slow: 300,
    slower: 375,
    slowest: 500,
    
    // Semantic durations
    microInteraction: 150,
    hover: 200,
    transition: 250,
    complex: 375,
    pageTransition: 500,
  },
  
  // Easing Functions
  easing: {
    // Standard easing for most transitions
    standard: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
    
    // Deceleration curve for entering elements
    decelerate: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
    
    // Acceleration curve for exiting elements
    accelerate: 'cubic-bezier(0.4, 0.0, 1, 1)',
    
    // Sharp curve for elements that may return
    sharp: 'cubic-bezier(0.4, 0.0, 0.6, 1)',
    
    // Smooth curve for natural motion
    smooth: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
    
    // Bounce effect for playful interactions
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
  
  // Common transition strings
  transitions: {
    fast: 'all 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
    normal: 'all 250ms cubic-bezier(0.4, 0.0, 0.2, 1)',
    slow: 'all 300ms cubic-bezier(0.4, 0.0, 0.2, 1)',
    
    // Specific property transitions
    color: 'color 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
    background: 'background-color 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
    transform: 'transform 250ms cubic-bezier(0.4, 0.0, 0.2, 1)',
    opacity: 'opacity 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
    shadow: 'box-shadow 250ms cubic-bezier(0.4, 0.0, 0.2, 1)',
    
    // Combined transitions
    hover: 'transform 200ms cubic-bezier(0.4, 0.0, 0.2, 1), background-color 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
    card: 'transform 250ms cubic-bezier(0.4, 0.0, 0.2, 1), box-shadow 250ms cubic-bezier(0.4, 0.0, 0.2, 1), border-color 250ms cubic-bezier(0.4, 0.0, 0.2, 1)',
  },
} as const;

// Helper function to create custom transitions
export const createTransition = (
  properties: string[],
  duration: keyof typeof animationTokens.duration = 'normal',
  easing: keyof typeof animationTokens.easing = 'standard'
): string => {
  const durationMs = animationTokens.duration[duration];
  const easingFn = animationTokens.easing[easing];
  
  return properties
    .map(prop => `${prop} ${durationMs}ms ${easingFn}`)
    .join(', ');
};

// Type-safe animation access
export type AnimationTokens = typeof animationTokens;
export type Duration = keyof typeof animationTokens.duration;
export type Easing = keyof typeof animationTokens.easing;
