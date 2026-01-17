/**
 * Accessibility Utilities Tests
 * 
 * Tests for accessibility features including:
 * - Reduced motion support
 * - Focus management
 * - Color contrast validation
 * - ARIA helpers
 * 
 * Validates Requirements: 6.3, 8.1
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getFocusVisibleStyles,
  getAccessibleAnimation,
  getHighContrastStyles,
  getAnimationAriaProps,
  getSkipLinkStyles,
  isHighContrastMode,
  getContrastRatio,
  meetsWCAGAA,
  meetsWCAGAAA,
  keyboardNavigation,
  screenReader,
} from './accessibility';

// Mock window.matchMedia
const mockMatchMedia = (matches: boolean) => {
  return vi.fn().mockImplementation((query) => ({
    matches,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
};

describe('Accessibility Utilities', () => {
  describe('Reduced Motion Support', () => {
    beforeEach(() => {
      // Reset matchMedia mock
      if (typeof window !== 'undefined') {
        window.matchMedia = mockMatchMedia(false);
      }
    });

    it('should return animation styles when reduced motion is not preferred', () => {
      // Mock reduced motion as false
      window.matchMedia = mockMatchMedia(false);

      const animationStyles = {
        animation: 'fadeIn 0.3s ease-in-out',
        transform: 'translateY(0)',
        transition: 'all 0.3s',
      };
      const fallbackStyles = {
        opacity: 1,
      };

      const result = getAccessibleAnimation(animationStyles, fallbackStyles);

      expect(result).toEqual(animationStyles);
      expect(result.animation).toBe('fadeIn 0.3s ease-in-out');
      expect(result.transition).toBe('all 0.3s');
    });

    it('should return fallback styles when reduced motion is preferred', () => {
      // Mock reduced motion as true
      window.matchMedia = mockMatchMedia(true);

      const animationStyles = {
        animation: 'fadeIn 0.3s ease-in-out',
        transform: 'translateY(0)',
        transition: 'all 0.3s',
      };
      const fallbackStyles = {
        opacity: 1,
        transform: 'none',
      };

      const result = getAccessibleAnimation(animationStyles, fallbackStyles);

      expect(result.animation).toBe('none');
      expect(result.transition).toBe('none');
      expect(result.opacity).toBe(1);
    });

    it('should disable all animations when reduced motion is preferred', () => {
      window.matchMedia = mockMatchMedia(true);

      const animationStyles = {
        animation: 'slideIn 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: 'scale(1)',
        transition: 'transform 0.3s ease',
      };

      const result = getAccessibleAnimation(animationStyles);

      expect(result.animation).toBe('none');
      expect(result.transition).toBe('none');
    });

    it('should preserve fallback styles when reduced motion is preferred', () => {
      window.matchMedia = mockMatchMedia(true);

      const animationStyles = {
        animation: 'bounce 1s infinite',
      };
      const fallbackStyles = {
        opacity: 1,
        visibility: 'visible',
        display: 'block',
      };

      const result = getAccessibleAnimation(animationStyles, fallbackStyles);

      expect(result.opacity).toBe(1);
      expect(result.visibility).toBe('visible');
      expect(result.display).toBe('block');
      expect(result.animation).toBe('none');
      expect(result.transition).toBe('none');
    });

    it('should handle empty fallback styles', () => {
      window.matchMedia = mockMatchMedia(true);

      const animationStyles = {
        animation: 'fadeIn 0.3s',
      };

      const result = getAccessibleAnimation(animationStyles, {});

      expect(result.animation).toBe('none');
      expect(result.transition).toBe('none');
    });

    it('should handle complex animation properties', () => {
      window.matchMedia = mockMatchMedia(false);

      const animationStyles = {
        animation: 'fadeIn 0.3s ease-in-out, slideUp 0.5s ease',
        transform: 'translateY(0) scale(1) rotate(0deg)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: 1,
      };

      const result = getAccessibleAnimation(animationStyles);

      expect(result).toEqual(animationStyles);
    });
  });

  describe('Focus Management', () => {
    it('should provide focus visible styles', () => {
      const styles = getFocusVisibleStyles();

      expect(styles).toHaveProperty('&:focus-visible');
      expect(styles['&:focus-visible']).toHaveProperty('outline');
      expect(styles['&:focus-visible']).toHaveProperty('outlineColor');
      expect(styles['&:focus-visible']).toHaveProperty('outlineOffset');
    });

    it('should hide focus outline for non-keyboard focus', () => {
      const styles = getFocusVisibleStyles();

      expect(styles).toHaveProperty('&:focus:not(:focus-visible)');
      expect(styles['&:focus:not(:focus-visible)'].outline).toBe('none');
    });

    it('should provide skip link styles', () => {
      const styles = getSkipLinkStyles();

      expect(styles.position).toBe('absolute');
      expect(styles.left).toBe('-9999px');
      expect(styles).toHaveProperty('&:focus');
    });
  });

  describe('High Contrast Mode', () => {
    it('should detect high contrast mode', () => {
      window.matchMedia = mockMatchMedia(false);
      expect(isHighContrastMode()).toBe(false);

      window.matchMedia = mockMatchMedia(true);
      expect(isHighContrastMode()).toBe(true);
    });

    it('should provide high contrast styles', () => {
      const styles = getHighContrastStyles();

      expect(styles).toHaveProperty('@media (prefers-contrast: high)');
      const highContrastStyles = styles['@media (prefers-contrast: high)'];
      expect(highContrastStyles.borderWidth).toBe('2px');
      expect(highContrastStyles.borderStyle).toBe('solid');
    });

    it('should handle missing window object', () => {
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;

      expect(isHighContrastMode()).toBe(false);

      global.window = originalWindow;
    });
  });

  describe('Color Contrast', () => {
    it('should calculate contrast ratio correctly', () => {
      // Black on white should have high contrast
      const blackOnWhite = getContrastRatio('#000000', '#ffffff');
      expect(blackOnWhite).toBe(21);

      // White on white should have no contrast
      const whiteOnWhite = getContrastRatio('#ffffff', '#ffffff');
      expect(whiteOnWhite).toBe(1);
    });

    it('should validate WCAG AA compliance for normal text', () => {
      // Black on white meets WCAG AA
      expect(meetsWCAGAA('#000000', '#ffffff', false)).toBe(true);

      // Light gray on white does not meet WCAG AA
      expect(meetsWCAGAA('#cccccc', '#ffffff', false)).toBe(false);
    });

    it('should validate WCAG AA compliance for large text', () => {
      // Large text has lower contrast requirement (3:1)
      const ratio = getContrastRatio('#767676', '#ffffff');
      
      // Should meet AA for large text but not normal text
      expect(meetsWCAGAA('#767676', '#ffffff', true)).toBe(ratio >= 3);
      expect(meetsWCAGAA('#767676', '#ffffff', false)).toBe(ratio >= 4.5);
    });

    it('should validate WCAG AAA compliance', () => {
      // Black on white meets WCAG AAA
      expect(meetsWCAGAAA('#000000', '#ffffff', false)).toBe(true);

      // Medium gray on white may not meet WCAG AAA
      const ratio = getContrastRatio('#595959', '#ffffff');
      expect(meetsWCAGAAA('#595959', '#ffffff', false)).toBe(ratio >= 7);
    });

    it('should handle color formats correctly', () => {
      // Test with and without # prefix
      const ratio1 = getContrastRatio('#000000', '#ffffff');
      const ratio2 = getContrastRatio('000000', 'ffffff');
      
      expect(ratio1).toBe(ratio2);
    });

    it('should calculate contrast for brand colors', () => {
      // Test common brand color combinations
      const primaryOnWhite = getContrastRatio('#0070f3', '#ffffff');
      expect(primaryOnWhite).toBeGreaterThan(4.5);

      const darkOnLight = getContrastRatio('#1a1a1a', '#f5f5f5');
      expect(darkOnLight).toBeGreaterThan(4.5);
    });
  });

  describe('ARIA Helpers', () => {
    it('should generate ARIA props for animated elements', () => {
      const props = getAnimationAriaProps('Loading content', false);

      expect(props['aria-label']).toBe('Loading content');
      expect(props['aria-live']).toBe('off');
      expect(props['aria-busy']).toBe(false);
    });

    it('should set aria-live to polite when animating', () => {
      const props = getAnimationAriaProps('Loading content', true);

      expect(props['aria-live']).toBe('polite');
      expect(props['aria-busy']).toBe(true);
    });

    it('should handle different labels', () => {
      const props1 = getAnimationAriaProps('Saving changes');
      const props2 = getAnimationAriaProps('Loading data');

      expect(props1['aria-label']).toBe('Saving changes');
      expect(props2['aria-label']).toBe('Loading data');
    });
  });

  describe('Keyboard Navigation', () => {
    it('should handle arrow down navigation', () => {
      const onIndexChange = vi.fn();
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      
      keyboardNavigation.handleArrowKeys(event, 0, 5, onIndexChange);

      expect(onIndexChange).toHaveBeenCalledWith(1);
    });

    it('should handle arrow up navigation', () => {
      const onIndexChange = vi.fn();
      const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
      
      keyboardNavigation.handleArrowKeys(event, 2, 5, onIndexChange);

      expect(onIndexChange).toHaveBeenCalledWith(1);
    });

    it('should wrap around at the end', () => {
      const onIndexChange = vi.fn();
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      
      keyboardNavigation.handleArrowKeys(event, 4, 5, onIndexChange);

      expect(onIndexChange).toHaveBeenCalledWith(0);
    });

    it('should wrap around at the beginning', () => {
      const onIndexChange = vi.fn();
      const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
      
      keyboardNavigation.handleArrowKeys(event, 0, 5, onIndexChange);

      expect(onIndexChange).toHaveBeenCalledWith(4);
    });

    it('should handle Home key', () => {
      const onIndexChange = vi.fn();
      const event = new KeyboardEvent('keydown', { key: 'Home' });
      
      keyboardNavigation.handleArrowKeys(event, 3, 5, onIndexChange);

      expect(onIndexChange).toHaveBeenCalledWith(0);
    });

    it('should handle End key', () => {
      const onIndexChange = vi.fn();
      const event = new KeyboardEvent('keydown', { key: 'End' });
      
      keyboardNavigation.handleArrowKeys(event, 1, 5, onIndexChange);

      expect(onIndexChange).toHaveBeenCalledWith(4);
    });

    it('should handle arrow right as arrow down', () => {
      const onIndexChange = vi.fn();
      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      
      keyboardNavigation.handleArrowKeys(event, 0, 5, onIndexChange);

      expect(onIndexChange).toHaveBeenCalledWith(1);
    });

    it('should handle arrow left as arrow up', () => {
      const onIndexChange = vi.fn();
      const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
      
      keyboardNavigation.handleArrowKeys(event, 2, 5, onIndexChange);

      expect(onIndexChange).toHaveBeenCalledWith(1);
    });
  });

  describe('Screen Reader', () => {
    it('should announce messages to screen readers', () => {
      // Mock document.body
      const mockElement = document.createElement('div');
      const appendChildSpy = vi.spyOn(document.body, 'appendChild');
      const removeChildSpy = vi.spyOn(document.body, 'removeChild');

      screenReader.announce('Test message', 'polite');

      expect(appendChildSpy).toHaveBeenCalled();
      
      // Wait for timeout
      setTimeout(() => {
        expect(removeChildSpy).toHaveBeenCalled();
      }, 1100);
    });

    it('should support assertive announcements', () => {
      const appendChildSpy = vi.spyOn(document.body, 'appendChild');

      screenReader.announce('Urgent message', 'assertive');

      expect(appendChildSpy).toHaveBeenCalled();
      const element = appendChildSpy.mock.calls[0][0] as HTMLElement;
      expect(element.getAttribute('aria-live')).toBe('assertive');
    });

    it('should default to polite announcements', () => {
      const appendChildSpy = vi.spyOn(document.body, 'appendChild');

      screenReader.announce('Normal message');

      expect(appendChildSpy).toHaveBeenCalled();
      const element = appendChildSpy.mock.calls[0][0] as HTMLElement;
      expect(element.getAttribute('aria-live')).toBe('polite');
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined window in SSR', () => {
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;

      expect(() => isHighContrastMode()).not.toThrow();
      expect(isHighContrastMode()).toBe(false);

      global.window = originalWindow;
    });

    it('should handle invalid color formats gracefully', () => {
      // Should not throw for invalid colors
      expect(() => getContrastRatio('invalid', '#ffffff')).not.toThrow();
    });

    it('should handle empty animation styles', () => {
      window.matchMedia = mockMatchMedia(false);

      const result = getAccessibleAnimation({}, {});

      expect(result).toEqual({});
    });

    it('should handle missing matchMedia', () => {
      const originalMatchMedia = window.matchMedia;
      // @ts-ignore
      delete window.matchMedia;

      expect(() => getAccessibleAnimation({ animation: 'test' })).not.toThrow();

      window.matchMedia = originalMatchMedia;
    });
  });

  describe('Integration with Performance Detection', () => {
    it('should respect reduced motion in animation system', () => {
      // When reduced motion is preferred
      window.matchMedia = mockMatchMedia(true);

      const complexAnimation = {
        animation: 'complexBounce 2s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        transform: 'scale(1.2) rotate(360deg)',
        transition: 'all 0.8s ease-in-out',
      };

      const result = getAccessibleAnimation(complexAnimation);

      // All animations should be disabled
      expect(result.animation).toBe('none');
      expect(result.transition).toBe('none');
    });

    it('should allow animations when reduced motion is not preferred', () => {
      window.matchMedia = mockMatchMedia(false);

      const animation = {
        animation: 'fadeIn 0.3s ease',
        transition: 'opacity 0.3s',
      };

      const result = getAccessibleAnimation(animation);

      // Animations should be preserved
      expect(result.animation).toBe('fadeIn 0.3s ease');
      expect(result.transition).toBe('opacity 0.3s');
    });
  });
});
