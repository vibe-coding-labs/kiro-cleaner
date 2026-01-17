/**
 * Feature Detection Tests
 * 
 * Tests for browser feature detection and fallback mechanisms.
 * Validates Requirements: 6.3
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  supportsBackdropFilter,
  supportsGradients,
  supportsAnimations,
  getGlassmorphismStyles,
  getGradientStyles,
  getAnimationStyles,
  initializeFeatureDetection,
  getCachedFeatureSupport,
} from './featureDetection';

describe('Feature Detection', () => {
  describe('supportsBackdropFilter', () => {
    it('should return false when window is undefined', () => {
      // Simulate SSR environment
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;
      
      const result = supportsBackdropFilter();
      
      expect(result).toBe(false);
      
      // Restore window
      global.window = originalWindow;
    });

    it('should return false when CSS is undefined', () => {
      const originalCSS = global.CSS;
      // @ts-ignore
      delete global.CSS;
      
      const result = supportsBackdropFilter();
      
      expect(result).toBe(false);
      
      // Restore CSS
      global.CSS = originalCSS;
    });

    it('should check for backdrop-filter support', () => {
      const mockSupports = vi.fn().mockReturnValue(true);
      global.CSS = { supports: mockSupports } as any;
      
      supportsBackdropFilter();
      
      expect(mockSupports).toHaveBeenCalledWith('backdrop-filter', 'blur(10px)');
    });

    it('should check for -webkit-backdrop-filter as fallback', () => {
      const mockSupports = vi.fn()
        .mockReturnValueOnce(false) // backdrop-filter not supported
        .mockReturnValueOnce(true);  // -webkit-backdrop-filter supported
      global.CSS = { supports: mockSupports } as any;
      
      const result = supportsBackdropFilter();
      
      expect(result).toBe(true);
      expect(mockSupports).toHaveBeenCalledWith('-webkit-backdrop-filter', 'blur(10px)');
    });
  });

  describe('supportsGradients', () => {
    it('should return false when window is undefined', () => {
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;
      
      const result = supportsGradients();
      
      expect(result).toBe(false);
      
      global.window = originalWindow;
    });

    it('should check for gradient support', () => {
      const mockSupports = vi.fn().mockReturnValue(true);
      global.CSS = { supports: mockSupports } as any;
      
      supportsGradients();
      
      expect(mockSupports).toHaveBeenCalledWith('background', 'linear-gradient(red, blue)');
    });

    it('should check for -webkit-linear-gradient as fallback', () => {
      const mockSupports = vi.fn()
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(true);
      global.CSS = { supports: mockSupports } as any;
      
      const result = supportsGradients();
      
      expect(result).toBe(true);
      expect(mockSupports).toHaveBeenCalledWith('background', '-webkit-linear-gradient(red, blue)');
    });
  });

  describe('supportsAnimations', () => {
    it('should return false when window is undefined', () => {
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;
      
      const result = supportsAnimations();
      
      expect(result).toBe(false);
      
      global.window = originalWindow;
    });

    it('should check for animation support', () => {
      const mockSupports = vi.fn().mockReturnValue(true);
      global.CSS = { supports: mockSupports } as any;
      
      supportsAnimations();
      
      expect(mockSupports).toHaveBeenCalledWith('animation', 'test 1s');
    });
  });

  describe('getGlassmorphismStyles', () => {
    it('should return glass effect when backdrop-filter is supported', () => {
      const mockSupports = vi.fn().mockReturnValue(true);
      global.CSS = { supports: mockSupports } as any;
      
      const styles = getGlassmorphismStyles(
        'rgba(255, 255, 255, 0.7)',
        'rgba(255, 255, 255, 0.95)',
        '10px'
      );
      
      expect(styles).toEqual({
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      });
    });

    it('should return solid background when backdrop-filter is not supported', () => {
      const mockSupports = vi.fn().mockReturnValue(false);
      global.CSS = { supports: mockSupports } as any;
      
      const styles = getGlassmorphismStyles(
        'rgba(255, 255, 255, 0.7)',
        'rgba(255, 255, 255, 0.95)',
        '10px'
      );
      
      expect(styles).toEqual({
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
      });
      expect(styles).not.toHaveProperty('backdropFilter');
    });

    it('should use default blur amount when not specified', () => {
      const mockSupports = vi.fn().mockReturnValue(true);
      global.CSS = { supports: mockSupports } as any;
      
      const styles = getGlassmorphismStyles(
        'rgba(255, 255, 255, 0.7)',
        'rgba(255, 255, 255, 0.95)'
      );
      
      expect(styles.backdropFilter).toBe('blur(10px)');
    });

    it('should gracefully degrade for unsupported browsers', () => {
      const mockSupports = vi.fn().mockReturnValue(false);
      global.CSS = { supports: mockSupports } as any;
      
      const glassColor = 'rgba(255, 255, 255, 0.5)';
      const fallbackColor = 'rgba(255, 255, 255, 0.95)';
      
      const styles = getGlassmorphismStyles(glassColor, fallbackColor);
      
      // Should provide solid background fallback
      expect(styles.backgroundColor).toBe(fallbackColor);
      // Should not include backdrop-filter
      expect(styles).not.toHaveProperty('backdropFilter');
      expect(styles).not.toHaveProperty('WebkitBackdropFilter');
    });
  });

  describe('getGradientStyles', () => {
    it('should return gradient when supported', () => {
      const mockSupports = vi.fn().mockReturnValue(true);
      global.CSS = { supports: mockSupports } as any;
      
      const gradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      const fallback = '#667eea';
      
      const styles = getGradientStyles(gradient, fallback);
      
      expect(styles).toEqual({
        background: gradient,
      });
    });

    it('should return solid color when gradients not supported', () => {
      const mockSupports = vi.fn().mockReturnValue(false);
      global.CSS = { supports: mockSupports } as any;
      
      const gradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      const fallback = '#667eea';
      
      const styles = getGradientStyles(gradient, fallback);
      
      expect(styles).toEqual({
        backgroundColor: fallback,
      });
      expect(styles).not.toHaveProperty('background');
    });
  });

  describe('getAnimationStyles', () => {
    it('should return animation styles when supported', () => {
      const mockSupports = vi.fn().mockReturnValue(true);
      global.CSS = { supports: mockSupports } as any;
      
      const animationStyles = {
        animation: 'fadeIn 0.3s ease-in-out',
        transform: 'translateY(0)',
      };
      const fallbackStyles = {
        opacity: 1,
      };
      
      const styles = getAnimationStyles(animationStyles, fallbackStyles);
      
      expect(styles).toEqual(animationStyles);
    });

    it('should return fallback styles when animations not supported', () => {
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
      
      expect(styles).toEqual(fallbackStyles);
    });

    it('should return empty object when no fallback provided and animations not supported', () => {
      const mockSupports = vi.fn().mockReturnValue(false);
      global.CSS = { supports: mockSupports } as any;
      
      const animationStyles = {
        animation: 'fadeIn 0.3s ease-in-out',
      };
      
      const styles = getAnimationStyles(animationStyles);
      
      expect(styles).toEqual({});
    });
  });

  describe('Feature Detection Caching', () => {
    beforeEach(() => {
      // Reset cache before each test
      vi.resetModules();
    });

    it('should initialize and cache feature detection results', () => {
      const mockSupports = vi.fn().mockReturnValue(true);
      global.CSS = { supports: mockSupports } as any;
      
      const cache = initializeFeatureDetection();
      
      expect(cache).toHaveProperty('backdropFilter');
      expect(cache).toHaveProperty('gradients');
      expect(cache).toHaveProperty('animations');
      expect(typeof cache.backdropFilter).toBe('boolean');
      expect(typeof cache.gradients).toBe('boolean');
      expect(typeof cache.animations).toBe('boolean');
    });

    it('should return cached results on subsequent calls', () => {
      const mockSupports = vi.fn().mockReturnValue(true);
      global.CSS = { supports: mockSupports } as any;
      
      // Initialize cache
      initializeFeatureDetection();
      const callCountAfterInit = mockSupports.mock.calls.length;
      
      // Get cached results
      const cached = getCachedFeatureSupport();
      
      // Should not call CSS.supports again
      expect(mockSupports.mock.calls.length).toBe(callCountAfterInit);
      expect(cached).toHaveProperty('backdropFilter');
      expect(cached).toHaveProperty('gradients');
      expect(cached).toHaveProperty('animations');
    });

    it('should initialize cache if not already initialized when getting cached support', () => {
      const mockSupports = vi.fn().mockReturnValue(true);
      global.CSS = { supports: mockSupports } as any;
      
      // Get cached results without initializing first
      const cached = getCachedFeatureSupport();
      
      // Should have initialized and returned results
      expect(cached).toHaveProperty('backdropFilter');
      expect(cached).toHaveProperty('gradients');
      expect(cached).toHaveProperty('animations');
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing CSS.supports gracefully', () => {
      global.CSS = { supports: undefined } as any;
      
      expect(() => supportsBackdropFilter()).not.toThrow();
      expect(() => supportsGradients()).not.toThrow();
      expect(() => supportsAnimations()).not.toThrow();
    });

    it('should handle null CSS object', () => {
      // @ts-ignore
      global.CSS = null;
      
      const result = supportsBackdropFilter();
      
      expect(result).toBe(false);
    });

    it('should provide consistent fallback behavior across all helper functions', () => {
      const mockSupports = vi.fn().mockReturnValue(false);
      global.CSS = { supports: mockSupports } as any;
      
      // All functions should provide fallbacks when features not supported
      const glassStyles = getGlassmorphismStyles('rgba(255,255,255,0.7)', 'rgba(255,255,255,0.95)');
      const gradientStyles = getGradientStyles('linear-gradient(red, blue)', '#ff0000');
      const animationStyles = getAnimationStyles({ animation: 'test 1s' }, { opacity: 1 });
      
      // All should have fallback values
      expect(glassStyles.backgroundColor).toBeDefined();
      expect(gradientStyles.backgroundColor).toBeDefined();
      expect(animationStyles.opacity).toBeDefined();
      
      // None should have advanced features
      expect(glassStyles).not.toHaveProperty('backdropFilter');
      expect(gradientStyles).not.toHaveProperty('background');
      expect(animationStyles).not.toHaveProperty('animation');
    });
  });
});
