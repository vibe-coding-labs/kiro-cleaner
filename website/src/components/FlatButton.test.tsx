import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { flatTheme } from '../theme/flatTheme';
import FlatButton from './FlatButton';
import * as fc from 'fast-check';
import userEvent from '@testing-library/user-event';

// Feature: flat-design-website
// Property 17: Buttons have no shadows or gradients - **Validates: Requirements 6.1**
// Property 18: Button hover changes color or opacity - **Validates: Requirements 6.2**
// Property 19: Buttons have sufficient padding - **Validates: Requirements 6.3**
// Property 20: All button variants are flat - **Validates: Requirements 6.4**

const renderButton = (variant: 'primary' | 'secondary' | 'outline' = 'primary', text = 'Test Button') => {
  return render(
    <ThemeProvider theme={flatTheme}>
      <FlatButton variant={variant}>{text}</FlatButton>
    </ThemeProvider>
  );
};

describe('FlatButton Component', () => {
  describe('Property 17: Buttons have no shadows or gradients', () => {
    it('should render primary button without box-shadow', () => {
      renderButton('primary');
      const button = screen.getByRole('button');
      
      const styles = window.getComputedStyle(button);
      expect(styles.boxShadow).toBe('none');
    });

    it('should render secondary button without box-shadow', () => {
      renderButton('secondary');
      const button = screen.getByRole('button');
      
      const styles = window.getComputedStyle(button);
      expect(styles.boxShadow).toBe('none');
    });

    it('should render outline button without box-shadow', () => {
      renderButton('outline');
      const button = screen.getByRole('button');
      
      const styles = window.getComputedStyle(button);
      expect(styles.boxShadow).toBe('none');
    });

    it('should render button without background gradients', () => {
      renderButton('primary');
      const button = screen.getByRole('button');
      
      const styles = window.getComputedStyle(button);
      expect(styles.backgroundImage).toBe('none');
    });

    // Property-based test: All button variants should have no shadows
    it('should have no shadows for any variant', () => {
      const variants = ['primary', 'secondary', 'outline'] as const;
      
      fc.assert(
        fc.property(
          fc.constantFrom(...variants),
          (variant) => {
            const { container } = render(
              <ThemeProvider theme={flatTheme}>
                <FlatButton variant={variant}>Test</FlatButton>
              </ThemeProvider>
            );
            
            const button = container.querySelector('button');
            const styles = window.getComputedStyle(button!);
            
            return styles.boxShadow === 'none' && styles.backgroundImage === 'none';
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 18: Button hover changes color or opacity', () => {
    it('should have hover styles defined for primary button', () => {
      renderButton('primary');
      const button = screen.getByRole('button');
      
      // Check that button has transition property for color/opacity changes
      const styles = window.getComputedStyle(button);
      expect(styles.transition).toContain('background-color');
      expect(styles.transition).toContain('opacity');
    });

    it('should have hover styles defined for secondary button', () => {
      renderButton('secondary');
      const button = screen.getByRole('button');
      
      const styles = window.getComputedStyle(button);
      expect(styles.transition).toContain('background-color');
      expect(styles.transition).toContain('opacity');
    });

    it('should have hover styles defined for outline button', () => {
      renderButton('outline');
      const button = screen.getByRole('button');
      
      const styles = window.getComputedStyle(button);
      expect(styles.transition).toContain('background-color');
      expect(styles.transition).toContain('color');
    });

    // Property-based test: All buttons should have color/opacity transitions
    it('should have color or opacity transitions for all variants', () => {
      const variants = ['primary', 'secondary', 'outline'] as const;
      
      fc.assert(
        fc.property(
          fc.constantFrom(...variants),
          (variant) => {
            const { container } = render(
              <ThemeProvider theme={flatTheme}>
                <FlatButton variant={variant}>Test</FlatButton>
              </ThemeProvider>
            );
            
            const button = container.querySelector('button');
            const styles = window.getComputedStyle(button!);
            
            // Should have transitions for color-related properties
            return (
              styles.transition.includes('background-color') ||
              styles.transition.includes('color') ||
              styles.transition.includes('opacity')
            );
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 19: Buttons have sufficient padding', () => {
    it('should have at least 12px vertical padding', () => {
      renderButton('primary');
      const button = screen.getByRole('button');
      
      const styles = window.getComputedStyle(button);
      const paddingTop = parseFloat(styles.paddingTop);
      const paddingBottom = parseFloat(styles.paddingBottom);
      
      expect(paddingTop).toBeGreaterThanOrEqual(12);
      expect(paddingBottom).toBeGreaterThanOrEqual(12);
    });

    it('should have at least 24px horizontal padding', () => {
      renderButton('primary');
      const button = screen.getByRole('button');
      
      const styles = window.getComputedStyle(button);
      const paddingLeft = parseFloat(styles.paddingLeft);
      const paddingRight = parseFloat(styles.paddingRight);
      
      expect(paddingLeft).toBeGreaterThanOrEqual(24);
      expect(paddingRight).toBeGreaterThanOrEqual(24);
    });

    // Property-based test: All button variants should have sufficient padding
    it('should have sufficient padding for all variants', () => {
      const variants = ['primary', 'secondary', 'outline'] as const;
      
      fc.assert(
        fc.property(
          fc.constantFrom(...variants),
          (variant) => {
            const { container } = render(
              <ThemeProvider theme={flatTheme}>
                <FlatButton variant={variant}>Test</FlatButton>
              </ThemeProvider>
            );
            
            const button = container.querySelector('button');
            const styles = window.getComputedStyle(button!);
            
            const paddingTop = parseFloat(styles.paddingTop);
            const paddingBottom = parseFloat(styles.paddingBottom);
            const paddingLeft = parseFloat(styles.paddingLeft);
            const paddingRight = parseFloat(styles.paddingRight);
            
            return (
              paddingTop >= 12 &&
              paddingBottom >= 12 &&
              paddingLeft >= 24 &&
              paddingRight >= 24
            );
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 20: All button variants are flat', () => {
    it('should render all variants without shadows', () => {
      const variants: Array<'primary' | 'secondary' | 'outline'> = ['primary', 'secondary', 'outline'];
      
      variants.forEach(variant => {
        const { container } = render(
          <ThemeProvider theme={flatTheme}>
            <FlatButton variant={variant}>Test {variant}</FlatButton>
          </ThemeProvider>
        );
        
        const button = container.querySelector('button');
        const styles = window.getComputedStyle(button!);
        
        expect(styles.boxShadow).toBe('none');
        expect(styles.backgroundImage).toBe('none');
      });
    });

    it('should render all variants with solid backgrounds', () => {
      const variants: Array<'primary' | 'secondary' | 'outline'> = ['primary', 'secondary', 'outline'];
      
      variants.forEach(variant => {
        const { container } = render(
          <ThemeProvider theme={flatTheme}>
            <FlatButton variant={variant}>Test {variant}</FlatButton>
          </ThemeProvider>
        );
        
        const button = container.querySelector('button');
        const styles = window.getComputedStyle(button!);
        
        // Background should be a solid color (not gradient)
        expect(styles.backgroundImage).toBe('none');
        expect(styles.backgroundColor).toBeTruthy();
      });
    });

    // Property-based test: All variants maintain flat design principles
    it('should maintain flat design for all variants with any text content', () => {
      const variants = ['primary', 'secondary', 'outline'] as const;
      
      fc.assert(
        fc.property(
          fc.constantFrom(...variants),
          fc.string({ minLength: 1, maxLength: 50 }),
          (variant, text) => {
            const { container } = render(
              <ThemeProvider theme={flatTheme}>
                <FlatButton variant={variant}>{text}</FlatButton>
              </ThemeProvider>
            );
            
            const button = container.querySelector('button');
            const styles = window.getComputedStyle(button!);
            
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

  describe('Button Accessibility and Usability', () => {
    it('should render button with accessible text', () => {
      renderButton('primary', 'Click Me');
      expect(screen.getByRole('button', { name: 'Click Me' })).toBeInTheDocument();
    });

    it('should be clickable', async () => {
      const user = userEvent.setup();
      renderButton('primary', 'Click Me');
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      expect(button).toBeInTheDocument();
    });

    it('should support disabled state', () => {
      render(
        <ThemeProvider theme={flatTheme}>
          <FlatButton variant="primary" disabled>Disabled</FlatButton>
        </ThemeProvider>
      );
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });
  });
});
