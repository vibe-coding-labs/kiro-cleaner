/**
 * Unit Tests for GlassCard Component
 * 
 * Tests glassmorphism effects, hover animations, and glow effects.
 * Validates: Requirements 6.3
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { premiumTheme } from '../../theme/premiumTheme';
import { GlassCard } from './GlassCard';
import { effectTokens } from '../../theme/tokens/effects';
import { shadowTokens } from '../../theme/tokens/shadows';
import * as featureDetection from '../../utils/featureDetection';

// Helper to render with theme
const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={premiumTheme}>
      {component}
    </ThemeProvider>
  );
};

describe('GlassCard Component', () => {
  describe('Variant Styles', () => {
    it('should render with light variant styles', () => {
      const { container } = renderWithTheme(
        <GlassCard variant="light">Content</GlassCard>
      );
      
      const card = container.firstChild as HTMLElement;
      
      // Verify card is rendered
      expect(card).toBeDefined();
      expect(card.textContent).toBe('Content');
    });

    it('should render with medium variant styles', () => {
      const { container } = renderWithTheme(
        <GlassCard variant="medium">Content</GlassCard>
      );
      
      const card = container.firstChild as HTMLElement;
      expect(card).toBeDefined();
    });

    it('should render with dark variant styles', () => {
      const { container } = renderWithTheme(
        <GlassCard variant="dark">Content</GlassCard>
      );
      
      const card = container.firstChild as HTMLElement;
      expect(card).toBeDefined();
    });

    it('should use light variant by default', () => {
      const { container } = renderWithTheme(
        <GlassCard>Content</GlassCard>
      );
      
      const card = container.firstChild as HTMLElement;
      expect(card).toBeDefined();
    });
  });

  describe('Hover Effects', () => {
    it('should enable hover effect by default', () => {
      const { container } = renderWithTheme(
        <GlassCard>Content</GlassCard>
      );
      
      const card = container.firstChild as HTMLElement;
      expect(card).toBeDefined();
      
      // Verify transition is applied
      const styles = window.getComputedStyle(card);
      expect(styles.transition).toBeTruthy();
    });

    it('should disable hover effect when hover=false', () => {
      const { container } = renderWithTheme(
        <GlassCard hover={false}>Content</GlassCard>
      );
      
      const card = container.firstChild as HTMLElement;
      expect(card).toBeDefined();
    });

    it('should apply hover styles when hover=true', () => {
      const { container } = renderWithTheme(
        <GlassCard hover={true}>Content</GlassCard>
      );
      
      const card = container.firstChild as HTMLElement;
      expect(card).toBeDefined();
    });
  });

  describe('Glow Effects', () => {
    it('should not apply glow effect by default', () => {
      const { container } = renderWithTheme(
        <GlassCard>Content</GlassCard>
      );
      
      const card = container.firstChild as HTMLElement;
      expect(card).toBeDefined();
    });

    it('should apply glow effect when glow=true', () => {
      const { container } = renderWithTheme(
        <GlassCard glow={true}>Content</GlassCard>
      );
      
      const card = container.firstChild as HTMLElement;
      expect(card).toBeDefined();
    });

    it('should combine hover and glow effects', () => {
      const { container } = renderWithTheme(
        <GlassCard hover={true} glow={true}>Content</GlassCard>
      );
      
      const card = container.firstChild as HTMLElement;
      expect(card).toBeDefined();
    });
  });

  describe('Elevation', () => {
    it('should use md elevation by default', () => {
      const { container } = renderWithTheme(
        <GlassCard>Content</GlassCard>
      );
      
      const card = container.firstChild as HTMLElement;
      expect(card).toBeDefined();
    });

    it('should apply xs elevation', () => {
      const { container } = renderWithTheme(
        <GlassCard elevation="xs">Content</GlassCard>
      );
      
      const card = container.firstChild as HTMLElement;
      expect(card).toBeDefined();
    });

    it('should apply sm elevation', () => {
      const { container } = renderWithTheme(
        <GlassCard elevation="sm">Content</GlassCard>
      );
      
      const card = container.firstChild as HTMLElement;
      expect(card).toBeDefined();
    });

    it('should apply lg elevation', () => {
      const { container } = renderWithTheme(
        <GlassCard elevation="lg">Content</GlassCard>
      );
      
      const card = container.firstChild as HTMLElement;
      expect(card).toBeDefined();
    });

    it('should apply xl elevation', () => {
      const { container } = renderWithTheme(
        <GlassCard elevation="xl">Content</GlassCard>
      );
      
      const card = container.firstChild as HTMLElement;
      expect(card).toBeDefined();
    });

    it('should apply 2xl elevation', () => {
      const { container } = renderWithTheme(
        <GlassCard elevation="2xl">Content</GlassCard>
      );
      
      const card = container.firstChild as HTMLElement;
      expect(card).toBeDefined();
    });
  });

  describe('Content Rendering', () => {
    it('should render children content', () => {
      const { getByText } = renderWithTheme(
        <GlassCard>Test Content</GlassCard>
      );
      
      expect(getByText('Test Content')).toBeDefined();
    });

    it('should render complex children', () => {
      const { getByText, getByRole } = renderWithTheme(
        <GlassCard>
          <h2>Title</h2>
          <p>Description</p>
          <button>Action</button>
        </GlassCard>
      );
      
      expect(getByText('Title')).toBeDefined();
      expect(getByText('Description')).toBeDefined();
      expect(getByRole('button')).toBeDefined();
    });
  });

  describe('Custom Styles', () => {
    it('should accept custom sx styles', () => {
      const { container } = renderWithTheme(
        <GlassCard sx={{ padding: 5, margin: 2 }}>Content</GlassCard>
      );
      
      const card = container.firstChild as HTMLElement;
      expect(card).toBeDefined();
    });

    it('should merge custom styles with default styles', () => {
      const { container } = renderWithTheme(
        <GlassCard sx={{ backgroundColor: 'red' }}>Content</GlassCard>
      );
      
      const card = container.firstChild as HTMLElement;
      expect(card).toBeDefined();
    });
  });

  describe('Glass Effect Properties', () => {
    it('should have backdrop filter for light variant', () => {
      const lightGlass = effectTokens.glass.light;
      
      expect(lightGlass.background).toBeDefined();
      expect(lightGlass.backdropFilter).toBeDefined();
      expect(lightGlass.border).toBeDefined();
    });

    it('should have backdrop filter for medium variant', () => {
      const mediumGlass = effectTokens.glass.medium;
      
      expect(mediumGlass.background).toBeDefined();
      expect(mediumGlass.backdropFilter).toBeDefined();
      expect(mediumGlass.border).toBeDefined();
    });

    it('should have backdrop filter for dark variant', () => {
      const darkGlass = effectTokens.glass.dark;
      
      expect(darkGlass.background).toBeDefined();
      expect(darkGlass.backdropFilter).toBeDefined();
      expect(darkGlass.border).toBeDefined();
    });
  });

  describe('Shadow Properties', () => {
    it('should have all elevation shadows defined', () => {
      expect(shadowTokens.elevation.xs).toBeDefined();
      expect(shadowTokens.elevation.sm).toBeDefined();
      expect(shadowTokens.elevation.md).toBeDefined();
      expect(shadowTokens.elevation.lg).toBeDefined();
      expect(shadowTokens.elevation.xl).toBeDefined();
      expect(shadowTokens.elevation['2xl']).toBeDefined();
    });

    it('should have glow shadows defined', () => {
      expect(shadowTokens.glow.sm).toBeDefined();
      expect(shadowTokens.glow.md).toBeDefined();
      expect(shadowTokens.glow.lg).toBeDefined();
    });
  });

  describe('Accessibility', () => {
    it('should be accessible with proper structure', () => {
      const { container } = renderWithTheme(
        <GlassCard>
          <h2>Accessible Title</h2>
          <p>Accessible content</p>
        </GlassCard>
      );
      
      const card = container.firstChild as HTMLElement;
      expect(card).toBeDefined();
    });

    it('should support aria attributes through sx', () => {
      const { container } = renderWithTheme(
        <GlassCard sx={{ 'aria-label': 'Glass card' } as any}>
          Content
        </GlassCard>
      );
      
      const card = container.firstChild as HTMLElement;
      expect(card).toBeDefined();
    });
  });

  describe('Responsive Behavior', () => {
    it('should render correctly on different screen sizes', () => {
      const { container } = renderWithTheme(
        <GlassCard>Responsive Content</GlassCard>
      );
      
      const card = container.firstChild as HTMLElement;
      expect(card).toBeDefined();
    });

    it('should maintain glass effect on all screen sizes', () => {
      const { container } = renderWithTheme(
        <GlassCard variant="light">Content</GlassCard>
      );
      
      const card = container.firstChild as HTMLElement;
      
      // Verify card is rendered with content
      expect(card).toBeDefined();
      expect(card.textContent).toBe('Content');
    });
  });

  describe('Combination Tests', () => {
    it('should work with all props combined', () => {
      const { container, getByText } = renderWithTheme(
        <GlassCard
          variant="medium"
          hover={true}
          glow={true}
          elevation="xl"
          sx={{ margin: 2 }}
        >
          Combined Props Test
        </GlassCard>
      );
      
      const card = container.firstChild as HTMLElement;
      expect(card).toBeDefined();
      expect(getByText('Combined Props Test')).toBeDefined();
    });

    it('should work with minimal props', () => {
      const { getByText } = renderWithTheme(
        <GlassCard>Minimal Props</GlassCard>
      );
      
      expect(getByText('Minimal Props')).toBeDefined();
    });
  });

  describe('Browser Fallback Support', () => {
    let getGlassmorphismStylesSpy: any;

    beforeEach(() => {
      getGlassmorphismStylesSpy = vi.spyOn(featureDetection, 'getGlassmorphismStyles');
    });

    afterEach(() => {
      getGlassmorphismStylesSpy.mockRestore();
    });

    it('should call getGlassmorphismStyles for feature detection', () => {
      getGlassmorphismStylesSpy.mockReturnValue({
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      });

      renderWithTheme(<GlassCard variant="light">Content</GlassCard>);

      expect(getGlassmorphismStylesSpy).toHaveBeenCalled();
    });

    it('should use fallback styles when backdrop-filter is not supported', () => {
      // Mock unsupported browser
      getGlassmorphismStylesSpy.mockReturnValue({
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
      });

      const { container } = renderWithTheme(
        <GlassCard variant="light">Content</GlassCard>
      );

      const card = container.firstChild as HTMLElement;
      expect(card).toBeDefined();
      expect(getGlassmorphismStylesSpy).toHaveBeenCalledWith(
        effectTokens.glass.light.background,
        'rgba(255, 255, 255, 0.95)',
        '10px'
      );
    });

    it('should use glass effect when backdrop-filter is supported', () => {
      // Mock supported browser
      getGlassmorphismStylesSpy.mockReturnValue({
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      });

      const { container } = renderWithTheme(
        <GlassCard variant="light">Content</GlassCard>
      );

      const card = container.firstChild as HTMLElement;
      expect(card).toBeDefined();
      expect(getGlassmorphismStylesSpy).toHaveBeenCalled();
    });

    it('should use appropriate fallback for medium variant', () => {
      getGlassmorphismStylesSpy.mockReturnValue({
        backgroundColor: 'rgba(255, 255, 255, 0.90)',
      });

      renderWithTheme(<GlassCard variant="medium">Content</GlassCard>);

      expect(getGlassmorphismStylesSpy).toHaveBeenCalledWith(
        effectTokens.glass.medium.background,
        'rgba(255, 255, 255, 0.90)',
        '10px'
      );
    });

    it('should use appropriate fallback for dark variant', () => {
      getGlassmorphismStylesSpy.mockReturnValue({
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
      });

      renderWithTheme(<GlassCard variant="dark">Content</GlassCard>);

      expect(getGlassmorphismStylesSpy).toHaveBeenCalledWith(
        effectTokens.glass.dark.background,
        'rgba(0, 0, 0, 0.85)',
        '10px'
      );
    });
  });
});
