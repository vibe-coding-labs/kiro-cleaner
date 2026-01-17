/**
 * Tests for Gradient Fallback Utilities
 * 
 * Validates: Requirements 1.4
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  gradientFallbacks,
  createGradientProperty,
  generateGradientProperties,
  useGradientProperty,
  applyGradientWithFallback,
  createGradientTextStyle,
  initializeGradientProperties,
} from './gradientFallbacks';
import { colorTokens } from '../theme/tokens/colors';
import * as featureDetection from './featureDetection';

// Mock feature detection
vi.mock('./featureDetection');

describe('Gradient Fallbacks', () => {
  describe('gradientFallbacks configuration', () => {
    it('should have fallback colors for all main gradients', () => {
      expect(gradientFallbacks.hero).toBeDefined();
      expect(gradientFallbacks.heroAlt).toBeDefined();
      expect(gradientFallbacks.card).toBeDefined();
      expect(gradientFallbacks.subtle).toBeDefined();
      expect(gradientFallbacks.mesh).toBeDefined();
    });

    it('should have fallback colors for premium gradients', () => {
      expect(gradientFallbacks.premium.blue).toBeDefined();
      expect(gradientFallbacks.premium.purple).toBeDefined();
      expect(gradientFallbacks.premium.ocean).toBeDefined();
      expect(gradientFallbacks.premium.sunset).toBeDefined();
      expect(gradientFallbacks.premium.forest).toBeDefined();
    });

    it('should have fallback colors for subtle variants', () => {
      expect(gradientFallbacks.subtleVariants.warm).toBeDefined();
      expect(gradientFallbacks.subtleVariants.cool).toBeDefined();
      expect(gradientFallbacks.subtleVariants.neutral).toBeDefined();
    });

    it('should have fallback colors for animated gradients', () => {
      expect(gradientFallbacks.animated.rainbow).toBeDefined();
      expect(gradientFallbacks.animated.aurora).toBeDefined();
    });
  });

  describe('createGradientProperty', () => {
    it('should return gradient when gradients are supported', () => {
      vi.mocked(featureDetection.supportsGradients).mockReturnValue(true);
      
      const result = createGradientProperty(
        '--test-gradient',
        'linear-gradient(red, blue)',
        '#ff0000'
      );
      
      expect(result['--test-gradient']).toBe('linear-gradient(red, blue)');
      expect(result['--test-gradient-fallback']).toBe('#ff0000');
    });

    it('should return fallback color when gradients are not supported', () => {
      vi.mocked(featureDetection.supportsGradients).mockReturnValue(false);
      
      const result = createGradientProperty(
        '--test-gradient',
        'linear-gradient(red, blue)',
        '#ff0000'
      );
      
      expect(result['--test-gradient']).toBe('#ff0000');
      expect(result['--test-gradient-fallback']).toBe('#ff0000');
    });
  });

  describe('generateGradientProperties', () => {
    it('should generate properties for all gradients when supported', () => {
      vi.mocked(featureDetection.supportsGradients).mockReturnValue(true);
      
      const properties = generateGradientProperties();
      
      // Check main gradients
      expect(properties['--gradient-hero']).toBe(colorTokens.gradients.hero);
      expect(properties['--gradient-hero-fallback']).toBe(gradientFallbacks.hero);
      expect(properties['--gradient-hero-alt']).toBe(colorTokens.gradients.heroAlt);
      expect(properties['--gradient-card']).toBe(colorTokens.gradients.card);
      
      // Check premium gradients
      expect(properties['--gradient-premium-blue']).toBe(colorTokens.gradients.premium.blue);
      expect(properties['--gradient-premium-purple']).toBe(colorTokens.gradients.premium.purple);
      
      // Check subtle variants
      expect(properties['--gradient-subtle-warm']).toBe(colorTokens.gradients.subtleVariants.warm);
      
      // Check animated gradients
      expect(properties['--gradient-animated-rainbow']).toBe(colorTokens.gradients.animated.rainbow);
    });

    it('should generate fallback colors when gradients are not supported', () => {
      vi.mocked(featureDetection.supportsGradients).mockReturnValue(false);
      
      const properties = generateGradientProperties();
      
      // Check that fallback colors are used
      expect(properties['--gradient-hero']).toBe(gradientFallbacks.hero);
      expect(properties['--gradient-hero-alt']).toBe(gradientFallbacks.heroAlt);
      expect(properties['--gradient-card']).toBe(gradientFallbacks.card);
      expect(properties['--gradient-premium-blue']).toBe(gradientFallbacks.premium.blue);
    });

    it('should always include fallback properties', () => {
      vi.mocked(featureDetection.supportsGradients).mockReturnValue(true);
      
      const properties = generateGradientProperties();
      
      // Fallback properties should always be present
      expect(properties['--gradient-hero-fallback']).toBeDefined();
      expect(properties['--gradient-premium-blue-fallback']).toBeDefined();
      expect(properties['--gradient-subtle-warm-fallback']).toBeDefined();
      expect(properties['--gradient-animated-rainbow-fallback']).toBeDefined();
    });
  });

  describe('useGradientProperty', () => {
    it('should return CSS var with fallback', () => {
      const style = useGradientProperty('--gradient-hero');
      
      expect(style.background).toBe('var(--gradient-hero, var(--gradient-hero-fallback))');
    });

    it('should work with any custom property name', () => {
      const style = useGradientProperty('--my-custom-gradient');
      
      expect(style.background).toBe('var(--my-custom-gradient, var(--my-custom-gradient-fallback))');
    });
  });

  describe('applyGradientWithFallback', () => {
    it('should return gradient with backgroundColor fallback when supported', () => {
      vi.mocked(featureDetection.supportsGradients).mockReturnValue(true);
      
      const style = applyGradientWithFallback(
        'linear-gradient(red, blue)',
        '#ff0000'
      );
      
      expect(style.background).toBe('linear-gradient(red, blue)');
      expect(style.backgroundColor).toBe('#ff0000');
    });

    it('should return only backgroundColor when gradients are not supported', () => {
      vi.mocked(featureDetection.supportsGradients).mockReturnValue(false);
      
      const style = applyGradientWithFallback(
        'linear-gradient(red, blue)',
        '#ff0000'
      );
      
      expect(style.background).toBeUndefined();
      expect(style.backgroundColor).toBe('#ff0000');
    });
  });

  describe('createGradientTextStyle', () => {
    it('should return gradient text style when supported', () => {
      vi.mocked(featureDetection.supportsGradients).mockReturnValue(true);
      
      const style = createGradientTextStyle(
        'linear-gradient(red, blue)',
        '#ff0000'
      );
      
      expect(style.background).toBe('linear-gradient(red, blue)');
      expect(style.WebkitBackgroundClip).toBe('text');
      expect(style.WebkitTextFillColor).toBe('transparent');
      expect(style.backgroundClip).toBe('text');
      expect(style.color).toBe('#ff0000');
    });

    it('should return solid color when gradients are not supported', () => {
      vi.mocked(featureDetection.supportsGradients).mockReturnValue(false);
      
      const style = createGradientTextStyle(
        'linear-gradient(red, blue)',
        '#ff0000'
      );
      
      expect(style.background).toBeUndefined();
      expect(style.WebkitBackgroundClip).toBeUndefined();
      expect(style.color).toBe('#ff0000');
    });
  });

  describe('initializeGradientProperties', () => {
    it('should return all gradient properties', () => {
      vi.mocked(featureDetection.supportsGradients).mockReturnValue(true);
      
      const properties = initializeGradientProperties();
      
      // Should have main gradients
      expect(properties['--gradient-hero']).toBeDefined();
      expect(properties['--gradient-hero-alt']).toBeDefined();
      
      // Should have premium gradients
      expect(properties['--gradient-premium-blue']).toBeDefined();
      
      // Should have subtle variants
      expect(properties['--gradient-subtle-warm']).toBeDefined();
      
      // Should have animated gradients
      expect(properties['--gradient-animated-rainbow']).toBeDefined();
    });
  });

  describe('Edge cases', () => {
    it('should handle empty gradient string', () => {
      vi.mocked(featureDetection.supportsGradients).mockReturnValue(true);
      
      const style = applyGradientWithFallback('', '#ff0000');
      
      expect(style.background).toBe('');
      expect(style.backgroundColor).toBe('#ff0000');
    });

    it('should handle empty fallback color', () => {
      vi.mocked(featureDetection.supportsGradients).mockReturnValue(false);
      
      const style = applyGradientWithFallback('linear-gradient(red, blue)', '');
      
      expect(style.backgroundColor).toBe('');
    });

    it('should handle complex gradient strings', () => {
      vi.mocked(featureDetection.supportsGradients).mockReturnValue(true);
      
      const complexGradient = 'radial-gradient(at 27% 37%, hsla(215, 98%, 61%, 0.3) 0px, transparent 50%)';
      const style = applyGradientWithFallback(complexGradient, '#0070f3');
      
      expect(style.background).toBe(complexGradient);
      expect(style.backgroundColor).toBe('#0070f3');
    });
  });

  describe('Integration with color tokens', () => {
    it('should use correct fallback colors from gradientFallbacks', () => {
      vi.mocked(featureDetection.supportsGradients).mockReturnValue(false);
      
      const properties = generateGradientProperties();
      
      // Verify fallback colors match configuration
      expect(properties['--gradient-hero']).toBe(gradientFallbacks.hero);
      expect(properties['--gradient-card']).toBe(gradientFallbacks.card);
      expect(properties['--gradient-premium-ocean']).toBe(gradientFallbacks.premium.ocean);
    });

    it('should use actual gradients from colorTokens when supported', () => {
      vi.mocked(featureDetection.supportsGradients).mockReturnValue(true);
      
      const properties = generateGradientProperties();
      
      // Verify actual gradients are used
      expect(properties['--gradient-hero']).toBe(colorTokens.gradients.hero);
      expect(properties['--gradient-card']).toBe(colorTokens.gradients.card);
      expect(properties['--gradient-premium-ocean']).toBe(colorTokens.gradients.premium.ocean);
    });
  });
});
