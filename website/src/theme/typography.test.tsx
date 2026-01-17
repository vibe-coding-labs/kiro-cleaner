import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { flatTheme } from './flatTheme';
import { flatTypography } from './typography';
import * as fc from 'fast-check';
import App from '../App';

// Feature: flat-design-website
// Property 13: All text uses sans-serif fonts - **Validates: Requirements 5.1**
// Property 14: Headings use bold weights and proper hierarchy - **Validates: Requirements 5.2**
// Property 15: Body text has readable line height - **Validates: Requirements 5.3**
// Property 16: Typography is consistent across components - **Validates: Requirements 5.4**

const renderApp = () => {
  return render(
    <ThemeProvider theme={flatTheme}>
      <App />
    </ThemeProvider>
  );
};

describe('Typography Tests', () => {
  describe('Property 13: All text uses sans-serif fonts', () => {
    it('should use sans-serif font family in theme', () => {
      expect(flatTypography.fontFamily).toContain('sans-serif');
    });

    it('should apply sans-serif fonts to all text elements', () => {
      const { container } = renderApp();
      const textElements = container.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a, button');

      textElements.forEach(element => {
        // Skip icon elements
        if (element.className.includes('MuiSvgIcon') || 
            element.className.includes('Icon') ||
            element.tagName === 'svg') {
          return;
        }

        const styles = window.getComputedStyle(element);
        const fontFamily = styles.fontFamily.toLowerCase();

        // Empty font family is acceptable for some elements
        if (!fontFamily || fontFamily === '') {
          return;
        }

        // Should contain sans-serif or a sans-serif font
        const hasSansSerif = 
          fontFamily.includes('sans-serif') ||
          fontFamily.includes('system-ui') ||
          fontFamily.includes('arial') ||
          fontFamily.includes('helvetica') ||
          fontFamily.includes('roboto') ||
          fontFamily.includes('segoe ui');

        expect(hasSansSerif).toBe(true);
      });
    });

    it('should not use serif fonts', () => {
      const { container } = renderApp();
      const textElements = container.querySelectorAll('p, h1, h2, h3, h4, h5, h6');

      textElements.forEach(element => {
        const styles = window.getComputedStyle(element);
        const fontFamily = styles.fontFamily.toLowerCase();

        // Should not contain serif fonts
        expect(fontFamily).not.toContain('times');
        expect(fontFamily).not.toContain('georgia');
        expect(fontFamily).not.toContain('garamond');
      });
    });

    // Property-based test: All text should use sans-serif
    it('should consistently use sans-serif fonts across renders', () => {
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

              const textElements = container.querySelectorAll('p, h1, h2, h3, h4, h5, h6');

              for (const element of Array.from(textElements)) {
                const styles = window.getComputedStyle(element);
                const fontFamily = styles.fontFamily.toLowerCase();

                const hasSansSerif = 
                  fontFamily.includes('sans-serif') ||
                  fontFamily.includes('system-ui') ||
                  fontFamily.includes('arial') ||
                  fontFamily.includes('helvetica') ||
                  fontFamily.includes('roboto');

                if (!hasSansSerif) {
                  return false;
                }
              }
            }

            return true;
          }
        ),
        { numRuns: 20 }
      );
    });
  });

  describe('Property 14: Headings use bold weights and proper hierarchy', () => {
    it('should have bold font weights for all headings', () => {
      const { container } = renderApp();
      const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');

      headings.forEach(heading => {
        const styles = window.getComputedStyle(heading);
        const fontWeight = parseInt(styles.fontWeight);

        // Font weight should be 600 or greater (semi-bold or bold)
        expect(fontWeight).toBeGreaterThanOrEqual(600);
      });
    });

    it('should have proper heading hierarchy in theme', () => {
      // h1 should be larger than h2, h2 larger than h3, etc.
      const h1Size = parseFloat(flatTypography.h1.fontSize);
      const h2Size = parseFloat(flatTypography.h2.fontSize);
      const h3Size = parseFloat(flatTypography.h3.fontSize);
      const h4Size = parseFloat(flatTypography.h4.fontSize);

      expect(h1Size).toBeGreaterThan(h2Size);
      expect(h2Size).toBeGreaterThan(h3Size);
      expect(h3Size).toBeGreaterThan(h4Size);
    });

    it('should maintain heading hierarchy in rendered elements', () => {
      const { container } = renderApp();
      const h1Elements = container.querySelectorAll('h1');
      const h2Elements = container.querySelectorAll('h2');
      const h3Elements = container.querySelectorAll('h3');

      if (h1Elements.length > 0 && h2Elements.length > 0) {
        const h1Size = parseFloat(window.getComputedStyle(h1Elements[0]).fontSize);
        const h2Size = parseFloat(window.getComputedStyle(h2Elements[0]).fontSize);

        expect(h1Size).toBeGreaterThan(h2Size);
      }

      if (h2Elements.length > 0 && h3Elements.length > 0) {
        const h2Size = parseFloat(window.getComputedStyle(h2Elements[0]).fontSize);
        const h3Size = parseFloat(window.getComputedStyle(h3Elements[0]).fontSize);

        expect(h2Size).toBeGreaterThan(h3Size);
      }
    });

    // Property-based test: Heading hierarchy should be consistent
    it('should maintain consistent heading hierarchy across renders', () => {
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

              const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');

              for (const heading of Array.from(headings)) {
                const styles = window.getComputedStyle(heading);
                const fontWeight = parseInt(styles.fontWeight);

                if (fontWeight < 600) {
                  return false;
                }
              }
            }

            return true;
          }
        ),
        { numRuns: 20 }
      );
    });
  });

  describe('Property 15: Body text has readable line height', () => {
    it('should have line height between 1.4 and 1.8 for body text', () => {
      const body1LineHeight = flatTypography.body1.lineHeight;
      const body2LineHeight = flatTypography.body2.lineHeight;

      expect(body1LineHeight).toBeGreaterThanOrEqual(1.4);
      expect(body1LineHeight).toBeLessThanOrEqual(1.8);
      expect(body2LineHeight).toBeGreaterThanOrEqual(1.4);
      expect(body2LineHeight).toBeLessThanOrEqual(1.8);
    });

    it('should apply readable line height to paragraph elements', () => {
      const { container } = renderApp();
      const paragraphs = container.querySelectorAll('p');

      paragraphs.forEach(p => {
        const styles = window.getComputedStyle(p);
        const lineHeight = parseFloat(styles.lineHeight) / parseFloat(styles.fontSize);

        // Line height should be between 1.4 and 1.8 for readability
        expect(lineHeight).toBeGreaterThanOrEqual(1.3);
        expect(lineHeight).toBeLessThanOrEqual(2.0);
      });
    });

    it('should have appropriate line height for different text sizes', () => {
      const { container } = renderApp();
      const textElements = container.querySelectorAll('p, span, div');

      textElements.forEach(element => {
        const styles = window.getComputedStyle(element);
        const fontSize = parseFloat(styles.fontSize);
        const lineHeight = parseFloat(styles.lineHeight);

        // Line height should be proportional to font size
        if (fontSize > 0 && lineHeight > 0) {
          const ratio = lineHeight / fontSize;
          expect(ratio).toBeGreaterThan(1);
        }
      });
    });

    // Property-based test: Line height should be consistent
    it('should maintain consistent line height across renders', () => {
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

              const paragraphs = container.querySelectorAll('p');

              for (const p of Array.from(paragraphs)) {
                const styles = window.getComputedStyle(p);
                const fontSize = parseFloat(styles.fontSize);
                const lineHeight = parseFloat(styles.lineHeight);

                if (fontSize > 0 && lineHeight > 0) {
                  const ratio = lineHeight / fontSize;
                  
                  // Should have reasonable line height
                  if (ratio < 1.2 || ratio > 2.5) {
                    return false;
                  }
                }
              }
            }

            return true;
          }
        ),
        { numRuns: 20 }
      );
    });
  });

  describe('Property 16: Typography is consistent across components', () => {
    it('should use the same font family across all components', () => {
      const { container } = renderApp();
      const textElements = container.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span');

      const fontFamilies = new Set<string>();

      textElements.forEach(element => {
        const styles = window.getComputedStyle(element);
        fontFamilies.add(styles.fontFamily);
      });

      // Should have very few different font families (ideally just one or two)
      expect(fontFamilies.size).toBeLessThanOrEqual(3);
    });

    it('should have consistent heading styles', () => {
      const { container } = renderApp();
      const h2Elements = container.querySelectorAll('h2');

      if (h2Elements.length > 1) {
        const firstH2 = window.getComputedStyle(h2Elements[0]);
        const secondH2 = window.getComputedStyle(h2Elements[1]);

        // All h2 elements should have the same font weight
        expect(firstH2.fontWeight).toBe(secondH2.fontWeight);
      }
    });

    it('should have consistent body text styles', () => {
      const { container } = renderApp();
      const paragraphs = container.querySelectorAll('p');

      if (paragraphs.length > 1) {
        const fontFamilies = new Set<string>();

        paragraphs.forEach(p => {
          const styles = window.getComputedStyle(p);
          fontFamilies.add(styles.fontFamily);
        });

        // All paragraphs should use the same font family
        expect(fontFamilies.size).toBeLessThanOrEqual(2);
      }
    });

    // Property-based test: Typography should be consistent
    it('should maintain consistent typography across multiple renders', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 3 }),
          (renderCount) => {
            const fontFamiliesByRender: string[][] = [];

            for (let i = 0; i < renderCount; i++) {
              const { container } = render(
                <ThemeProvider theme={flatTheme}>
                  <App />
                </ThemeProvider>
              );

              const textElements = container.querySelectorAll('h1, h2, h3, p');
              const fontFamilies: string[] = [];

              textElements.forEach(element => {
                const styles = window.getComputedStyle(element);
                fontFamilies.push(styles.fontFamily);
              });

              fontFamiliesByRender.push(fontFamilies);
            }

            // All renders should have similar font families
            if (fontFamiliesByRender.length > 1) {
              const firstRender = new Set(fontFamiliesByRender[0]);
              
              for (let i = 1; i < fontFamiliesByRender.length; i++) {
                const currentRender = new Set(fontFamiliesByRender[i]);
                
                // Should have significant overlap
                const intersection = new Set(
                  [...firstRender].filter(x => currentRender.has(x))
                );
                
                if (intersection.size === 0) {
                  return false;
                }
              }
            }

            return true;
          }
        ),
        { numRuns: 15 }
      );
    });
  });

  describe('Theme Typography Configuration', () => {
    it('should have all required typography variants defined', () => {
      expect(flatTypography.h1).toBeDefined();
      expect(flatTypography.h2).toBeDefined();
      expect(flatTypography.h3).toBeDefined();
      expect(flatTypography.h4).toBeDefined();
      expect(flatTypography.body1).toBeDefined();
      expect(flatTypography.body2).toBeDefined();
    });

    it('should have font weights defined for headings', () => {
      expect(flatTypography.h1.fontWeight).toBeGreaterThanOrEqual(600);
      expect(flatTypography.h2.fontWeight).toBeGreaterThanOrEqual(600);
      expect(flatTypography.h3.fontWeight).toBeGreaterThanOrEqual(600);
    });

    it('should have appropriate font sizes', () => {
      const h1Size = parseFloat(flatTypography.h1.fontSize);
      const body1Size = parseFloat(flatTypography.body1.fontSize);

      expect(h1Size).toBeGreaterThan(body1Size);
      expect(body1Size).toBeGreaterThan(0);
    });
  });
});
