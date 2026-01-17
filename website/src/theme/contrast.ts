// Contrast checking utilities for accessibility

/**
 * Calculate relative luminance of a color
 * Based on WCAG 2.0 formula
 */
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    const val = c / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Parse hex color to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Calculate contrast ratio between two colors
 * Returns a value between 1 and 21
 */
export function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) {
    console.warn('Invalid color format. Expected hex color.');
    return 1;
  }

  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast ratio meets WCAG AA standards
 * @param ratio - Contrast ratio to check
 * @param isLargeText - Whether the text is large (18pt+ or 14pt+ bold)
 * @returns true if contrast meets standards
 */
export function meetsWCAGAA(ratio: number, isLargeText: boolean = false): boolean {
  return isLargeText ? ratio >= 3 : ratio >= 4.5;
}

/**
 * Check if contrast ratio meets WCAG AAA standards
 * @param ratio - Contrast ratio to check
 * @param isLargeText - Whether the text is large (18pt+ or 14pt+ bold)
 * @returns true if contrast meets standards
 */
export function meetsWCAGAAA(ratio: number, isLargeText: boolean = false): boolean {
  return isLargeText ? ratio >= 4.5 : ratio >= 7;
}

/**
 * Validate color palette contrast
 */
export function validatePaletteContrast(palette: Record<string, string>): void {
  const textColors = ['textPrimary', 'textSecondary'];
  const backgrounds = ['background', 'surface'];

  textColors.forEach(textKey => {
    backgrounds.forEach(bgKey => {
      if (palette[textKey] && palette[bgKey]) {
        const ratio = getContrastRatio(palette[textKey], palette[bgKey]);
        const meetsAA = meetsWCAGAA(ratio);

        if (!meetsAA) {
          console.warn(
            `Low contrast detected: ${textKey} on ${bgKey} (ratio: ${ratio.toFixed(2)}). ` +
              `WCAG AA requires at least 4.5:1 for normal text.`
          );
        }
      }
    });
  });
}
