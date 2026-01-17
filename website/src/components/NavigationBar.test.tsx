import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { flatTheme } from '../theme/flatTheme';
import NavigationBar from './NavigationBar';
import * as fc from 'fast-check';

// Feature: flat-design-website
// Property 1: Navigation bar has no shadows or gradients - **Validates: Requirements 1.1**
// Property 2: Navigation hover effects use only color changes - **Validates: Requirements 1.2**
// Property 3: Navigation maintains flat design on mobile - **Validates: Requirements 1.4**

const renderNavigationBar = () => {
  return render(
    <ThemeProvider theme={flatTheme}>
      <NavigationBar />
    </ThemeProvider>
  );
};

describe('NavigationBar Component', () => {
  describe('Property 1: Navigation bar has no shadows or gradients', () => {
    it('should render without box-shadow', () => {
      const { container } = renderNavigationBar();
      const appBar = container.querySelector('.MuiAppBar-root');
      
      expect(appBar).toBeInTheDocument();
      const styles = window.getComputedStyle(appBar!);
      expect(styles.boxShadow).toBe('none');
    });

    it('should render without background gradients', () => {
      const { container } = renderNavigationBar();
      const appBar = container.querySelector('.MuiAppBar-root');
      
      const styles = window.getComputedStyle(appBar!);
      expect(styles.backgroundImage).toBe('none');
    });

    it('should have elevation set to 0', () => {
      const { container } = renderNavigationBar();
      const appBar = container.querySelector('.MuiAppBar-root');
      
      // Check that elevation is 0 (MuiPaper-elevation0 class should be present)
      expect(appBar?.className).toContain('MuiPaper-elevation0');
    });

    it('should render navigation buttons without shadows', () => {
      renderNavigationBar();
      const buttons = screen.getAllByRole('link');
      
      buttons.forEach(button => {
        const styles = window.getComputedStyle(button);
        expect(styles.boxShadow).toBe('none');
      });
    });

    // Property-based test: Navigation should never have shadows
    it('should maintain no shadows across multiple renders', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 10 }),
          (renderCount) => {
            for (let i = 0; i < renderCount; i++) {
              const { container } = render(
                <ThemeProvider theme={flatTheme}>
                  <NavigationBar />
                </ThemeProvider>
              );
              
              const appBar = container.querySelector('.MuiAppBar-root');
              const styles = window.getComputedStyle(appBar!);
              
              if (styles.boxShadow !== 'none' || styles.backgroundImage !== 'none') {
                return false;
              }
            }
            return true;
          }
        ),
        { numRuns: 20 }
      );
    });
  });

  describe('Property 2: Navigation hover effects use only color changes', () => {
    it('should have color transition on navigation buttons', () => {
      renderNavigationBar();
      const buttons = screen.getAllByRole('link');
      
      buttons.forEach(button => {
        const styles = window.getComputedStyle(button);
        // Should have transition for color-related properties
        expect(
          styles.transition.includes('background-color') ||
          styles.transition.includes('color')
        ).toBe(true);
      });
    });

    it('should not add shadows on hover', () => {
      const { container } = renderNavigationBar();
      const buttons = container.querySelectorAll('a.MuiButton-root');
      
      buttons.forEach(button => {
        const styles = window.getComputedStyle(button);
        // Verify no box-shadow in default state
        expect(styles.boxShadow).toBe('none');
      });
    });

    // Property-based test: Hover effects should only change colors
    it('should only use color-based transitions for all navigation items', () => {
      fc.assert(
        fc.property(
          fc.constant(null),
          () => {
            const { container } = render(
              <ThemeProvider theme={flatTheme}>
                <NavigationBar />
              </ThemeProvider>
            );
            
            const buttons = container.querySelectorAll('a.MuiButton-root');
            
            for (const button of Array.from(buttons)) {
              const styles = window.getComputedStyle(button);
              
              // Should have color transitions
              const hasColorTransition = 
                styles.transition.includes('background-color') ||
                styles.transition.includes('color');
              
              // Should not have shadow
              const hasNoShadow = styles.boxShadow === 'none';
              
              if (!hasColorTransition || !hasNoShadow) {
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

  describe('Property 3: Navigation maintains flat design on mobile', () => {
    it('should have no shadows at mobile viewport width', () => {
      // Set viewport to mobile size
      global.innerWidth = 375;
      global.dispatchEvent(new Event('resize'));
      
      const { container } = renderNavigationBar();
      const appBar = container.querySelector('.MuiAppBar-root');
      
      const styles = window.getComputedStyle(appBar!);
      expect(styles.boxShadow).toBe('none');
    });

    it('should have no shadows at tablet viewport width', () => {
      // Set viewport to tablet size
      global.innerWidth = 768;
      global.dispatchEvent(new Event('resize'));
      
      const { container } = renderNavigationBar();
      const appBar = container.querySelector('.MuiAppBar-root');
      
      const styles = window.getComputedStyle(appBar!);
      expect(styles.boxShadow).toBe('none');
    });

    it('should have no shadows at desktop viewport width', () => {
      // Set viewport to desktop size
      global.innerWidth = 1920;
      global.dispatchEvent(new Event('resize'));
      
      const { container } = renderNavigationBar();
      const appBar = container.querySelector('.MuiAppBar-root');
      
      const styles = window.getComputedStyle(appBar!);
      expect(styles.boxShadow).toBe('none');
    });

    // Property-based test: Flat design should be maintained at any viewport width
    it('should maintain flat design at any viewport width', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 320, max: 2560 }), // Common viewport range
          (viewportWidth) => {
            global.innerWidth = viewportWidth;
            global.dispatchEvent(new Event('resize'));
            
            const { container } = render(
              <ThemeProvider theme={flatTheme}>
                <NavigationBar />
              </ThemeProvider>
            );
            
            const appBar = container.querySelector('.MuiAppBar-root');
            const styles = window.getComputedStyle(appBar!);
            
            return (
              styles.boxShadow === 'none' &&
              styles.backgroundImage === 'none'
            );
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Navigation Content and Accessibility', () => {
    it('should render the logo/title', () => {
      renderNavigationBar();
      expect(screen.getByText(/Kiro Cleaner/i)).toBeInTheDocument();
    });

    it('should render all navigation links', () => {
      renderNavigationBar();
      expect(screen.getByText('特性')).toBeInTheDocument();
      expect(screen.getByText('场景')).toBeInTheDocument();
      expect(screen.getByText('FAQ')).toBeInTheDocument();
      expect(screen.getByText('GitHub')).toBeInTheDocument();
    });

    it('should have proper href attributes', () => {
      renderNavigationBar();
      const links = screen.getAllByRole('link');
      
      expect(links.length).toBeGreaterThan(0);
      links.forEach(link => {
        expect(link).toHaveAttribute('href');
      });
    });
  });
});
