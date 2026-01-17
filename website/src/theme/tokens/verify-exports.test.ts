/**
 * Verification Tests for Token and Animation System
 * 
 * These tests verify that all tokens are correctly exported and integrated.
 */

import { describe, it, expect } from 'vitest';
import * as tokens from './index';
import { premiumTheme } from '../premiumTheme';
import { animationPresets } from '../../utils/animationPresets';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

describe('Token System Verification', () => {
  it('should export all token modules', () => {
    expect(tokens.colorTokens).toBeDefined();
    expect(tokens.typographyTokens).toBeDefined();
    expect(tokens.spacingTokens).toBeDefined();
    expect(tokens.animationTokens).toBeDefined();
    expect(tokens.shadowTokens).toBeDefined();
    expect(tokens.effectTokens).toBeDefined();
  });

  it('should have colorTokens with all required properties', () => {
    expect(tokens.colorTokens.brand).toBeDefined();
    expect(tokens.colorTokens.text).toBeDefined();
    expect(tokens.colorTokens.background).toBeDefined();
    expect(tokens.colorTokens.border).toBeDefined();
    expect(tokens.colorTokens.gradients).toBeDefined();
  });

  it('should have shadowTokens with all required properties', () => {
    expect(tokens.shadowTokens.elevation).toBeDefined();
    expect(tokens.shadowTokens.colored).toBeDefined();
    expect(tokens.shadowTokens.inner).toBeDefined();
    expect(tokens.shadowTokens.glow).toBeDefined();
  });

  it('should have effectTokens with all required properties', () => {
    expect(tokens.effectTokens.glass).toBeDefined();
    expect(tokens.effectTokens.overlays).toBeDefined();
    expect(tokens.effectTokens.mesh).toBeDefined();
    expect(tokens.effectTokens.shimmer).toBeDefined();
  });

  it('should have animationTokens with all required properties', () => {
    expect(tokens.animationTokens.duration).toBeDefined();
    expect(tokens.animationTokens.easing).toBeDefined();
  });

  it('should have typographyTokens with all required properties', () => {
    expect(tokens.typographyTokens.fontFamily).toBeDefined();
    expect(tokens.typographyTokens.fontSize).toBeDefined();
    expect(tokens.typographyTokens.fontWeight).toBeDefined();
    expect(tokens.typographyTokens.lineHeight).toBeDefined();
  });

  it('should have spacingTokens with all required properties', () => {
    expect(tokens.spacingTokens[0]).toBeDefined();
    expect(tokens.spacingTokens[2]).toBeDefined();
    expect(tokens.spacingTokens[4]).toBeDefined();
    expect(tokens.semanticSpacing).toBeDefined();
  });
});

describe('Premium Theme Integration', () => {
  it('should integrate shadow tokens', () => {
    expect(premiumTheme.shadows).toBeDefined();
    expect(premiumTheme.shadows[1]).toBe(tokens.shadowTokens.elevation.xs);
    expect(premiumTheme.shadows[2]).toBe(tokens.shadowTokens.elevation.sm);
  });

  it('should have enhanced button styles', () => {
    expect(premiumTheme.components?.MuiButton).toBeDefined();
    expect(premiumTheme.components?.MuiButton?.styleOverrides).toBeDefined();
  });

  it('should have enhanced card styles', () => {
    expect(premiumTheme.components?.MuiCard).toBeDefined();
    expect(premiumTheme.components?.MuiCard?.styleOverrides).toBeDefined();
  });

  it('should have enhanced appbar styles', () => {
    expect(premiumTheme.components?.MuiAppBar).toBeDefined();
    expect(premiumTheme.components?.MuiAppBar?.styleOverrides).toBeDefined();
  });

  it('should have global animation keyframes', () => {
    const cssBaseline = premiumTheme.components?.MuiCssBaseline?.styleOverrides;
    expect(cssBaseline).toBeDefined();
    expect(typeof cssBaseline).toBe('string');
    
    // Core animations
    expect(cssBaseline).toContain('@keyframes shimmer');
    expect(cssBaseline).toContain('@keyframes gradient-shift');
    
    // Fade animations
    expect(cssBaseline).toContain('@keyframes fadeIn');
    expect(cssBaseline).toContain('@keyframes fadeInUp');
    expect(cssBaseline).toContain('@keyframes fadeInDown');
    
    // Scale animations
    expect(cssBaseline).toContain('@keyframes scaleIn');
    expect(cssBaseline).toContain('@keyframes scaleInBounce');
    
    // Slide animations
    expect(cssBaseline).toContain('@keyframes slideInLeft');
    expect(cssBaseline).toContain('@keyframes slideInRight');
    expect(cssBaseline).toContain('@keyframes slideInUp');
    expect(cssBaseline).toContain('@keyframes slideInDown');
    
    // Other animations
    expect(cssBaseline).toContain('@keyframes rotateIn');
    expect(cssBaseline).toContain('@keyframes blurIn');
    expect(cssBaseline).toContain('@keyframes pulse');
    expect(cssBaseline).toContain('@keyframes float');
    expect(cssBaseline).toContain('@keyframes glow');
  });

  it('should support reduced motion', () => {
    const cssBaseline = premiumTheme.components?.MuiCssBaseline?.styleOverrides;
    expect(cssBaseline).toContain('prefers-reduced-motion');
  });
});

