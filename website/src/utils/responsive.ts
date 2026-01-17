/**
 * Responsive Utilities
 * 
 * Provides utilities for responsive design adjustments across different screen sizes.
 * Includes shadow intensity, spacing, and font size adjustments for mobile devices.
 */

import { shadowTokens } from '../theme/tokens/shadows';
import { spacingTokens } from '../theme/tokens/spacing';

/**
 * Get responsive shadow based on screen size
 * Reduces shadow intensity on mobile devices for better performance
 * 
 * @param desktopShadow - Shadow to use on desktop
 * @param mobileShadow - Shadow to use on mobile (optional, defaults to lighter version)
 * @returns Responsive shadow object for MUI sx prop
 */
export const getResponsiveShadow = (
  desktopShadow: string,
  mobileShadow?: string
) => ({
  xs: mobileShadow || shadowTokens.elevation.sm,
  md: desktopShadow,
});

/**
 * Get responsive spacing based on screen size
 * Reduces spacing on mobile devices for better space utilization
 * 
 * @param desktopSpacing - Spacing to use on desktop (in spacing units)
 * @param mobileSpacing - Spacing to use on mobile (optional, defaults to 75% of desktop)
 * @returns Responsive spacing object for MUI sx prop
 */
export const getResponsiveSpacing = (
  desktopSpacing: number,
  mobileSpacing?: number
) => ({
  xs: mobileSpacing !== undefined ? mobileSpacing : Math.max(1, Math.floor(desktopSpacing * 0.75)),
  md: desktopSpacing,
});

/**
 * Get responsive font size based on screen size
 * Adjusts font sizes for better readability on mobile devices
 * 
 * @param desktopSize - Font size to use on desktop (in rem)
 * @param mobileSize - Font size to use on mobile (optional, defaults to 85% of desktop)
 * @returns Responsive font size object for MUI sx prop
 */
export const getResponsiveFontSize = (
  desktopSize: string,
  mobileSize?: string
) => {
  const desktopValue = parseFloat(desktopSize);
  const defaultMobileSize = `${(desktopValue * 0.85).toFixed(2)}rem`;
  
  return {
    xs: mobileSize || defaultMobileSize,
    md: desktopSize,
  };
};

/**
 * Responsive breakpoints for consistent usage across components
 */
export const breakpoints = {
  mobile: 0,
  tablet: 600,
  desktop: 960,
  wide: 1280,
} as const;

/**
 * Check if current viewport is mobile
 * Useful for conditional rendering or logic
 */
export const isMobile = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < breakpoints.tablet;
};

/**
 * Check if current viewport is tablet
 */
export const isTablet = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= breakpoints.tablet && window.innerWidth < breakpoints.desktop;
};

/**
 * Check if current viewport is desktop
 */
export const isDesktop = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= breakpoints.desktop;
};

/**
 * Get responsive padding for containers
 * Provides consistent padding across different screen sizes
 */
export const getResponsiveContainerPadding = () => ({
  xs: spacingTokens[4], // 32px on mobile
  sm: spacingTokens[6], // 48px on tablet
  md: spacingTokens[8], // 64px on desktop
});

/**
 * Get responsive border radius
 * Slightly reduces border radius on mobile for better space utilization
 */
export const getResponsiveBorderRadius = (desktopRadius: number) => ({
  xs: Math.max(8, desktopRadius * 0.75),
  md: desktopRadius,
});

/**
 * Responsive shadow intensity levels
 * Pre-configured shadow pairs for common use cases
 */
export const responsiveShadows = {
  card: {
    xs: shadowTokens.elevation.sm,
    md: shadowTokens.elevation.md,
  },
  cardHover: {
    xs: shadowTokens.elevation.md,
    md: shadowTokens.elevation.xl,
  },
  hero: {
    xs: shadowTokens.elevation.lg,
    md: shadowTokens.elevation['2xl'],
  },
  navigation: {
    xs: shadowTokens.elevation.xs,
    md: shadowTokens.elevation.sm,
  },
} as const;
