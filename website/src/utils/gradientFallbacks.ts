/**
 * Gradient fallback utilities for flat design
 */

export const getGradientWithFallback = (gradient: string, fallbackColor: string) => ({
  background: fallbackColor,
  backgroundImage: gradient,
});

export const getSolidColorFallback = (color: string) => ({
  background: color,
});
