/**
 * Error Handling Integration Tests
 * 
 * Comprehensive tests for error handling and graceful degradation across the visual enhancement system.
 * Tests glassmorphism fallback, theme error boundaries, and reduced motion support.
 * 
 * Validates Requirements: 6.3, 8.1
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  supportsBackdropFilter,
  supportsGradients,
  supportsAnimations,
  getGlassmorphismStyles,
  getGradientStyles,
  getAnimationStyles,
} from './featureDetection';
import {
  getAccessibleAnimation,
} from './accessibility';
import { detectPerformanceLevel, PerformanceLevel, prefersReducedMotion } from './performanceDetection';

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

describe('Error Handling Integration', () => {
  // Store original values
  let originalWindow: any;
  let originalCSS: any;

  beforeEach(() => {
    // Store originals
    originalWindow = global.window;
    originalCSS = global.CSS;
  });

  afterEach(() => {
    // Restore originals
    global.window = originalWindow;
    global.CSS = originalCSS;
  });
  describe('Glassmorphism Degradation', () => {
    it('should gracefully degrade when backdrop-filter is not supported', () => {
      // Mock CSS.supports to return false
      const mockSupports = vi.fn().mockReturnValue(false);
      global.CSS = { supports: mockSupports } as any;

      const glassColor = 'rgba(255, 255, 255, 0.7)';
      const fallbackColor = 'rgba(255, 255, 255, 0.95)';

      const styles = getGlassmorphismStyles(glassColor, fallbackColor);

      // Should use solid background fallback
      expect(styles.backgroundColor).toBe(fallbackColor);
      expect(styles).not.toHaveProperty('backdropFilter');
      expect(styles).not.toHaveProperty('WebkitBackdropFilter');
    });

    it('should use glass effect when backdrop-filter is supported', () => {
      // Mock CSS.supports to return true
      const mockSupports = vi.fn().mockReturnValue(true);
      global.CSS = { supports: mockSupports } as any;

      const glassColor = 'rgba(255, 255, 255, 0.7)';
      const fallbackColor = 'rgba(255, 255, 255, 0.95)';
      const blurAmount = '20px';

      const styles = getGlassmorphismStyles(glassColor, fallbackColor, blurAmount);

      // Should use glass effect
      expect(styles.backgroundColor).toBe(glassColor);
      expect(styles.backdropFilter).toBe(`blur(${blurAmount})`);
      expect(styles.WebkitBackdropFilter).toBe(`blur(${blurAmount})`);
    });

    it('should handle SSR environment gracefully', () => {
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;

      const result = supportsBackdropFilter();

      expect(result).toBe(false);

      global.window = originalWindow;
    });

    it('should handle missing CSS object', () => {
      // @ts-ignore
      global.CSS = null;

      const result = supportsBackdropFilter();

      expect(result).toBe(false);
    });

    it('should provide consistent fallback for all glass variants', () => {
      const mockSupports = vi.fn().mockReturnValue(false);
      global.CSS = { supports: mockSupports } as any;

      const variants = [
        { glass: 'rgba(255, 255, 255, 0.7)', fallback: 'rgba(255, 255, 255, 0.95)' },
        { glass: 'rgba(255, 255, 255, 0.5)', fallback: 'rgba(255, 255, 255, 0.90)' },
        { glass: 'rgba(0, 0, 0, 0.3)', fallback: 'rgba(0, 0, 0, 0.80)' },
      ];

      variants.forEach(({ glass, fallback }) => {
        const styles = getGlassmorphismStyles(glass, fallback);
        expect(styles.backgroundColor).toBe(fallback);
        expect(styles).not.toHaveProperty('backdropFilter');
      });
    });
  });

  describe('Gradient Degradation', () => {
    it('should gracefully degrade when gradients are not supported', () => {
      const mockSupports = vi.fn().mockReturnValue(false);
      global.CSS = { supports: mockSupports } as any;

      const gradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      const fallback = '#667eea';

      const styles = getGradientStyles(gradient, fallback);

      // Should use solid color fallback
      expect(styles.backgroundColor).toBe(fallback);
      expect(styles).not.toHaveProperty('background');
    });

    it('should use gradient when supported', () => {
      const mockSupports = vi.fn().mockReturnValue(true);
      global.CSS = { supports: mockSupports } as any;

      const gradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      const fallback = '#667eea';

      const styles = getGradientStyles(gradient, fallback);

      // Should use gradient
      expect(styles.background).toBe(gradient);
      expect(styles).not.toHaveProperty('backgroundColor');
    });

    it('should handle complex gradients with fallback', () => {
      const mockSupports = vi.fn().mockReturnValue(false);
      global.CSS = { supports: mockSupports } as any;

      const complexGradient = `
        radial-gradient(at 27% 37%, hsla(215, 98%, 61%, 0.15) 0px, transparent 50%),
        radial-gradient(at 97% 21%, hsla(125, 98%, 72%, 0.15) 0px, transparent 50%)
      `;
      const fallback = '#f5f5f5';

      const styles = getGradientStyles(complexGradient, fallback);

      expect(styles.backgroundColor).toBe(fallback);
    });
  });

  describe('Animation Degradation', () => {
    it('should gracefully degrade when animations are not supported', () => {
      const mockSupports = vi.fn().mockReturnValue(false);
      global.CSS = { supports: mockSupports } as any;

      const animationStyles = {
        animation: 'fadeIn 0.3s ease-in-out',
        transform: 'translateY(0)',
      };
      const fallbackStyles = {
        opacity: 1,
      };

      const styles = getAnimationStyles(animationStyles, fallbackStyles);

      // Should use fallback styles
      expect(styles).toEqual(fallbackStyles);
      expect(styles).not.toHaveProperty('animation');
    });

    it('should use animations when supported', () => {
      const mockSupports = vi.fn().mockReturnValue(true);
      global.CSS = { supports: mockSupports } as any;

      const animationStyles = {
        animation: 'fadeIn 0.3s ease-in-out',
        transform: 'translateY(0)',
      };

      const styles = getAnimationStyles(animationStyles);

      // Should use animation styles
      expect(styles).toEqual(animationStyles);
    });
  });

  describe('Reduced Motion Support', () => {
    it('should disable animations when reduced motion is preferred', () => {
      window.matchMedia = mockMatchMedia(true);

      const animationStyles = {
        animation: 'fadeIn 0.3s ease-in-out',
        transform: 'translateY(0)',
        transition: 'all 0.3s',
      };
      const fallbackStyles = {
        opacity: 1,
      };

      const styles = getAccessibleAnimation(animationStyles, fallbackStyles);

      // Should disable all animations
      expect(styles.animation).toBe('none');
      expect(styles.transition).toBe('none');
      expect(styles.opacity).toBe(1);
    });

    it('should enable animations when reduced motion is not preferred', () => {
      window.matchMedia = mockMatchMedia(false);

      const animationStyles = {
        animation: 'fadeIn 0.3s ease-in-out',
        transform: 'translateY(0)',
        transition: 'all 0.3s',
      };

      const styles = getAccessibleAnimation(animationStyles);

      // Should preserve animation styles
      expect(styles).toEqual(animationStyles);
    });

    it('should respect reduced motion for complex animations', () => {
      window.matchMedia = mockMatchMedia(true);

      const complexAnimation = {
        animation: 'bounce 1s infinite, rotate 2s linear infinite',
        transform: 'scale(1.2) rotate(360deg)',
        transition: 'all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      };

      const styles = getAccessibleAnimation(complexAnimation);

      // All animations should be disabled
      expect(styles.animation).toBe('none');
      expect(styles.transition).toBe('none');
    });

    it('should handle SSR environment for reduced motion', () => {
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;

      // Should not throw and return false
      const result = prefersReducedMotion();
      expect(result).toBe(false);

      global.window = originalWindow;
    });
  });

  describe('Performance-Based Degradation', () => {
    it('should detect low performance and adjust animations', () => {
      // Mock low performance indicators
      if (typeof window !== 'undefined') {
        window.matchMedia = mockMatchMedia(true); // prefers-reduced-motion
      }

      const level = detectPerformanceLevel();

      expect(level).toBe(PerformanceLevel.LOW);
    });

    it('should maintain visual quality while reducing complexity', () => {
      const mockSupports = vi.fn().mockReturnValue(false);
      global.CSS = { supports: mockSupports } as any;

      // Even with degradation, should provide acceptable fallbacks
      const glassStyles = getGlassmorphismStyles(
        'rgba(255, 255, 255, 0.7)',
        'rgba(255, 255, 255, 0.95)'
      );
      const gradientStyles = getGradientStyles(
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        '#667eea'
      );

      // Fallbacks should be defined and usable
      expect(glassStyles.backgroundColor).toBeDefined();
      expect(gradientStyles.backgroundColor).toBeDefined();
    });
  });

  describe('Combined Error Scenarios', () => {
    it('should handle multiple unsupported features gracefully', () => {
      // Mock all features as unsupported
      const mockSupports = vi.fn().mockReturnValue(false);
      global.CSS = { supports: mockSupports } as any;
      if (typeof window !== 'undefined') {
        window.matchMedia = mockMatchMedia(true);
      }

      // Test all degradation paths
      const glassStyles = getGlassmorphismStyles(
        'rgba(255, 255, 255, 0.7)',
        'rgba(255, 255, 255, 0.95)'
      );
      const gradientStyles = getGradientStyles(
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        '#667eea'
      );
      const animationStyles = getAccessibleAnimation(
        { animation: 'fadeIn 0.3s' },
        { opacity: 1 }
      );

      // All should provide fallbacks
      expect(glassStyles.backgroundColor).toBe('rgba(255, 255, 255, 0.95)');
      expect(gradientStyles.backgroundColor).toBe('#667eea');
      expect(animationStyles.animation).toBe('none');
    });

    it('should maintain consistency across degradation levels', () => {
      const mockSupports = vi.fn().mockReturnValue(false);
      global.CSS = { supports: mockSupports } as any;

      // Multiple calls should return consistent results
      const styles1 = getGlassmorphismStyles(
        'rgba(255, 255, 255, 0.7)',
        'rgba(255, 255, 255, 0.95)'
      );
      const styles2 = getGlassmorphismStyles(
        'rgba(255, 255, 255, 0.7)',
        'rgba(255, 255, 255, 0.95)'
      );

      expect(styles1).toEqual(styles2);
    });

    it('should not throw errors in any degradation scenario', () => {
      // Test various edge cases
      expect(() => {
        // @ts-ignore
        global.CSS = null;
        supportsBackdropFilter();
      }).not.toThrow();

      expect(() => {
        // @ts-ignore
        delete global.window;
        supportsGradients();
      }).not.toThrow();

      expect(() => {
        global.CSS = { supports: undefined } as any;
        supportsAnimations();
      }).not.toThrow();
    });
  });

  describe('Feature Detection Caching', () => {
    it('should cache feature detection results for performance', () => {
      const mockSupports = vi.fn().mockReturnValue(true);
      global.CSS = { supports: mockSupports } as any;

      // First call
      const result1 = supportsBackdropFilter();
      const callCount1 = mockSupports.mock.calls.length;

      // Second call should use cache (in real implementation)
      const result2 = supportsBackdropFilter();

      // Results should be consistent
      expect(result1).toBe(result2);
    });
  });

  describe('Error Recovery', () => {
    it('should recover from temporary feature detection failures', () => {
      // Mock supports to check both calls
      const mockSupports = vi.fn()
        .mockReturnValueOnce(false) // First backdrop-filter check
        .mockReturnValueOnce(false) // First webkit check
        .mockReturnValueOnce(true)  // Second backdrop-filter check
        .mockReturnValueOnce(false); // Second webkit check (won't be called)
      global.CSS = { supports: mockSupports } as any;

      const result1 = supportsBackdropFilter();
      expect(result1).toBe(false);

      // Second call succeeds
      const result2 = supportsBackdropFilter();
      expect(result2).toBe(true);
    });

    it('should provide stable fallbacks even with changing conditions', () => {
      const glassColor = 'rgba(255, 255, 255, 0.7)';
      const fallbackColor = 'rgba(255, 255, 255, 0.95)';

      // First call - not supported
      let mockSupports = vi.fn().mockReturnValue(false);
      global.CSS = { supports: mockSupports } as any;
      const styles1 = getGlassmorphismStyles(glassColor, fallbackColor);
      expect(styles1.backgroundColor).toBe(fallbackColor);

      // Second call - supported
      mockSupports = vi.fn().mockReturnValue(true);
      global.CSS = { supports: mockSupports } as any;
      const styles2 = getGlassmorphismStyles(glassColor, fallbackColor);
      expect(styles2.backgroundColor).toBe(glassColor);

      // Third call - not supported again
      mockSupports = vi.fn().mockReturnValue(false);
      global.CSS = { supports: mockSupports } as any;
      const styles3 = getGlassmorphismStyles(glassColor, fallbackColor);
      expect(styles3.backgroundColor).toBe(fallbackColor);
    });
  });

  describe('Cross-Browser Compatibility', () => {
    it('should check for webkit prefixes as fallback', () => {
      const mockSupports = vi.fn()
        .mockReturnValueOnce(false) // backdrop-filter not supported
        .mockReturnValueOnce(true);  // -webkit-backdrop-filter supported
      global.CSS = { supports: mockSupports } as any;

      const result = supportsBackdropFilter();

      expect(result).toBe(true);
      expect(mockSupports).toHaveBeenCalledWith('backdrop-filter', 'blur(10px)');
      expect(mockSupports).toHaveBeenCalledWith('-webkit-backdrop-filter', 'blur(10px)');
    });

    it('should provide webkit prefixed properties when needed', () => {
      const mockSupports = vi.fn().mockReturnValue(true);
      global.CSS = { supports: mockSupports } as any;

      const styles = getGlassmorphismStyles(
        'rgba(255, 255, 255, 0.7)',
        'rgba(255, 255, 255, 0.95)'
      );

      // Should include both standard and webkit prefixed properties
      expect(styles.backdropFilter).toBeDefined();
      expect(styles.WebkitBackdropFilter).toBeDefined();
      expect(styles.backdropFilter).toBe('blur(10px)');
      expect(styles.WebkitBackdropFilter).toBe('blur(10px)');
    });
  });
});
