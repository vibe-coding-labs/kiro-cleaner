/**
 * Property-Based Tests for Shadow Tokens
 * Feature: premium-website-visual-enhancement
 */

import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { shadowTokens } from './shadows';

describe('Feature: premium-website-visual-enhancement, Property 2.1: Shadow System Structure', () => {
  it('should have all required shadow categories', () => {
    expect(shadowTokens).toHaveProperty('elevation');
    expect(shadowTokens).toHaveProperty('colored');
    expect(shadowTokens).toHaveProperty('inner');
    expect(shadowTokens).toHaveProperty('glow');
  });

  it('should have at least 3 elevation levels', () => {
    const elevationLevels = Object.keys(shadowTokens.elevation);
    expect(elevationLevels.length).toBeGreaterThanOrEqual(3);
  });

  it('should have all elevation shadows as valid CSS shadow strings', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...Object.values(shadowTokens.elevation)),
        (shadow) => {
          // Valid shadow should contain rgba or rgb and px units
          const hasColor = shadow.includes('rgba') || shadow.includes('rgb');
          const hasUnits = shadow.includes('px');
          return hasColor && hasUnits;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should have colored shadows for primary, secondary, and accent', () => {
    expect(shadowTokens.colored).toHaveProperty('primary');
    expect(shadowTokens.colored).toHaveProperty('secondary');
    expect(shadowTokens.colored).toHaveProperty('accent');
  });

  it('should have all colored shadows as valid CSS shadow strings', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...Object.values(shadowTokens.colored)),
        (shadow) => {
          const hasColor = shadow.includes('rgba') || shadow.includes('rgb');
          const hasUnits = shadow.includes('px');
          return hasColor && hasUnits;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should have inner shadows with inset keyword', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...Object.values(shadowTokens.inner)),
        (shadow) => {
          return shadow.includes('inset');
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should have glow effects with rgba color', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...Object.values(shadowTokens.glow)),
        (shadow) => {
          return shadow.includes('rgba');
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should have elevation shadows with increasing intensity', () => {
    // Extract blur radius from shadow strings (simplified check)
    const extractBlur = (shadow: string): number => {
      const match = shadow.match(/(\d+)px/g);
      if (!match) return 0;
      // Get the largest px value as a proxy for intensity
      return Math.max(...match.map(m => parseInt(m)));
    };

    const xs = extractBlur(shadowTokens.elevation.xs);
    const sm = extractBlur(shadowTokens.elevation.sm);
    const md = extractBlur(shadowTokens.elevation.md);
    const lg = extractBlur(shadowTokens.elevation.lg);
    const xl = extractBlur(shadowTokens.elevation.xl);

    expect(sm).toBeGreaterThanOrEqual(xs);
    expect(md).toBeGreaterThan(sm);
    expect(lg).toBeGreaterThan(md);
    expect(xl).toBeGreaterThan(lg);
  });
});
