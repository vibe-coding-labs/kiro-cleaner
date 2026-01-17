/**
 * Design System Validation Utilities
 * 
 * Validates design system consistency across spacing, typography, and colors.
 * Ensures all values follow design system rules and standards.
 * 
 * Requirements: 5.1, 5.2
 */

import { spacingTokens } from '../theme/tokens/spacing';
import { typographyTokens } from '../theme/tokens/typography';

/**
 * Base spacing unit in pixels
 * All spacing should be multiples of this value
 * Note: We allow 4px increments for fine-tuning, but prefer 8px multiples
 */
export const BASE_SPACING_UNIT = 8;

/**
 * Minimum spacing unit (allows half-steps)
 */
export const MINIMUM_SPACING_UNIT = 4;

/**
 * Minimum line height for readability
 * WCAG recommends at least 1.5 for body text
 */
export const MINIMUM_LINE_HEIGHT = 1.5;

/**
 * Validate that a spacing value is a multiple of the minimum unit
 * We allow 4px increments for fine-tuning
 * 
 * @param value - Spacing value in pixels
 * @returns Whether the value is valid
 */
export const isValidSpacing = (value: number): boolean => {
  return value % MINIMUM_SPACING_UNIT === 0;
};

/**
 * Validate all spacing tokens
 * 
 * @returns Object with validation results
 */
export const validateSpacingSystem = (): {
  isValid: boolean;
  errors: string[];
  validTokens: string[];
  invalidTokens: string[];
} => {
  const errors: string[] = [];
  const validTokens: string[] = [];
  const invalidTokens: string[] = [];

  Object.entries(spacingTokens).forEach(([key, value]) => {
    // Parse the pixel value from string (e.g., '16px' -> 16)
    const numericValue = typeof value === 'string' 
      ? parseInt(value.replace('px', ''))
      : value;
      
    if (isValidSpacing(numericValue)) {
      validTokens.push(key);
    } else {
      invalidTokens.push(key);
      errors.push(
        `Spacing token '${key}' has value ${value}, which is not a multiple of ${MINIMUM_SPACING_UNIT}px`
      );
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    validTokens,
    invalidTokens,
  };
};

/**
 * Validate that a line height meets readability standards
 * 
 * @param lineHeight - Line height value (unitless)
 * @returns Whether the line height is valid
 */
export const isValidLineHeight = (lineHeight: number): boolean => {
  return lineHeight >= MINIMUM_LINE_HEIGHT;
};

/**
 * Validate all typography tokens
 * 
 * @returns Object with validation results
 */
export const validateTypographySystem = (): {
  isValid: boolean;
  errors: string[];
  validTokens: string[];
  invalidTokens: string[];
} => {
  const errors: string[] = [];
  const validTokens: string[] = [];
  const invalidTokens: string[] = [];

  Object.entries(typographyTokens).forEach(([key, value]) => {
    if (typeof value === 'object' && 'lineHeight' in value) {
      const lineHeight = parseFloat(value.lineHeight as string);
      
      if (isValidLineHeight(lineHeight)) {
        validTokens.push(key);
      } else {
        invalidTokens.push(key);
        errors.push(
          `Typography token '${key}' has line height ${lineHeight}, which is below the minimum of ${MINIMUM_LINE_HEIGHT}`
        );
      }
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    validTokens,
    invalidTokens,
  };
};

/**
 * Validate a custom spacing value
 * 
 * @param value - Spacing value in pixels
 * @param context - Context for error message
 * @returns Validation result
 */
export const validateCustomSpacing = (
  value: number,
  context: string = 'custom spacing'
): {
  isValid: boolean;
  error?: string;
  suggestion?: number;
} => {
  if (isValidSpacing(value)) {
    return { isValid: true };
  }

  // Find nearest valid spacing using MINIMUM_SPACING_UNIT
  const remainder = value % MINIMUM_SPACING_UNIT;
  const suggestion =
    remainder < MINIMUM_SPACING_UNIT / 2
      ? value - remainder
      : value + (MINIMUM_SPACING_UNIT - remainder);

  return {
    isValid: false,
    error: `${context} value ${value}px is not a multiple of ${MINIMUM_SPACING_UNIT}px`,
    suggestion,
  };
};

/**
 * Validate a custom line height
 * 
 * @param lineHeight - Line height value (unitless)
 * @param context - Context for error message
 * @returns Validation result
 */
export const validateCustomLineHeight = (
  lineHeight: number,
  context: string = 'custom line height'
): {
  isValid: boolean;
  error?: string;
} => {
  if (isValidLineHeight(lineHeight)) {
    return { isValid: true };
  }

  return {
    isValid: false,
    error: `${context} value ${lineHeight} is below the minimum of ${MINIMUM_LINE_HEIGHT}`,
  };
};

/**
 * Get all spacing values from the design system
 * 
 * @returns Array of valid spacing values
 */
export const getValidSpacingValues = (): number[] => {
  return Object.values(spacingTokens)
    .map(value => typeof value === 'string' ? parseInt(value.replace('px', '')) : value)
    .filter(isValidSpacing);
};

/**
 * Find the closest valid spacing value
 * 
 * @param value - Target spacing value
 * @returns Closest valid spacing value
 */
export const findClosestValidSpacing = (value: number): number => {
  const validValues = getValidSpacingValues();
  
  return validValues.reduce((closest, current) => {
    return Math.abs(current - value) < Math.abs(closest - value)
      ? current
      : closest;
  });
};

/**
 * Validate entire design system
 * 
 * @returns Comprehensive validation results
 */
export const validateDesignSystem = (): {
  isValid: boolean;
  spacing: ReturnType<typeof validateSpacingSystem>;
  typography: ReturnType<typeof validateTypographySystem>;
} => {
  const spacing = validateSpacingSystem();
  const typography = validateTypographySystem();

  return {
    isValid: spacing.isValid && typography.isValid,
    spacing,
    typography,
  };
};

/**
 * Design system validation report
 * Generates a human-readable report of validation results
 */
export const generateValidationReport = (): string => {
  const results = validateDesignSystem();
  
  let report = '# Design System Validation Report\n\n';
  
  // Overall status
  report += `## Overall Status: ${results.isValid ? '✅ PASS' : '❌ FAIL'}\n\n`;
  
  // Spacing validation
  report += '## Spacing System\n\n';
  report += `- Status: ${results.spacing.isValid ? '✅ PASS' : '❌ FAIL'}\n`;
  report += `- Valid tokens: ${results.spacing.validTokens.length}\n`;
  report += `- Invalid tokens: ${results.spacing.invalidTokens.length}\n\n`;
  
  if (results.spacing.errors.length > 0) {
    report += '### Errors:\n';
    results.spacing.errors.forEach(error => {
      report += `- ${error}\n`;
    });
    report += '\n';
  }
  
  // Typography validation
  report += '## Typography System\n\n';
  report += `- Status: ${results.typography.isValid ? '✅ PASS' : '❌ FAIL'}\n`;
  report += `- Valid tokens: ${results.typography.validTokens.length}\n`;
  report += `- Invalid tokens: ${results.typography.invalidTokens.length}\n\n`;
  
  if (results.typography.errors.length > 0) {
    report += '### Errors:\n';
    results.typography.errors.forEach(error => {
      report += `- ${error}\n`;
    });
    report += '\n';
  }
  
  return report;
};