describe('Animation System Verification', () => {
  it('should export all animation presets', () => {
    expect(animationPresets.fadeIn).toBeDefined();
    expect(animationPresets.fadeInUp).toBeDefined();
    expect(animationPresets.fadeInDown).toBeDefined();
    expect(animationPresets.scaleIn).toBeDefined();
    expect(animationPresets.slideInLeft).toBeDefined();
    expect(animationPresets.slideInRight).toBeDefined();
    expect(animationPresets.staggerContainer).toBeDefined();
  });

  it('should have scroll animation hook', () => {
    expect(useScrollAnimation).toBeDefined();
    expect(typeof useScrollAnimation).toBe('function');
  });

  it('should have all animation presets with required structure', () => {
    Object.values(animationPresets).forEach(preset => {
      expect(preset).toHaveProperty('initial');
      expect(preset).toHaveProperty('animate');
      expect(preset).toHaveProperty('transition');
    });
  });
});

describe('Token System Consistency', () => {
  it('should have consistent shadow elevation levels', () => {
    const elevations = tokens.shadowTokens.elevation;
    expect(elevations.xs).toBeDefined();
    expect(elevations.sm).toBeDefined();
    expect(elevations.md).toBeDefined();
    expect(elevations.lg).toBeDefined();
    expect(elevations.xl).toBeDefined();
    expect(elevations['2xl']).toBeDefined();
  });

  it('should have consistent glass effect variants', () => {
    const glass = tokens.effectTokens.glass;
    expect(glass.light).toBeDefined();
    expect(glass.medium).toBeDefined();
    expect(glass.dark).toBeDefined();
    
    // Each variant should have required properties
    ['light', 'medium', 'dark'].forEach(variant => {
      expect(glass[variant as keyof typeof glass].background).toBeDefined();
      expect(glass[variant as keyof typeof glass].backdropFilter).toBeDefined();
      expect(glass[variant as keyof typeof glass].border).toBeDefined();
    });
  });

  it('should have consistent animation durations', () => {
    const durations = tokens.animationTokens.duration;
    expect(durations.instant).toBeDefined();
    expect(durations.fast).toBeDefined();
    expect(durations.normal).toBeDefined();
    expect(durations.slow).toBeDefined();
  });

  it('should have consistent easing functions', () => {
    const easing = tokens.animationTokens.easing;
    expect(easing.standard).toBeDefined();
    expect(easing.decelerate).toBeDefined();
    expect(easing.accelerate).toBeDefined();
    expect(easing.smooth).toBeDefined();
  });
});

describe('Integration Verification', () => {
  it('should have all tokens accessible from index', () => {
    // Verify all exports are accessible
    expect(tokens).toHaveProperty('colorTokens');
    expect(tokens).toHaveProperty('typographyTokens');
    expect(tokens).toHaveProperty('spacingTokens');
    expect(tokens).toHaveProperty('animationTokens');
    expect(tokens).toHaveProperty('shadowTokens');
    expect(tokens).toHaveProperty('effectTokens');
  });

  it('should have premiumTheme extend modernTheme', () => {
    // Premium theme should have all base theme properties
    expect(premiumTheme.palette).toBeDefined();
    expect(premiumTheme.typography).toBeDefined();
    expect(premiumTheme.spacing).toBeDefined();
    expect(premiumTheme.components).toBeDefined();
  });

  it('should have animation system working with tokens', () => {
    // Animation presets should use valid durations
    Object.values(animationPresets).forEach(preset => {
      const duration = preset.transition.duration;
      expect(typeof duration).toBe('number');
      expect(duration).toBeGreaterThanOrEqual(0);
    });
  });
});
