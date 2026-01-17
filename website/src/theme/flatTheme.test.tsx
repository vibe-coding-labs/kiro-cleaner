import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { Paper, Card, AppBar, Button } from '@mui/material';
import { flatTheme } from './flatTheme';
import * as fc from 'fast-check';

// Feature: flat-design-website, Property 29: Material-UI components have no elevation
// **Validates: Requirements 10.1**

describe('Flat Theme Configuration', () => {
  describe('Property 29: Material-UI components have no elevation', () => {
    it('should have all shadows set to none', () => {
      // Check that all 25 shadow levels are 'none'
      expect(flatTheme.shadows).toHaveLength(25);
      flatTheme.shadows.forEach((shadow, index) => {
        expect(shadow).toBe('none');
      });
    });

    it('should render Paper component without box-shadow', () => {
      const { container } = render(
        <ThemeProvider theme={flatTheme}>
          <Paper>Test Paper</Paper>
        </ThemeProvider>
      );
      
      const paper = container.querySelector('.MuiPaper-root');
      expect(paper).toBeInTheDocument();
      
      const styles = window.getComputedStyle(paper!);
      expect(styles.boxShadow).toBe('none');
    });

    it('should render Card component without box-shadow', () => {
      const { container } = render(
        <ThemeProvider theme={flatTheme}>
          <Card>Test Card</Card>
        </ThemeProvider>
      );
      
      const card = container.querySelector('.MuiCard-root');
      expect(card).toBeInTheDocument();
      
      const styles = window.getComputedStyle(card!);
      expect(styles.boxShadow).toBe('none');
    });

    it('should render AppBar component without box-shadow', () => {
      const { container } = render(
        <ThemeProvider theme={flatTheme}>
          <AppBar>Test AppBar</AppBar>
        </ThemeProvider>
      );
      
      const appBar = container.querySelector('.MuiAppBar-root');
      expect(appBar).toBeInTheDocument();
      
      const styles = window.getComputedStyle(appBar!);
      expect(styles.boxShadow).toBe('none');
    });

    it('should render Button component without box-shadow', () => {
      const { container } = render(
        <ThemeProvider theme={flatTheme}>
          <Button variant="contained">Test Button</Button>
        </ThemeProvider>
      );
      
      const button = container.querySelector('.MuiButton-root');
      expect(button).toBeInTheDocument();
      
      const styles = window.getComputedStyle(button!);
      expect(styles.boxShadow).toBe('none');
    });

    // Property-based test: Any elevation value should result in no shadow
    it('should have no shadow regardless of elevation prop value', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 24 }), // Material-UI elevation range
          (elevation) => {
            const { container } = render(
              <ThemeProvider theme={flatTheme}>
                <Paper elevation={elevation}>Test Paper</Paper>
              </ThemeProvider>
            );
            
            const paper = container.querySelector('.MuiPaper-root');
            const styles = window.getComputedStyle(paper!);
            
            // Should always be 'none' regardless of elevation prop
            return styles.boxShadow === 'none';
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should have no background gradients on Paper components', () => {
      const { container } = render(
        <ThemeProvider theme={flatTheme}>
          <Paper>Test Paper</Paper>
        </ThemeProvider>
      );
      
      const paper = container.querySelector('.MuiPaper-root');
      const styles = window.getComputedStyle(paper!);
      
      expect(styles.backgroundImage).toBe('none');
    });

    it('should have no background gradients on Card components', () => {
      const { container } = render(
        <ThemeProvider theme={flatTheme}>
          <Card>Test Card</Card>
        </ThemeProvider>
      );
      
      const card = container.querySelector('.MuiCard-root');
      const styles = window.getComputedStyle(card!);
      
      expect(styles.backgroundImage).toBe('none');
    });

    it('should have no background gradients on Button components', () => {
      const { container } = render(
        <ThemeProvider theme={flatTheme}>
          <Button variant="contained">Test Button</Button>
        </ThemeProvider>
      );
      
      const button = container.querySelector('.MuiButton-root');
      const styles = window.getComputedStyle(button!);
      
      expect(styles.backgroundImage).toBe('none');
    });

    // Property-based test: All Material-UI components should have no shadows
    it('should ensure all component variants have no shadows', () => {
      const buttonVariants = ['text', 'outlined', 'contained'] as const;
      
      fc.assert(
        fc.property(
          fc.constantFrom(...buttonVariants),
          (variant) => {
            const { container } = render(
              <ThemeProvider theme={flatTheme}>
                <Button variant={variant}>Test</Button>
              </ThemeProvider>
            );
            
            const button = container.querySelector('.MuiButton-root');
            const styles = window.getComputedStyle(button!);
            
            return styles.boxShadow === 'none';
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  describe('Theme Configuration Validation', () => {
    it('should have defined color palette', () => {
      expect(flatTheme.palette.primary.main).toBeDefined();
      expect(flatTheme.palette.secondary.main).toBeDefined();
      expect(flatTheme.palette.background.default).toBeDefined();
    });

    it('should have defined typography', () => {
      expect(flatTheme.typography.fontFamily).toBeDefined();
      expect(flatTheme.typography.h1).toBeDefined();
      expect(flatTheme.typography.body1).toBeDefined();
    });

    it('should have component overrides configured', () => {
      expect(flatTheme.components?.MuiPaper).toBeDefined();
      expect(flatTheme.components?.MuiCard).toBeDefined();
      expect(flatTheme.components?.MuiButton).toBeDefined();
      expect(flatTheme.components?.MuiAppBar).toBeDefined();
    });
  });
});
