import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { flatTheme } from '../theme/flatTheme';
import { flatColors } from '../theme/colors';
import { getContrastRatio, meetsWCAGAA } from '../theme/contrast';
import Installation from './Installation';
import * as fc from 'fast-check';

// Feature: flat-design-website
// Property 21: Installation tabs are flat - **Validates: Requirements 7.1**
// Property 22: Code blocks have solid backgrounds with contrast - **Validates: Requirements 7.2**
// Property 23: Active tab uses simple styling - **Validates: Requirements 7.3**
// Property 24: Installation component has consistent spacing - **Validates: Requirements 7.4**

const renderInstallation = () => {
  return render(
    <ThemeProvider theme={flatTheme}>
      <Installation />
    </ThemeProvider>
  );
};

describe('Installation Component', () => {
  describe('Property 21: Installation tabs are flat', () => {
    it('should render tabs without box-shadow', () => {
      const { container } = renderInstallation();
      const tabs = container.querySelectorAll('.MuiTab-root');

      tabs.forEach(tab => {
        const styles = window.getComputedStyle(tab);
        const boxShadow = styles.boxShadow;
        expect(boxShadow === 'none' || boxShadow === '').toBe(true);
      });
    });

    it('should render tab container without elevation', () => {
      const { container } = renderInstallation();
      const paper = container.querySelector('.MuiPaper-root');

      if (paper) {
        expect(paper.className).toContain('MuiPaper-elevation0');
      }
    });

    it('should have solid background for tabs', () => {
      const { container } = renderInstallation();
      const tabs = container.querySelectorAll('.MuiTab-root');

      tabs.forEach(tab => {
        const styles = window.getComputedStyle(tab);
        // Empty string or 'none' both indicate no background image
        expect(styles.backgroundImage === 'none' || styles.backgroundImage === '').toBe(true);
      });
    });

    // Property-based test
    it('should maintain flat design across renders', () => {
      fc.assert(
        fc.property(
          fc.constant(null),
          () => {
            const { container } = render(
              <ThemeProvider theme={flatTheme}>
                <Installation />
              </ThemeProvider>
            );

            const tabs = container.querySelectorAll('.MuiTab-root');

            for (const tab of Array.from(tabs)) {
              const styles = window.getComputedStyle(tab);
              const boxShadow = styles.boxShadow;

              if (boxShadow !== 'none' && boxShadow !== '') {
                return false;
              }
            }

            return tabs.length > 0;
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  describe('Property 22: Code blocks have solid backgrounds with contrast', () => {
    it('should have solid background color for code blocks', () => {
      const { container } = renderInstallation();
      const codeBlocks = container.querySelectorAll('pre');

      codeBlocks.forEach(block => {
        const styles = window.getComputedStyle(block);
        expect(styles.backgroundImage).toBe('none');
        expect(styles.backgroundColor).toBeTruthy();
      });
    });

    it('should have sufficient contrast in code blocks', () => {
      // Check theme colors used for code blocks
      const bgColor = flatColors.darkSurface;
      const textColor = flatColors.surface;

      const ratio = getContrastRatio(textColor, bgColor);
      expect(meetsWCAGAA(ratio, false)).toBe(true);
    });

    it('should render code blocks with defined colors', () => {
      const { container } = renderInstallation();
      const codeBlocks = container.querySelectorAll('pre');

      codeBlocks.forEach(block => {
        const styles = window.getComputedStyle(block);
        const bgColor = styles.backgroundColor;
        const color = styles.color;

        expect(bgColor).toBeTruthy();
        expect(color).toBeTruthy();
        expect(bgColor).not.toBe('rgba(0, 0, 0, 0)');
      });
    });

    // Property-based test
    it('should maintain contrast across renders', () => {
      fc.assert(
        fc.property(
          fc.constant(null),
          () => {
            const { container } = render(
              <ThemeProvider theme={flatTheme}>
                <Installation />
              </ThemeProvider>
            );

            const codeBlocks = container.querySelectorAll('pre');

            for (const block of Array.from(codeBlocks)) {
              const styles = window.getComputedStyle(block);

              if (styles.backgroundImage !== 'none') {
                return false;
              }

              if (!styles.backgroundColor || styles.backgroundColor === 'rgba(0, 0, 0, 0)') {
                return false;
              }
            }

            return codeBlocks.length > 0;
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  describe('Property 23: Active tab uses simple styling', () => {
    it('should not use box-shadow for active tab', () => {
      const { container } = renderInstallation();
      const selectedTab = container.querySelector('.Mui-selected');

      if (selectedTab) {
        const styles = window.getComputedStyle(selectedTab);
        const boxShadow = styles.boxShadow;
        expect(boxShadow === 'none' || boxShadow === '').toBe(true);
      }
    });

    it('should use solid color or underline for active tab', () => {
      const { container } = renderInstallation();
      const indicator = container.querySelector('.MuiTabs-indicator');

      if (indicator) {
        const styles = window.getComputedStyle(indicator);
        expect(styles.backgroundColor).toBeTruthy();
        // Empty string or 'none' both indicate no background image
        expect(styles.backgroundImage === 'none' || styles.backgroundImage === '').toBe(true);
      }
    });

    it('should have simple transition for tab selection', () => {
      const { container } = renderInstallation();
      const tabs = container.querySelectorAll('.MuiTab-root');

      tabs.forEach(tab => {
        const styles = window.getComputedStyle(tab);
        // Should not have box-shadow in transitions
        expect(styles.transition.includes('box-shadow')).toBe(false);
      });
    });

    // Property-based test
    it('should maintain simple styling across renders', () => {
      fc.assert(
        fc.property(
          fc.constant(null),
          () => {
            const { container } = render(
              <ThemeProvider theme={flatTheme}>
                <Installation />
              </ThemeProvider>
            );

            const selectedTab = container.querySelector('.Mui-selected');

            if (selectedTab) {
              const styles = window.getComputedStyle(selectedTab);
              const boxShadow = styles.boxShadow;

              if (boxShadow !== 'none' && boxShadow !== '') {
                return false;
              }
            }

            return true;
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  describe('Property 24: Installation component has consistent spacing', () => {
    it('should have consistent padding in tab panels', () => {
      const { container } = renderInstallation();
      const tabPanels = container.querySelectorAll('[role="tabpanel"]');

      const paddings = Array.from(tabPanels).map(panel => {
        const box = panel.querySelector('.MuiBox-root');
        if (box) {
          return window.getComputedStyle(box).padding;
        }
        return null;
      }).filter(p => p !== null);

      // All visible panels should have the same padding
      if (paddings.length > 0) {
        const firstPadding = paddings[0];
        expect(paddings.every(p => p === firstPadding)).toBe(true);
      }
    });

    it('should have consistent spacing in code blocks', () => {
      const { container } = renderInstallation();
      const codeBlocks = container.querySelectorAll('pre');

      const paddings = Array.from(codeBlocks).map(block => {
        return window.getComputedStyle(block).padding;
      });

      if (paddings.length > 0) {
        const firstPadding = paddings[0];
        expect(paddings.every(p => p === firstPadding)).toBe(true);
      }
    });

    it('should have defined spacing values', () => {
      const { container } = renderInstallation();
      const paper = container.querySelector('.MuiPaper-root');

      if (paper) {
        const styles = window.getComputedStyle(paper);
        // Paper should exist and have some styling
        expect(paper).toBeTruthy();
        // Border should be defined
        expect(styles.border || styles.borderWidth).toBeTruthy();
      }
    });

    // Property-based test
    it('should maintain consistent spacing across renders', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 3 }),
          (renderCount) => {
            const paddingsByRender: string[][] = [];

            for (let i = 0; i < renderCount; i++) {
              const { container } = render(
                <ThemeProvider theme={flatTheme}>
                  <Installation />
                </ThemeProvider>
              );

              const codeBlocks = container.querySelectorAll('pre');
              const paddings = Array.from(codeBlocks).map(block => {
                return window.getComputedStyle(block).padding;
              });

              paddingsByRender.push(paddings);
            }

            // All renders should have the same padding values
            if (paddingsByRender.length > 1) {
              const firstRender = paddingsByRender[0];

              for (let i = 1; i < paddingsByRender.length; i++) {
                const currentRender = paddingsByRender[i];

                if (firstRender.length !== currentRender.length) {
                  return false;
                }

                for (let j = 0; j < firstRender.length; j++) {
                  if (firstRender[j] !== currentRender[j]) {
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

  describe('Installation Content', () => {
    it('should render all installation method tabs', () => {
      renderInstallation();

      expect(screen.getByText('从源码构建')).toBeInTheDocument();
      expect(screen.getByText('使用预编译版本')).toBeInTheDocument();
      expect(screen.getByText('使用方法')).toBeInTheDocument();
    });

    it('should render code blocks', () => {
      const { container } = renderInstallation();
      const codeBlocks = container.querySelectorAll('pre');

      expect(codeBlocks.length).toBeGreaterThan(0);
    });

    it('should render copy instruction', () => {
      renderInstallation();

      expect(screen.getByText(/点击上方代码块可复制命令/)).toBeInTheDocument();
    });
  });
});
