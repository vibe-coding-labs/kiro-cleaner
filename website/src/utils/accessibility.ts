/**
 * Accessibility Utilities
 * 
 * Provides utilities for improving accessibility across the application.
 * Includes focus management, reduced motion support, and ARIA helpers.
 * 
 * Requirements: 1.2, 7.5
 */

import { prefersReducedMotion } from './performanceDetection';

/**
 * Get focus visible styles for interactive elements
 * Ensures focus indicators are always visible and meet WCAG standards
 */
export const getFocusVisibleStyles = () => ({
  '&:focus-visible': {
    outline: '3px solid',
    outlineColor: 'primary.main',
    outlineOffset: '2px',
    borderRadius: '4px',
  },
  '&:focus:not(:focus-visible)': {
    outline: 'none',
  },
});

/**
 * Get animation styles that respect reduced motion preference
 * 
 * @param animationStyles - Animation styles to apply
 * @param fallbackStyles - Styles to use when reduced motion is preferred
 * @returns Conditional styles based on user preference
 */
export const getAccessibleAnimation = (
  animationStyles: Record<string, any>,
  fallbackStyles: Record<string, any> = {}
) => {
  const shouldReduceMotion = prefersReducedMotion();
  
  if (shouldReduceMotion) {
    return {
      ...fallbackStyles,
      transition: 'none',
      animation: 'none',
    };
  }
  
  return animationStyles;
};

/**
 * Get high contrast mode styles
 * Ensures content is visible in high contrast mode
 */
export const getHighContrastStyles = () => ({
  '@media (prefers-contrast: high)': {
    borderWidth: '2px',
    borderStyle: 'solid',
  },
});

/**
 * Generate ARIA label for animated elements
 * Helps screen readers understand animated content
 * 
 * @param label - Descriptive label for the element
 * @param isAnimating - Whether the element is currently animating
 * @returns ARIA attributes object
 */
export const getAnimationAriaProps = (label: string, isAnimating: boolean = false) => ({
  'aria-label': label,
  'aria-live': isAnimating ? 'polite' : 'off',
  'aria-busy': isAnimating,
});

/**
 * Get skip link styles
 * Provides accessible navigation for keyboard users
 */
export const getSkipLinkStyles = () => ({
  position: 'absolute',
  left: '-9999px',
  zIndex: 999,
  padding: '1rem',
  backgroundColor: 'background.paper',
  color: 'text.primary',
  textDecoration: 'none',
  '&:focus': {
    left: '1rem',
    top: '1rem',
  },
});

/**
 * Check if high contrast mode is enabled
 */
export const isHighContrastMode = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }
  
  const mediaQuery = window.matchMedia('(prefers-contrast: high)');
  return mediaQuery.matches;
};

/**
 * Get color contrast ratio between two colors
 * Used to ensure WCAG compliance
 * 
 * @param foreground - Foreground color (hex)
 * @param background - Background color (hex)
 * @returns Contrast ratio
 */
export const getContrastRatio = (foreground: string, background: string): number => {
  const getLuminance = (color: string): number => {
    // Remove # if present
    const hex = color.replace('#', '');
    
    // Convert to RGB
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;
    
    // Calculate relative luminance
    const [rs, gs, bs] = [r, g, b].map(c => {
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };
  
  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);
  
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  return (lighter + 0.05) / (darker + 0.05);
};

/**
 * Check if color combination meets WCAG AA standards
 * 
 * @param foreground - Foreground color (hex)
 * @param background - Background color (hex)
 * @param isLargeText - Whether the text is large (18pt+ or 14pt+ bold)
 * @returns Whether the combination meets WCAG AA
 */
export const meetsWCAGAA = (
  foreground: string,
  background: string,
  isLargeText: boolean = false
): boolean => {
  const ratio = getContrastRatio(foreground, background);
  return isLargeText ? ratio >= 3 : ratio >= 4.5;
};

/**
 * Check if color combination meets WCAG AAA standards
 * 
 * @param foreground - Foreground color (hex)
 * @param background - Background color (hex)
 * @param isLargeText - Whether the text is large (18pt+ or 14pt+ bold)
 * @returns Whether the combination meets WCAG AAA
 */
export const meetsWCAGAAA = (
  foreground: string,
  background: string,
  isLargeText: boolean = false
): boolean => {
  const ratio = getContrastRatio(foreground, background);
  return isLargeText ? ratio >= 4.5 : ratio >= 7;
};

/**
 * Keyboard navigation helpers
 */
export const keyboardNavigation = {
  /**
   * Handle keyboard navigation for a list of items
   */
  handleArrowKeys: (
    event: KeyboardEvent,
    currentIndex: number,
    itemCount: number,
    onIndexChange: (newIndex: number) => void
  ) => {
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        event.preventDefault();
        onIndexChange((currentIndex + 1) % itemCount);
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        event.preventDefault();
        onIndexChange((currentIndex - 1 + itemCount) % itemCount);
        break;
      case 'Home':
        event.preventDefault();
        onIndexChange(0);
        break;
      case 'End':
        event.preventDefault();
        onIndexChange(itemCount - 1);
        break;
    }
  },
  
  /**
   * Trap focus within a container
   */
  trapFocus: (container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
    
    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;
      
      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };
    
    container.addEventListener('keydown', handleTabKey as any);
    
    return () => {
      container.removeEventListener('keydown', handleTabKey as any);
    };
  },
};

/**
 * Screen reader utilities
 */
export const screenReader = {
  /**
   * Announce a message to screen readers
   */
  announce: (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.position = 'absolute';
    announcement.style.left = '-9999px';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  },
};
