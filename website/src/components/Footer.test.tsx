import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { flatTheme } from '../theme/flatTheme';
import { flatTypography } from '../theme/typography';
import App from '../App';
import * as fc from 'fast-check';

// Feature: flat-design-website
// Property 27: Footer has no gradients or shadows - **Validates: Requirements 9.1**
// Property 28: Footer typography is consistent - **Validates: Requirements 9.2**

const renderApp = () => {
  return render(
    <ThemeProvider theme={flatTheme}>
      <App />
    </ThemeProvider>
  );
};

describe('Footer Component', () => {
  describe('Property 27: Footer has no gradients or shadows', () => {
    it('should have no box-shadow in footer', () => {
      const { container } = renderApp();
      // Footer is the last Box in the App
      const boxes = container.querySelectorAll('.MuiBox-root');
      const footer = Array.from(boxes).find(box => {
        return box.textContent?.includes('Kiro Cleaner') && box.textContent?.includes('All rights reserved');
      });

      if (footer) {
        const styles = window.getComputedStyle(footer);
        const boxShadow = styles.boxShadow;
        expect(boxShadow === 'none' || boxShadow === '').toBe(true);
      }
    });

    it('should have solid background in footer', () => {
      const { container } = renderApp();
      const boxes = container.querySelectorAll('.MuiBox-root');
      const footer = Array.from(boxes).find(box => {
        return box.textContent?.includes('All rights reserved');
      });

      if (footer) {
        const styles = window.getComputedStyle(footer);
        expect(styles.backgroundImage === 'none' || styles.backgroundImage === '').toBe(true);
      }
    });

    // Property-based test
    it('should maintain flat design across renders', () => {
      fc.assert(
        fc.property(
          fc.constant(null),
          () => {
            const { container } = render(
              <ThemeProvider theme={flatTheme}>
                <App />
              </ThemeProvider>
            );

            const boxes = container.querySelectorAll('.MuiBox-root');
            const footer = Array.from(boxes).find(box => {
              return box.textContent?.includes('All rights reserved');
            });

            if (footer) {
              const styles = window.getComputedStyle(footer);
              const boxShadow = styles.boxShadow;
              const bgImage = styles.backgroundImage;

              if ((boxShadow !== 'none' && boxShadow !== '') || 
                  (bgImage !== 'none' && bgImage !== '')) {
                return false;
              }
            }

            return true;
          }
        ),
        { numRuns: 30 }
      );
    });
  });

  describe('Property 28: Footer typography is consistent', () => {
    it('should use theme typography in footer', () => {
      const { container } = renderApp();
      const footerText = container.querySelectorAll('.MuiTypography-root');
      
      let foundFooterText = false;
      footerText.forEach(text => {
        if (text.textContent?.includes('All rights reserved')) {
          foundFooterText = true;
          const styles = window.getComputedStyle(text);
          const fontFamily = styles.fontFamily.toLowerCase();

          // Should use sans-serif font
          const hasSansSerif = 
            fontFamily.includes('sans-serif') ||
            fontFamily.includes('system-ui') ||
            fontFamily.includes('arial') ||
            fontFamily.includes('helvetica') ||
            fontFamily.includes('roboto');

          expect(hasSansSerif).toBe(true);
        }
      });

      expect(foundFooterText).toBe(true);
    });

    it('should have consistent spacing in footer', () => {
      const { container } = renderApp();
      const boxes = container.querySelectorAll('.MuiBox-root');
      const footer = Array.from(boxes).find(box => {
        return box.textContent?.includes('All rights reserved');
      });

      if (footer) {
        const styles = window.getComputedStyle(footer);
        // Should have padding
        expect(styles.padding || styles.paddingTop).toBeTruthy();
      }
    });

    // Property-based test
    it('should maintain consistent typography across renders', () => {
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

              const footerText = container.querySelectorAll('.MuiTypography-root');
              
              for (const text of Array.from(footerText)) {
                if (text.textContent?.includes('All rights reserved')) {
                  const styles = window.getComputedStyle(text);
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
            }

            return true;
          }
        ),
        { numRuns: 20 }
      );
    });
  });

  describe('Footer Content', () => {
    it('should render footer with Kiro Cleaner branding', () => {
      const { container } = renderApp();
      const text = container.textContent;

      expect(text).toContain('Kiro Cleaner');
    });

    it('should render copyright notice', () => {
      const { container } = renderApp();
      const text = container.textContent;

      expect(text).toContain('All rights reserved');
    });
  });
});
