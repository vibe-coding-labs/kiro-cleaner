/**
 * Responsive utility functions
 */

export const getResponsiveSpacing = (desktop: number, mobile: number) => ({
  xs: mobile,
  md: desktop,
});

export const getResponsiveFontSize = (desktop: string, mobile: string) => ({
  xs: mobile,
  md: desktop,
});

export const breakpoints = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
} as const;
