/**
 * Property-Based Tests for Color Tokens
 * Feature: premium-website-visual-enhancement
 */

import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { colorTokens } from './colors';
import { getContrastRatio, meetsWCAGAA } from '../contrast';

describe('Feature: premium-website-visual-enhancement, Property 1: Color Contrast Compliance', () => {
  it('should meet WCAG AA contrast for primary text on default background', () => {
    const ratio = getContrastRatio(colorTokens.text.primary, colorTokens.background.default);
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  it('should meet WCAG AA contrast for secondary text on default background', () => {
    const ratio = getContrastRatio(colorTokens.text.secondary, colorTokens.background.default);
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  it('should meet WCAG AA contrast for tertiary text on default background', () => {
    const ratio = getContrastRatio(colorTokens.text.tertiary, colorTokens.background.default);
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  it('should meet WCAG AA contrast for all text colors on all background colors', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(
          colorTokens.text.primary,
          colorTokens.text.secondary,
          colorTokens.text.tertiary
        ),
        fc.constantFrom(
          colorTokens.background.default,
          colorTokens.background.paper,
          colorTokens.background.subtle
        ),
        (textColor, bgColor) => {
          const ratio = getContrastRatio(textColor, bgColor);
          return meetsWCAGAA(ratio, false);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should have inverse text color with sufficient contrast on dark backgrounds', () => {
    const ratio = getContrastRatio(colorTokens.text.inverse, colorTokens.neutral[900]);
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  it('should have brand colors that are distinguishable from each other', () => {
    // Primary and secondary should be different
    expect(colorTokens.brand.primary).not.toBe(colorTokens.brand.secondary);
    expect(colorTokens.brand.primary).not.toBe(colorTokens.brand.accent);
    expect(colorTokens.brand.secondary).not.toBe(colorTokens.brand.accent);
  });

  it('should have semantic colors that are distinct', () => {
    const semanticColors = [
      colorTokens.semantic.success,
      colorTokens.semantic.warning,
      colorTokens.semantic.error,
      colorTokens.semantic.info,
    ];
    
    // All semantic colors should be unique
    const uniqueColors = new Set(semanticColors);
    expect(uniqueColors.size).toBe(semanticColors.length);
  });

  it('should have neutral colors with increasing darkness', () => {
    const neutralValues = [
      colorTokens.neutral[50],
      colorTokens.neutral[100],
      colorTokens.neutral[200],
      colorTokens.neutral[300],
      colorTokens.neutral[400],
      colorTokens.neutral[500],
      colorTokens.neutral[600],
      colorTokens.neutral[700],
      colorTokens.neutral[800],
      colorTokens.neutral[900],
    ];

    // Convert hex to brightness value (simplified)
    const getBrightness = (hex: string): number => {
      const rgb = parseInt(hex.slice(1), 16);
      const r = (rgb >> 16) & 0xff;
      const g = (rgb >> 8) & 0xff;
      const b = (rgb >> 0) & 0xff;
      return (r + g + b) / 3;
    };

    // Each neutral should be darker than the previous
    for (let i = 1; i < neutralValues.length; i++) {
      const prevBrightness = getBrightness(neutralValues[i - 1]);
      const currBrightness = getBrightness(neutralValues[i]);
      expect(currBrightness).toBeLessThan(prevBrightness);
    }
  });
});

describe('Color Palette Structure Validation', () => {
  it('should have all required brand colors', () => {
    expect(colorTokens.brand).toHaveProperty('primary');
    expect(colorTokens.brand).toHaveProperty('secondary');
    expect(colorTokens.brand).toHaveProperty('accent');
  });

  it('should have at least 5 neutral color levels', () => {
    const neutralKeys = Object.keys(colorTokens.neutral);
    expect(neutralKeys.length).toBeGreaterThanOrEqual(5);
  });

  it('should have all semantic colors', () => {
    expect(colorTokens.semantic).toHaveProperty('success');
    expect(colorTokens.semantic).toHaveProperty('warning');
    expect(colorTokens.semantic).toHaveProperty('error');
    expect(colorTokens.semantic).toHaveProperty('info');
  });

  it('should have gradient definitions', () => {
    expect(colorTokens.gradients).toHaveProperty('hero');
    expect(colorTokens.gradients).toHaveProperty('heroAlt');
    expect(colorTokens.gradients).toHaveProperty('premium');
    expect(colorTokens.gradients).toHaveProperty('subtleVariants');
    expect(colorTokens.gradients).toHaveProperty('animated');
  });

  it('should have surface colors for layering', () => {
    expect(colorTokens.surface).toHaveProperty('base');
    expect(colorTokens.surface).toHaveProperty('raised');
    expect(colorTokens.surface).toHaveProperty('overlay');
    expect(colorTokens.surface).toHaveProperty('frosted');
  });

  it('should have all colors as valid hex or rgba strings', () => {
    const hexRegex = /^#[0-9A-Fa-f]{6}$/;
    const rgbaRegex = /^rgba?\(/;

    const checkColor = (color: string): boolean => {
      return hexRegex.test(color) || rgbaRegex.test(color);
    };

    // Check brand colors
    Object.values(colorTokens.brand).forEach(color => {
      expect(checkColor(color)).toBe(true);
    });

    // Check neutral colors
    Object.values(colorTokens.neutral).forEach(color => {
      expect(checkColor(color)).toBe(true);
    });

    // Check semantic colors
    Object.values(colorTokens.semantic).forEach(color => {
      expect(checkColor(color)).toBe(true);
    });
  });
});
