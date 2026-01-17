import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { flatTheme } from '../theme/flatTheme';
import DemoVideo from './DemoVideo';
import * as fc from 'fast-check';

// Feature: flat-design-website
// Property 25: Demo video has minimal shadows - **Validates: Requirements 8.1**
// Property 26: Video container uses solid colors - **Validates: Requirements 8.2**

const renderDemoVideo = () => {
  return render(
    <ThemeProvider theme={flatTheme}>
      <DemoVideo />
    </ThemeProvider>
  );
};

describe('DemoVideo Component', () => {
  describe('Property 25: Demo video has minimal shadows', () => {
    it('should have no box-shadow or minimal shadow', () => {
      const { container } = renderDemoVideo();
      const paper = container.querySelector('.MuiPaper-root');

      if (paper) {
        const styles = window.getComputedStyle(paper);
        const boxShadow = styles.boxShadow;
        
        // Should be 'none' or empty (no shadow)
        expect(boxShadow === 'none' || boxShadow === '').toBe(true);
      }
    });

    it('should have elevation 0', () => {
      const { container } = renderDemoVideo();
      const paper = container.querySelector('.MuiPaper-root');

      if (paper) {
        expect(paper.className).toContain('MuiPaper-elevation0');
      }
    });

    // Property-based test
    it('should maintain minimal shadows across renders', () => {
      fc.assert(
        fc.property(
          fc.constant(null),
          () => {
            const { container } = render(
              <ThemeProvider theme={flatTheme}>
                <DemoVideo />
              </ThemeProvider>
            );

            const paper = container.querySelector('.MuiPaper-root');

            if (paper) {
              const styles = window.getComputedStyle(paper);
              const boxShadow = styles.boxShadow;

              return boxShadow === 'none' || boxShadow === '';
            }

            return true;
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  describe('Property 26: Video container uses solid colors', () => {
    it('should have solid background color', () => {
      const { container } = renderDemoVideo();
      const paper = container.querySelector('.MuiPaper-root');

      if (paper) {
        const styles = window.getComputedStyle(paper);
        expect(styles.backgroundImage === 'none' || styles.backgroundImage === '').toBe(true);
        expect(styles.backgroundColor).toBeTruthy();
      }
    });

    it('should have solid border color', () => {
      const { container } = renderDemoVideo();
      const paper = container.querySelector('.MuiPaper-root');

      if (paper) {
        const styles = window.getComputedStyle(paper);
        expect(styles.borderColor).toBeTruthy();
      }
    });

    // Property-based test
    it('should maintain solid colors across renders', () => {
      fc.assert(
        fc.property(
          fc.constant(null),
          () => {
            const { container } = render(
              <ThemeProvider theme={flatTheme}>
                <DemoVideo />
              </ThemeProvider>
            );

            const paper = container.querySelector('.MuiPaper-root');

            if (paper) {
              const styles = window.getComputedStyle(paper);
              const bgImage = styles.backgroundImage;

              return bgImage === 'none' || bgImage === '';
            }

            return true;
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  describe('DemoVideo Content', () => {
    it('should render video container', () => {
      const { container } = renderDemoVideo();
      const paper = container.querySelector('.MuiPaper-root');

      expect(paper).toBeInTheDocument();
    });

    it('should render description text', () => {
      const { container } = renderDemoVideo();
      const text = container.textContent;

      expect(text).toContain('Kiro Cleaner 扫描命令演示');
    });
  });
});
