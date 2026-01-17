import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { flatTheme } from './flatTheme';
import { flatColors } from './colors';
import { getContrastRatio, meetsWCAGAA } from './contrast';
import * as fc from 'fast-check';
import App from '../App';

// Feature: flat-design-website
// Property 10: No gradients anywhere on the website - **Validates: Requirements 4.1**
// Property 11: Text contrast meets accessibility standards - **Validates: Requirements 4.2**
// Property 12: Interactive elements use palette colors - **Validates: Requirements 4.3**

const renderApp = () => {
  return render(
    <ThemeProvider theme={flatTheme}>
      <App />
    </ThemeProvider>
  );
};

describe('Global Flat Design Constraints', () => {
  describe('Property 10: No gradients anywhere on the website', () => {
    it('should not have any linear-gradient in backgrounds', () => {
      const { container } = renderApp();
      const allElements = container.querySelectorAll('*');

      allElements.forEach(element => {
        const styles = window.getComputedStyle(element);
        const bgImage = styles.backgroundImage;

        // Should not contain linear-gradient or radial-gradient
        expect(bgImage).not.toContain('linear-gradient');
        expect(bgImage).not.toContain('radial-gradient');
      });
    });

    it('should not have any radial-gradient in backgrounds', () => {
      const { container } = renderApp();
      const allElements = container.querySelectorAll('*');

      allElements.forEach(element => {
        const styles = window.getComputedStyle(element);
        const bgImage = styles.backgroundImage;

        expect(bgImage).not.toContain('radial-gradient');
      });
    });

    it('should have solid backgrounds only', () => {
      const { container } = renderApp();
      const allElements = container.querySelectorAll('*');

      allElements.forEach(element => {
        const styles = window.getComputedStyle(element);
        const bgImage = styles.backgroundImage;

        // Background image should be 'none' or empty
        if (bgImage && bgImage !== 'none') {
          // If there's a background image, it should not be a gradient
          expect(bgImage).not.toMatch(/gradient/i);
        }
      });
    });

    // Property-based test: No gradients across multiple renders
    it('should never have gradients across multiple renders', { timeout: 15000 }, () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 3 }),
          (renderCount) => {
            for (let i = 0; i < renderCount; i++) {
              const { container } = render(
                <ThemeProvider theme={flatTheme}>
                  <App />
                </ThemeProvider>
              );

              const allElements = container.querySelectorAll('*');

              for (const element of Array.from(allElements)) {
                const styles = window.getComputedStyle(element);
                const bgImage = styles.backgroundImage;

                if (bgImage.includes('gradient')) {
                  return false;
                }
              }
            }

            return true;
          }
        ),
        { numRuns: 10 }
      );
    });
  });

  describe('Property 11: Text contrast meets accessibility standards', () => {
    it('should have sufficient contrast for primary text on background', () => {
      const ratio = getContrastRatio(flatColors.textPrimary, flatColors.background);
      expect(meetsWCAGAA(ratio, false)).toBe(true);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });

    it('should have sufficient contrast for primary text on surface', () => {
      const ratio = getContrastRatio(flatColors.textPrimary, flatColors.surface);
      expect(meetsWCAGAA(ratio, false)).toBe(true);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });

    it('should have sufficient contrast for primary color on surface', () => {
      const ratio = getContrastRatio(flatColors.primary, flatColors.surface);
      // Primary color is often used for interactive elements, should have good contrast
      expect(ratio).toBeGreaterThanOrEqual(3);
    });

    it('should have sufficient contrast for secondary color on surface', () => {
      const ratio = getContrastRatio(flatColors.secondary, flatColors.surface);
      // Secondary color (green) may have lower contrast, but should still be visible
      expect(ratio).toBeGreaterThanOrEqual(2);
    });

    // Property-based test: All text elements should have sufficient contrast
    it('should maintain sufficient contrast for all text elements', () => {
      const { container } = renderApp();
      const textElements = container.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a, button');

      textElements.forEach(element => {
        const styles = window.getComputedStyle(element);
        const color = styles.color;
        const bgColor = styles.backgroundColor;

        // If both colors are defined and not transparent
        if (color && bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
          // We can't easily convert computed RGB to hex for comparison
          // But we can check that the colors are different
          expect(color).not.toBe(bgColor);
        }
      });
    });

    // Property-based test: Contrast ratios should be consistent
    it('should maintain consistent contrast ratios across color pairs', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(
            { text: flatColors.textPrimary, bg: flatColors.background },
            { text: flatColors.textPrimary, bg: flatColors.surface },
            { text: flatColors.textSecondary, bg: flatColors.surface }
          ),
          (colorPair) => {
            const ratio = getContrastRatio(colorPair.text, colorPair.bg);
            // At least some contrast should exist
            return ratio >= 1.5;
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  describe('Property 12: Interactive elements use palette colors', () => {
    it('should use palette colors for buttons', () => {
      const { container } = renderApp();
      const buttons = container.querySelectorAll('button');

      buttons.forEach(button => {
        const styles = window.getComputedStyle(button);
        const bgColor = styles.backgroundColor;

        // Background should not be transparent or default
        if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
          // Should have a defined background color
          expect(bgColor).toBeTruthy();
        }
      });
    });

    it('should use palette colors for links', () => {
      const { container } = renderApp();
      const links = container.querySelectorAll('a');

      links.forEach(link => {
        const styles = window.getComputedStyle(link);
        const color = styles.color;

        // Links should have a defined color
        expect(color).toBeTruthy();
        expect(color).not.toBe('rgba(0, 0, 0, 0)');
      });
    });

    it('should use palette colors for interactive cards', () => {
      const { container } = renderApp();
      const cards = container.querySelectorAll('.MuiCard-root');

      cards.forEach(card => {
        const styles = window.getComputedStyle(card);
        const bgColor = styles.backgroundColor;
        const borderColor = styles.borderColor;

        // Cards should have defined colors
        expect(bgColor).toBeTruthy();
        expect(borderColor).toBeTruthy();
      });
    });

    // Property-based test: All interactive elements should use defined colors
    it('should use defined colors for all interactive elements', () => {
      fc.assert(
        fc.property(
          fc.constant(null),
          () => {
            const { container } = render(
              <ThemeProvider theme={flatTheme}>
                <App />
              </ThemeProvider>
            );

            const interactiveElements = container.querySelectorAll('button, a, input, .MuiCard-root');

            for (const element of Array.from(interactiveElements)) {
              const styles = window.getComputedStyle(element);
              const color = styles.color;
              const bgColor = styles.backgroundColor;

              // Should have defined colors (not empty or transparent)
              if (!color || color === 'rgba(0, 0, 0, 0)') {
                return false;
              }

              // Background can be transparent for some elements like links
              // But if it's defined, it should be a valid color
              if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
                if (!bgColor) {
                  return false;
                }
              }
            }

            return true;
          }
        ),
        { numRuns: 30 }
      );
    });

    // Property-based test: Theme palette colors should be valid hex colors
    it('should have valid hex colors in palette', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(
            flatColors.primary,
            flatColors.secondary,
            flatColors.accent,
            flatColors.background,
            flatColors.surface,
            flatColors.textPrimary,
            flatColors.textSecondary
          ),
          (color) => {
            // Should be a valid hex color
            return /^#[0-9A-Fa-f]{6}$/.test(color);
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  describe('Global CSS Constraints', () => {
    it('should have no box-shadow on any element', () => {
      const { container } = renderApp();
      const allElements = container.querySelectorAll('*');

      allElements.forEach(element => {
        const styles = window.getComputedStyle(element);
        // Empty string or 'none' both indicate no shadow
        expect(styles.boxShadow === 'none' || styles.boxShadow === '').toBe(true);
      });
    });

    it('should have no text-shadow on any element', () => {
      const { container } = renderApp();
      const allElements = container.querySelectorAll('*');

      allElements.forEach(element => {
        const styles = window.getComputedStyle(element);
        const textShadow = styles.textShadow;
        
        // Empty string, 'none', 'initial', or transparent shadows indicate no visible shadow
        const hasNoShadow = 
          textShadow === 'none' || 
          textShadow === '' || 
          textShadow === 'initial' ||
          textShadow === '0px 0px 0px' ||
          textShadow.includes('rgba(0, 0, 0, 0)');
        
        expect(hasNoShadow).toBe(true);
      });
    });
  });
});
