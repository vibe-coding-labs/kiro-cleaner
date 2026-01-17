/**
 * Feature detection utilities for progressive enhancement
 * Simplified for flat design - glassmorphism utilities removed
 */

export const supportsContainerQueries = (): boolean => {
  if (typeof window === 'undefined') return false;
  return CSS.supports('container-type', 'inline-size');
};

export const supportsViewTransitions = (): boolean => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return false;
  return 'startViewTransition' in document;
};
