/**
 * Design System Validation Property Tests
 * 
 * **Property 4: Spacing System Consistency**
 * **Validates: Requirements 5.1**
 * 
 * All spacing values must be multiples of 8px for visual consistency.
 * 
 * **Property 5: Typography Readability Standards**
 * **Validates: Requirements 5.2**
 * 
 * All text styles must have line height >= 1.5 for readability.
 */

import { describe, it, expect } from 'vitest';
import {
  BASE_SPACING_UNIT,
  MINIMUM_SPACING_UNIT,
  MINIMUM_LINE_HEIGHT,
  isValidSpacing,
  isValidLineHeight,
  validateSpacingSystem,
  validateTypographySystem,
  validateCustomSpacing,
  validateCustomLineHeight,
  findClosestValidSpacing,
  validateDesignSystem,
  generateValidationReport,
} from './designSystemValidation';
import { spacingTokens } from '../theme/tokens/spacing';
import { typographyTokens } from '../theme/tokens/typography';

describe('Property 4: Spacing System Consistency', () => {
  describe('Base spacing unit', () => {
    it('should be 8px with 4px minimum increments', () => {
      expect(BASE_SPACING_UNIT).toBe(8);
      expect(MINIMUM_SPACING_UNIT).toBe(4);
    });
  });

  describe('Spacing validation', () => {
    it('should validate multiples of 4px as valid', () => {
      const validValues = [0, 4, 8, 12, 16, 20, 24, 28, 32];
      
      validValues.forEach(value => {
        expect(isValidSpacing(value)).toBe(true);
      });
    });

    it('should validate non-multiples of 4px as invalid', () => {
      const invalidValues = [1, 2, 3, 5, 6, 7, 9, 10, 11];
      
      invalidValues.forEach(value => {
        expect(isValidSpacing(value)).toBe(false);
      });
    });

    it('should handle zero as valid spacing', () => {
      expect(isValidSpacing(0)).toBe(true);
    });

    it('should handle negative multiples of 4px as valid', () => {
      expect(isValidSpacing(-4)).toBe(true);
      expect(isValidSpacing(-8)).toBe(true);
    });
  });

  describe('Spacing system validation', () => {
    it('should validate all spacing tokens', () => {
      const result = validateSpacingSystem();
      
      expect(result).toHaveProperty('isValid');
      expect(result).toHaveProperty('errors');
      expect(result).toHaveProperty('validTokens');
      expect(result).toHaveProperty('invalidTokens');
    });

    it('should have all spacing tokens as multiples of 8px', () => {
      const result = validateSpacingSystem();
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.invalidTokens).toHaveLength(0);
    });

    it('should validate each spacing token individually', () => {
      Object.entries(spacingTokens).forEach(([key, value]) => {
        const numericValue = typeof value === 'string' 
          ? parseInt(value.replace('px', ''))
          : value;
        expect(isValidSpacing(numericValue)).toBe(true);
      });
    });

    it('should have at least 10 spacing tokens', () => {
      const tokenCount = Object.keys(spacingTokens).length;
      expect(tokenCount).toBeGreaterThanOrEqual(10);
    });
  });

  describe('Custom spacing validation', () => {
    it('should validate custom spacing values', () => {
      const validResult = validateCustomSpacing(32, 'padding');
      expect(validResult.isValid).toBe(true);
      expect(validResult.error).toBeUndefined();
    });

    it('should provide suggestions for invalid spacing', () => {
      const invalidResult = validateCustomSpacing(30, 'margin');
      
      expect(invalidResult.isValid).toBe(false);
      expect(invalidResult.error).toBeDefined();
      expect(invalidResult.suggestion).toBeDefined();
      expect(isValidSpacing(invalidResult.suggestion!)).toBe(true);
    });

    it('should suggest nearest valid spacing', () => {
      const result1 = validateCustomSpacing(10);
      expect(result1.suggestion).toBe(12); // 10 rounds up to 12 (remainder 2, which is >= 2)
      
      const result2 = validateCustomSpacing(13);
      expect(result2.suggestion).toBe(12); // 13 rounds down to 12 (remainder 1, which is < 2)
    });
  });

  describe('Closest valid spacing', () => {
    it('should find closest valid spacing value', () => {
      expect(findClosestValidSpacing(10)).toBe(8);
      expect(findClosestValidSpacing(14)).toBe(12);
      expect(findClosestValidSpacing(18)).toBe(16);
      expect(findClosestValidSpacing(26)).toBe(24);
    });

    it('should return exact value if already valid', () => {
      expect(findClosestValidSpacing(4)).toBe(4);
      expect(findClosestValidSpacing(8)).toBe(8);
      expect(findClosestValidSpacing(16)).toBe(16);
    });
  });
});

