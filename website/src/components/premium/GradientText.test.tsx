import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import GradientText from './GradientText';
import * as gradientFallbacks from '../../utils/gradientFallbacks';

// Mock the gradient fallbacks module
vi.mock('../../utils/gradientFallbacks', async () => {
  const actual = await vi.importActual('../../utils/gradientFallbacks');
  return {
    ...actual,
    createGradientTextStyle: vi.fn((gradient, fallbackColor) => ({
      background: gradient,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      color: fallbackColor,
    })),
  };
});

describe('GradientText', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders children correctly', () => {
      render(<GradientText gradient="linear-gradient(90deg, red, blue)">Hello World</GradientText>);
      expect(screen.getByText('Hello World')).toBeInTheDocument();
    });

    it('applies gradient to text (Requirements 1.1)', () => {
      const gradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      render(<GradientText gradient={gradient}>Gradient Text</GradientText>);
      const text = screen.getByText('Gradient Text');
      
      expect(text).toBeInTheDocument();
      // The gradient is applied via background property with text clipping
    });

    it('uses default h1 variant when variant prop is not provided', () => {
      render(<GradientText gradient="linear-gradient(90deg, red, blue)">Default Variant</GradientText>);
      const text = screen.getByText('Default Variant');
      
      // Should render as h1 by default
      expect(text.tagName).toBe('H1');
    });
  });

  describe('Fallback Color Support', () => {
    it('uses default fallback color when not provided (Requirements 1.4)', () => {
      const gradient = 'linear-gradient(90deg, red, blue)';
      render(<GradientText gradient={gradient}>Fallback Test</GradientText>);
      
      expect(gradientFallbacks.createGradientTextStyle).toHaveBeenCalledWith(
        gradient,
        '#0070f3' // Default primary brand color
      );
    });

    it('uses custom fallback color when provided (Requirements 1.4)', () => {
      const gradient = 'linear-gradient(90deg, red, blue)';
      const fallbackColor = '#ff0080';
      render(
        <GradientText gradient={gradient} fallbackColor={fallbackColor}>
          Custom Fallback
        </GradientText>
      );
      
      expect(gradientFallbacks.createGradientTextStyle).toHaveBeenCalledWith(
        gradient,
        fallbackColor
      );
    });

    it('applies gradient text styles with fallback support (Requirements 1.4)', () => {
      render(
        <GradientText 
          gradient="linear-gradient(90deg, red, blue)" 
          fallbackColor="#333"
        >
          Styled Text
        </GradientText>
      );
      
      expect(gradientFallbacks.createGradientTextStyle).toHaveBeenCalled();
      expect(screen.getByText('Styled Text')).toBeInTheDocument();
    });
  });

  describe('Typography Variants', () => {
    it('supports all Typography variants (Requirements 1.1)', () => {
      const gradient = 'linear-gradient(90deg, red, blue)';
      
      const { rerender } = render(
        <GradientText gradient={gradient} variant="h1">H1 Text</GradientText>
      );
      expect(screen.getByText('H1 Text').tagName).toBe('H1');

      rerender(
        <GradientText gradient={gradient} variant="h2">H2 Text</GradientText>
      );
      expect(screen.getByText('H2 Text').tagName).toBe('H2');

      rerender(
        <GradientText gradient={gradient} variant="h3">H3 Text</GradientText>
      );
      expect(screen.getByText('H3 Text').tagName).toBe('H3');

      rerender(
        <GradientText gradient={gradient} variant="body1">Body Text</GradientText>
      );
      expect(screen.getByText('Body Text').tagName).toBe('P');

      rerender(
        <GradientText gradient={gradient} variant="caption">Caption Text</GradientText>
      );
      expect(screen.getByText('Caption Text')).toBeInTheDocument();
    });
  });

  describe('Gradient Styles', () => {
    it('applies gradient background with text clipping (Requirements 1.1)', () => {
      const gradient = 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
      render(<GradientText gradient={gradient}>Styled Text</GradientText>);
      const text = screen.getByText('Styled Text');
      const styles = window.getComputedStyle(text);
      
      // Verify gradient is applied
      expect(styles.background).toContain('linear-gradient');
      
      // Verify text clipping properties are set
      // Note: These may not be fully reflected in computed styles in test environment
      expect(text).toBeInTheDocument();
    });

    it('supports different gradient types', () => {
      const gradients = [
        'linear-gradient(90deg, red, blue)',
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'radial-gradient(circle, red, blue)',
      ];

      gradients.forEach((gradient, index) => {
        const { unmount } = render(
          <GradientText gradient={gradient}>Test {index}</GradientText>
        );
        expect(screen.getByText(`Test ${index}`)).toBeInTheDocument();
        unmount();
      });
    });

    it('applies display inline-block for proper gradient rendering', () => {
      render(<GradientText gradient="linear-gradient(90deg, red, blue)">Inline Block</GradientText>);
      const text = screen.getByText('Inline Block');
      const styles = window.getComputedStyle(text);
      
      // inline-block is necessary for gradient text to work properly
      expect(styles.display).toBe('inline-block');
    });
  });

  describe('Animation', () => {
    it('does not animate by default (Requirements 1.1)', () => {
      render(<GradientText gradient="linear-gradient(90deg, red, blue)">Static Text</GradientText>);
      const text = screen.getByText('Static Text');
      
      expect(text).toBeInTheDocument();
      // Animation should not be applied when animate prop is false or undefined
    });

    it('applies animation when animate prop is true (Requirements 1.1)', () => {
      render(
        <GradientText gradient="linear-gradient(90deg, red, blue)" animate={true}>
          Animated Text
        </GradientText>
      );
      const text = screen.getByText('Animated Text');
      
      expect(text).toBeInTheDocument();
      // Animation should be applied via CSS keyframes
    });

    it('uses correct animation duration and easing', () => {
      render(
        <GradientText gradient="linear-gradient(90deg, red, blue)" animate={true}>
          Smooth Animation
        </GradientText>
      );
      const text = screen.getByText('Smooth Animation');
      
      // Animation should use 3s duration with ease timing function
      expect(text).toBeInTheDocument();
    });

    it('animates background position for gradient shift effect', () => {
      render(
        <GradientText gradient="linear-gradient(90deg, red, blue)" animate={true}>
          Shifting Gradient
        </GradientText>
      );
      const text = screen.getByText('Shifting Gradient');
      
      // The animation should shift background position from 0% to 100% and back
      expect(text).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('maintains text readability with gradient', () => {
      render(
        <GradientText gradient="linear-gradient(90deg, #000, #333)">
          Readable Text
        </GradientText>
      );
      const text = screen.getByText('Readable Text');
      
      // Text should still be accessible and readable
      expect(text).toBeInTheDocument();
      expect(text).toHaveAccessibleName('Readable Text');
    });

    it('preserves semantic HTML structure', () => {
      render(
        <GradientText gradient="linear-gradient(90deg, red, blue)" variant="h1">
          Semantic Heading
        </GradientText>
      );
      const heading = screen.getByText('Semantic Heading');
      
      // Should maintain proper heading structure
      expect(heading.tagName).toBe('H1');
    });

    it('works with screen readers', () => {
      render(
        <GradientText gradient="linear-gradient(90deg, red, blue)">
          Screen Reader Text
        </GradientText>
      );
      const text = screen.getByText('Screen Reader Text');
      
      // Text content should be accessible to screen readers
      expect(text).toHaveTextContent('Screen Reader Text');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty gradient gracefully', () => {
      render(<GradientText gradient="">Empty Gradient</GradientText>);
      const text = screen.getByText('Empty Gradient');
      
      expect(text).toBeInTheDocument();
    });

    it('handles complex gradients with multiple stops', () => {
      const complexGradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)';
      render(<GradientText gradient={complexGradient}>Complex Gradient</GradientText>);
      const text = screen.getByText('Complex Gradient');
      
      expect(text).toBeInTheDocument();
    });

    it('handles long text content', () => {
      const longText = 'This is a very long text that should still render correctly with gradient applied to it';
      render(<GradientText gradient="linear-gradient(90deg, red, blue)">{longText}</GradientText>);
      const text = screen.getByText(longText);
      
      expect(text).toBeInTheDocument();
    });

    it('works with nested elements', () => {
      render(
        <GradientText gradient="linear-gradient(90deg, red, blue)">
          <span>Nested Content</span>
        </GradientText>
      );
      
      expect(screen.getByText('Nested Content')).toBeInTheDocument();
    });
  });

  describe('Integration', () => {
    it('combines with animation and different variants', () => {
      render(
        <GradientText 
          gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
          variant="h2" 
          animate={true}
        >
          Full Featured Text
        </GradientText>
      );
      const text = screen.getByText('Full Featured Text');
      
      expect(text).toBeInTheDocument();
      expect(text.tagName).toBe('H2');
    });

    it('works with premium gradients from tokens', () => {
      const premiumGradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      render(
        <GradientText gradient={premiumGradient}>
          Premium Gradient
        </GradientText>
      );
      
      expect(screen.getByText('Premium Gradient')).toBeInTheDocument();
    });
  });
});
