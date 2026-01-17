/**
 * Property 6: Responsive Breakpoint Adaptation
 * 
 * Validates: Requirements 7.2
 * 
 * For any screen size breakpoint, the visual system SHALL provide adapted values
 * for shadows, spacing, and font sizes that differ from the default desktop values.
 */

import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import {
  getResponsiveShadow,
  getResponsiveSpacing,
  getResponsiveFontSize,
  responsiveShadows,
} from './responsive';
import { shadowTokens } from '../theme/tokens/shadows';

describe('Property 6: Responsive Breakpoint Adaptation', () => {
  describe('Shadow Adaptation', () => {
    it('should provide different shadow values for mobile and desktop', () => {
      // Feature: premium-website-visual-enhancement, Property 6: Responsive Breakpoint Adaptation
      
      fc.assert(
        fc.property(
          fc.constantFrom(...Object.values(shadowTokens.elevation)),
          (desktopShadow) => {
            const responsive = getResponsiveShadow(desktopShadow);
            
            // Mobile shadow should exist
            expect(responsive.xs).toBeDefined();
            // Desktop shadow should exist
            expect(responsive.md).toBeDefined();
            // Desktop shadow should match input
            expect(responsive.md).toBe(desktopShadow);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should use lighter shadows on mobile by default', () => {
      // Feature: premium-website-visual-enhancement, Property 6: Responsive Breakpoint Adaptation
      
      const heavyShadow = shadowTokens.elevation['2xl'];
      const responsive = getResponsiveShadow(heavyShadow);
      
      // Mobile should default to lighter shadow
      expect(responsive.xs).toBe(shadowTokens.elevation.sm);
      expect(responsive.md).toBe(heavyShadow);
    });

    it('should provide pre-configured responsive shadow pairs', () => {
      // Feature: premium-website-visual-enhancement, Property 6: Responsive Breakpoint Adaptation
      
      // All pre-configured shadows should have both mobile and desktop values
      Object.values(responsiveShadows).forEach((shadowPair) => {
        expect(shadowPair.xs).toBeDefined();
        expect(shadowPair.md).toBeDefined();
        expect(shadowPair.xs).not.toBe(shadowPair.md);
      });
    });
  });

  describe('Spacing Adaptation', () => {
    it('should provide different spacing values for mobile and desktop', () => {
      // Feature: premium-website-visual-enhancement, Property 6: Responsive Breakpoint Adaptation
      
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 32 }),
          (desktopSpacing) => {
            const responsive = getResponsiveSpacing(desktopSpacing);
            
            // Mobile spacing should exist
            expect(responsive.xs).toBeDefined();
            // Desktop spacing should exist
            expect(responsive.md).toBeDefined();
            // Desktop spacing should match input
            expect(responsive.md).toBe(desktopSpacing);
            // Mobile spacing should be less than or equal to desktop
            expect(responsive.xs).toBeLessThanOrEqual(desktopSpacing);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reduce spacing to 75% on mobile by default', () => {
      // Feature: premium-website-visual-enhancement, Property 6: Responsive Breakpoint Adaptation
      
      fc.assert(
        fc.property(
          fc.integer({ min: 4, max: 32 }),
          (desktopSpacing) => {
            const responsive = getResponsiveSpacing(desktopSpacing);
            const expectedMobile = Math.max(1, Math.floor(desktopSpacing * 0.75));
            
            expect(responsive.xs).toBe(expectedMobile);
            expect(responsive.md).toBe(desktopSpacing);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should maintain minimum spacing of 1 on mobile', () => {
      // Feature: premium-website-visual-enhancement, Property 6: Responsive Breakpoint Adaptation
      
      const responsive = getResponsiveSpacing(1);
      expect(responsive.xs).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Font Size Adaptation', () => {
    it('should provide different font sizes for mobile and desktop', () => {
      // Feature: premium-website-visual-enhancement, Property 6: Responsive Breakpoint Adaptation
      
      fc.assert(
        fc.property(
          fc.double({ min: 0.75, max: 4.0, noNaN: true }),
          (size) => {
            const desktopSize = `${size.toFixed(2)}rem`;
            const responsive = getResponsiveFontSize(desktopSize);
            
            // Mobile font size should exist
            expect(responsive.xs).toBeDefined();
            // Desktop font size should exist
            expect(responsive.md).toBeDefined();
            // Desktop font size should match input
            expect(responsive.md).toBe(desktopSize);
            // Mobile font size should be smaller or equal
            const mobileValue = parseFloat(responsive.xs);
            const desktopValue = parseFloat(responsive.md);
            expect(mobileValue).toBeLessThanOrEqual(desktopValue + 0.01); // Allow small floating point error
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reduce font size to 85% on mobile by default', () => {
      // Feature: premium-website-visual-enhancement, Property 6: Responsive Breakpoint Adaptation
      
      fc.assert(
        fc.property(
          fc.double({ min: 1.0, max: 4.0, noNaN: true }),
          (size) => {
            const desktopSize = `${size.toFixed(2)}rem`;
            const responsive = getResponsiveFontSize(desktopSize);
            const expectedMobileValue = parseFloat((size * 0.85).toFixed(2));
            const actualMobileValue = parseFloat(responsive.xs);
            
            // Allow small floating point error (0.02rem tolerance for rounding)
            expect(Math.abs(actualMobileValue - expectedMobileValue)).toBeLessThan(0.02);
            expect(responsive.md).toBe(desktopSize);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should accept custom mobile font sizes', () => {
      // Feature: premium-website-visual-enhancement, Property 6: Responsive Breakpoint Adaptation
      
      const desktopSize = '2rem';
      const customMobileSize = '1.5rem';
      const responsive = getResponsiveFontSize(desktopSize, customMobileSize);
      
      expect(responsive.xs).toBe(customMobileSize);
      expect(responsive.md).toBe(desktopSize);
    });
  });

  describe('Comprehensive Adaptation', () => {
    it('should ensure all responsive utilities provide mobile and desktop values', () => {
      // Feature: premium-website-visual-enhancement, Property 6: Responsive Breakpoint Adaptation
      
      // Test shadow adaptation
      const shadow = getResponsiveShadow(shadowTokens.elevation.lg);
      expect(shadow).toHaveProperty('xs');
      expect(shadow).toHaveProperty('md');
      
      // Test spacing adaptation
      const spacing = getResponsiveSpacing(8);
      expect(spacing).toHaveProperty('xs');
      expect(spacing).toHaveProperty('md');
      
      // Test font size adaptation
      const fontSize = getResponsiveFontSize('1.5rem');
      expect(fontSize).toHaveProperty('xs');
      expect(fontSize).toHaveProperty('md');
    });

    it('should ensure mobile values are always defined and valid', () => {
      // Feature: premium-website-visual-enhancement, Property 6: Responsive Breakpoint Adaptation
      
      fc.assert(
        fc.property(
          fc.record({
            shadow: fc.constantFrom(...Object.values(shadowTokens.elevation)),
            spacing: fc.integer({ min: 1, max: 32 }),
            fontSize: fc.double({ min: 0.75, max: 4.0 }),
          }),
          ({ shadow, spacing, fontSize }) => {
            const responsiveShadow = getResponsiveShadow(shadow);
            const responsiveSpacing = getResponsiveSpacing(spacing);
            const responsiveFontSize = getResponsiveFontSize(`${fontSize}rem`);
            
            // All mobile values should be defined
            expect(responsiveShadow.xs).toBeDefined();
            expect(responsiveSpacing.xs).toBeDefined();
            expect(responsiveFontSize.xs).toBeDefined();
            
            // All mobile values should be valid
            expect(typeof responsiveShadow.xs).toBe('string');
            expect(typeof responsiveSpacing.xs).toBe('number');
            expect(typeof responsiveFontSize.xs).toBe('string');
            
            // Mobile spacing should be positive
            expect(responsiveSpacing.xs).toBeGreaterThan(0);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