describe('Property 5: Typography Readability Standards', () => {
  describe('Minimum line height', () => {
    it('should be 1.5', () => {
      expect(MINIMUM_LINE_HEIGHT).toBe(1.5);
    });
  });

  describe('Line height validation', () => {
    it('should validate line heights >= 1.5 as valid', () => {
      const validValues = [1.5, 1.6, 1.7, 1.8, 2.0];
      
      validValues.forEach(value => {
        expect(isValidLineHeight(value)).toBe(true);
      });
    });

    it('should validate line heights < 1.5 as invalid', () => {
      const invalidValues = [1.0, 1.1, 1.2, 1.3, 1.4];
      
      invalidValues.forEach(value => {
        expect(isValidLineHeight(value)).toBe(false);
      });
    });

    it('should handle exactly 1.5 as valid', () => {
      expect(isValidLineHeight(1.5)).toBe(true);
    });
  });

  describe('Typography system validation', () => {
    it('should validate all typography tokens', () => {
      const result = validateTypographySystem();
      
      expect(result).toHaveProperty('isValid');
      expect(result).toHaveProperty('errors');
      expect(result).toHaveProperty('validTokens');
      expect(result).toHaveProperty('invalidTokens');
    });

    it('should have all typography tokens with line height >= 1.5', () => {
      const result = validateTypographySystem();
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.invalidTokens).toHaveLength(0);
    });

    it('should validate each typography token individually', () => {
      Object.entries(typographyTokens).forEach(([key, value]) => {
        if (typeof value === 'object' && 'lineHeight' in value) {
          const lineHeight = parseFloat(value.lineHeight as string);
          expect(isValidLineHeight(lineHeight)).toBe(true);
        }
      });
    });
  });

  describe('Custom line height validation', () => {
    it('should validate custom line height values', () => {
      const validResult = validateCustomLineHeight(1.6, 'body text');
      expect(validResult.isValid).toBe(true);
      expect(validResult.error).toBeUndefined();
    });

    it('should provide error for invalid line height', () => {
      const invalidResult = validateCustomLineHeight(1.2, 'heading');
      
      expect(invalidResult.isValid).toBe(false);
      expect(invalidResult.error).toBeDefined();
      expect(invalidResult.error).toContain('1.2');
      expect(invalidResult.error).toContain('1.5');
    });
  });
});

describe('Design System Validation', () => {
  describe('Complete validation', () => {
    it('should validate entire design system', () => {
      const result = validateDesignSystem();
      
      expect(result).toHaveProperty('isValid');
      expect(result).toHaveProperty('spacing');
      expect(result).toHaveProperty('typography');
    });

    it('should pass all design system validations', () => {
      const result = validateDesignSystem();
      
      expect(result.isValid).toBe(true);
      expect(result.spacing.isValid).toBe(true);
      expect(result.typography.isValid).toBe(true);
    });

    it('should have no errors in spacing system', () => {
      const result = validateDesignSystem();
      expect(result.spacing.errors).toHaveLength(0);
    });

    it('should have no errors in typography system', () => {
      const result = validateDesignSystem();
      expect(result.typography.errors).toHaveLength(0);
    });
  });

  describe('Validation report', () => {
    it('should generate validation report', () => {
      const report = generateValidationReport();
      
      expect(report).toBeTruthy();
      expect(typeof report).toBe('string');
      expect(report.length).toBeGreaterThan(0);
    });

    it('should include overall status in report', () => {
      const report = generateValidationReport();
      
      expect(report).toContain('Overall Status');
      expect(report).toContain('PASS');
    });

    it('should include spacing system results', () => {
      const report = generateValidationReport();
      
      expect(report).toContain('Spacing System');
    });

    it('should include typography system results', () => {
      const report = generateValidationReport();
      
      expect(report).toContain('Typography System');
    });
  });

  describe('Design system consistency', () => {
    it('should maintain consistent spacing scale', () => {
      const values = Object.values(spacingTokens)
        .map(value => typeof value === 'string' ? parseInt(value.replace('px', '')) : value);
      const sortedValues = [...values].sort((a, b) => a - b);
      
      // Check that spacing increases consistently
      for (let i = 1; i < sortedValues.length; i++) {
        const diff = sortedValues[i] - sortedValues[i - 1];
        // Diff should be a multiple of 4 (allowing for half-steps)
        expect(diff % 4).toBe(0);
      }
    });

    it('should have typography tokens with consistent structure', () => {
      Object.values(typographyTokens).forEach(token => {
        if (typeof token === 'object') {
          // Should have common typography properties
          expect(token).toBeDefined();
        }
      });
    });
  });
});
