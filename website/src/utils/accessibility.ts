/**
 * Accessibility utility functions
 */

export const getFocusVisibleStyles = (color: string = '#3498db') => ({
  '&:focus-visible': {
    outline: `2px solid ${color}`,
    outlineOffset: '2px',
  },
});

export const getAccessibleAnimation = (prefersReducedMotion: boolean = false) => {
  if (prefersReducedMotion) {
    return {
      transition: 'none',
      animation: 'none',
    };
  }
  return {};
};

export const getAriaLabel = (label: string) => ({
  'aria-label': label,
});

export const getAriaHidden = (hidden: boolean = true) => ({
  'aria-hidden': hidden,
});
