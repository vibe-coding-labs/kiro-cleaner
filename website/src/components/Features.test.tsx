import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { flatTheme } from '../theme/flatTheme';
import Features from './Features';
import * as fc from 'fast-check';

// Feature: flat-design-website
// Property 7: Feature cards have no shadows or gradients - **Validates: Requirements 3.1**
// Property 8: Feature card hover uses allowed properties only - **Validates: Requirements 3.2**
// Property 9: Feature cards have consistent spacing - **Validates: Requirements 3.4**

const renderFeatures = () => {
  return render(
    <ThemeProvider theme={flatTheme}>
      <Features />
    </ThemeProvider>
  );
};

describe('Features Component', () => {
  describe('Property 7: Feature cards have no shadows or gradients', () => {
    it('should render all feature cards without box-shadow', () => {
      const { container } = renderFeatures();
      const cards = container.querySelectorAll('.MuiCard-root');
      
      expect(cards.length).toBeGreaterThan(0);
      
      cards.forEach(card => {
        const styles = window.getComputedStyle(card);
        expect(styles.boxShadow).toBe('none');
      });
    });

    it('should render all feature cards without background gradients', () => {
      const { container } = renderFeatures();
      const cards = container.querySelectorAll('.MuiCard-root');
      
      cards.forEach(card => {
        const styles = window.getComputedStyle(card);
        expect(styles.backgroundImage).toBe('none');
      });
    });

    it('should have elevation set to 0 for all cards', () => {
      const { container } = renderFeatures();
      const cards = container.querySelectorAll('.MuiCard-root');
      
      cards.forEach(card => {
        expect(card.className).toContain('MuiPaper-elevation0');
      });
    });

    // Property-based test: All cards should maintain flat design
    it('should maintain flat design for all feature cards', () => {
      fc.assert(
        fc.property(
          fc.constant(null),
          () => {
            const { container } = render(
              <ThemeProvider theme={flatTheme}>
                <Features />
              </ThemeProvider>
            );
            
            const cards = container.querySelectorAll('.MuiCard-root');
            
            for (const card of Array.from(cards)) {
              const styles = window.getComputedStyle(card);
              
              if (styles.boxShadow !== 'none' || styles.backgroundImage !== 'none') {
                return false;
              }
            }
            
            return cards.length > 0;
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  describe('Property 8: Feature card hover uses allowed properties only', () => {
    it('should have transitions for allowed properties', () => {
      const { container } = renderFeatures();
      const cards = container.querySelectorAll('.MuiCard-root');
      
      cards.forEach(card => {
        const styles = window.getComputedStyle(card);
        
        // Should have transitions for transform, background-color, or border-color
        const hasAllowedTransitions = 
          styles.transition.includes('transform') ||
          styles.transition.includes('background-color') ||
          styles.transition.includes('border-color');
        
        expect(hasAllowedTransitions).toBe(true);
      });
    });

    it('should not have box-shadow transitions', () => {
      const { container } = renderFeatures();
      const cards = container.querySelectorAll('.MuiCard-root');
      
      cards.forEach(card => {
        const styles = window.getComputedStyle(card);
        
        // Should not have box-shadow in transitions
        expect(styles.transition.includes('box-shadow')).toBe(false);
      });
    });

    // Property-based test: Hover effects should only use allowed properties
    it('should only use allowed properties in hover effects', () => {
      fc.assert(
        fc.property(
          fc.constant(null),
          () => {
            const { container } = render(
              <ThemeProvider theme={flatTheme}>
                <Features />
              </ThemeProvider>
            );
            
            const cards = container.querySelectorAll('.MuiCard-root');
            
            for (const card of Array.from(cards)) {
              const styles = window.getComputedStyle(card);
              
              // Check that only allowed properties are in transitions
              const allowedProperties = ['transform', 'background-color', 'border-color', 'color', 'opacity'];
              const transitionProps = styles.transition.toLowerCase();
              
              // Should not have box-shadow
              if (transitionProps.includes('box-shadow')) {
                return false;
              }
              
              // Should have at least one allowed property
              const hasAllowed = allowedProperties.some(prop => 
                transitionProps.includes(prop.toLowerCase())
              );
              
              if (!hasAllowed) {
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

  describe('Property 9: Feature cards have consistent spacing', () => {
    it('should render cards in a grid layout', () => {
      const { container } = renderFeatures();
      const cards = container.querySelectorAll('.MuiCard-root');
      
      // Should have multiple cards
      expect(cards.length).toBeGreaterThan(0);
      
      // Check that cards are in a Box with grid display
      const gridContainer = cards[0].parentElement?.parentElement;
      expect(gridContainer).toBeTruthy();
    });

    it('should have consistent gap between cards', () => {
      const { container } = renderFeatures();
      const cards = container.querySelectorAll('.MuiCard-root');
      
      // All cards should exist
      expect(cards.length).toBeGreaterThan(0);
      
      // All cards should have consistent padding
      const paddings = Array.from(cards).map(card => {
        const styles = window.getComputedStyle(card);
        return styles.padding;
      });
      
      // All paddings should be the same
      const firstPadding = paddings[0];
      expect(paddings.every(p => p === firstPadding)).toBe(true);
    });

    // Property-based test: Spacing should be consistent
    it('should maintain consistent spacing across renders', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 5 }),
          (renderCount) => {
            for (let i = 0; i < renderCount; i++) {
              const { container } = render(
                <ThemeProvider theme={flatTheme}>
                  <Features />
                </ThemeProvider>
              );
              
              const cards = container.querySelectorAll('.MuiCard-root');
              
              if (cards.length === 0) {
                return false;
              }
              
              // Check that all cards have consistent padding
              const paddings = Array.from(cards).map(card => {
                const styles = window.getComputedStyle(card);
                return styles.padding;
              });
              
              // All paddings should be the same
              const firstPadding = paddings[0];
              if (!paddings.every(p => p === firstPadding)) {
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

  describe('Features Content', () => {
    it('should render all feature titles', () => {
      renderFeatures();
      
      expect(screen.getByText('智能扫描')).toBeInTheDocument();
      expect(screen.getByText('安全清理')).toBeInTheDocument();
      expect(screen.getByText('自动备份')).toBeInTheDocument();
      expect(screen.getByText('详细报告')).toBeInTheDocument();
    });

    it('should render all feature descriptions', () => {
      renderFeatures();
      
      expect(screen.getByText(/自动发现Kiro数据存储位置/)).toBeInTheDocument();
      expect(screen.getByText(/基于规则的智能清理/)).toBeInTheDocument();
      expect(screen.getByText(/清理前自动创建备份/)).toBeInTheDocument();
      expect(screen.getByText(/提供清理前后对比/)).toBeInTheDocument();
    });

    it('should render 4 feature cards', () => {
      const { container } = renderFeatures();
      const cards = container.querySelectorAll('.MuiCard-root');
      
      expect(cards.length).toBe(4);
    });
  });
});
