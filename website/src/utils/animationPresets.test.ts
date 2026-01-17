/**
 * Property-Based Tests for Animation Presets
 * Feature: premium-website-visual-enhancement
 */

import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { animationPresets, getAnimationPreset, createStaggerAnimation } from './animationPresets';

describe('Feature: premium-website-visual-enhancement, Property 3: Animation Configuration Validity', () => {
  it('should have all animations use easing functions (not linear)', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...Object.values(animationPresets)),
        (preset) => {
          const { transition } = preset;
          
          // If ease is defined, it should not be 'linear'
          if (transition.ease) {
            return transition.ease !== 'linear';
          }
          
          // If ease is not defined, that's acceptable (uses default)
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should have standard animations with duration between 150ms and 700ms', () => {
    const standardAnimations = [
      animationPresets.fadeIn,
      animationPresets.fadeInUp,
      animationPresets.fadeInDown,
      animationPresets.scaleIn,
    ];

    fc.assert(
      fc.property(
        fc.constantFrom(...standardAnimations),
        (preset) => {
          const durationMs = preset.transition.duration * 1000;
          return durationMs >= 150 && durationMs <= 700;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should have all animations with valid duration values', () => {
    // Exclude staggerContainer as it's a special case with duration 0
    const animationsToTest = Object.entries(animationPresets)
      .filter(([key]) => key !== 'staggerContainer')
      .map(([, value]) => value);

    fc.assert(
      fc.property(
        fc.constantFrom(...animationsToTest),
        (preset) => {
          const { duration } = preset.transition;
          
          // Duration should be a positive number
          return typeof duration === 'number' && duration > 0;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should have all animations with initial and animate states', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...Object.values(animationPresets)),
        (preset) => {
          return (
            preset.initial !== undefined &&
            preset.animate !== undefined &&
            preset.transition !== undefined
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should have fade animations that change opacity', () => {
    const fadeAnimations = [
      animationPresets.fadeIn,
      animationPresets.fadeInUp,
      animationPresets.fadeInDown,
    ];

    fadeAnimations.forEach(preset => {
      expect(preset.initial.opacity).toBeDefined();
      expect(preset.animate.opacity).toBeDefined();
      expect(preset.initial.opacity).not.toBe(preset.animate.opacity);
    });
  });

  it('should have scale animations that change scale', () => {
    const scaleAnimations = [
      animationPresets.scaleIn,
      animationPresets.scaleInBounce,
    ];

    scaleAnimations.forEach(preset => {
      expect(preset.initial.scale).toBeDefined();
      expect(preset.animate.scale).toBeDefined();
      expect(preset.initial.scale).not.toBe(preset.animate.scale);
    });
  });

  it('should have slide animations that change position', () => {
    const slideAnimations = [
      animationPresets.slideInLeft,
      animationPresets.slideInRight,
      animationPresets.slideInUp,
      animationPresets.slideInDown,
    ];

    slideAnimations.forEach(preset => {
      const hasXChange = preset.initial.x !== undefined && preset.animate.x !== undefined;
      const hasYChange = preset.initial.y !== undefined && preset.animate.y !== undefined;
      
      expect(hasXChange || hasYChange).toBe(true);
    });
  });

  it('should have staggerContainer with staggerChildren configuration', () => {
    const stagger = animationPresets.staggerContainer;
    
    expect(stagger.animate.transition).toBeDefined();
    expect(stagger.animate.transition.staggerChildren).toBeDefined();
    expect(stagger.animate.transition.staggerChildren).toBeGreaterThan(0);
  });
});

describe('Animation Preset Utilities', () => {
  it('should apply delay to animation preset', () => {
    const preset = getAnimationPreset('fadeIn', 0.5);
    
    expect(preset.transition.delay).toBe(0.5);
  });

  it('should create stagger animations with correct count', () => {
    const animations = createStaggerAnimation(5);
    
    expect(animations).toHaveLength(5);
  });

  it('should create stagger animations with increasing delays', () => {
    const animations = createStaggerAnimation(5, 0, 0.1);
    
    for (let i = 1; i < animations.length; i++) {
      const prevDelay = animations[i - 1].transition.delay || 0;
      const currDelay = animations[i].transition.delay || 0;
      
      expect(currDelay).toBeGreaterThan(prevDelay);
    }
  });

  it('should create stagger animations with correct base delay', () => {
    const baseDelay = 0.5;
    const animations = createStaggerAnimation(3, baseDelay, 0.1);
    
    const firstDelay = animations[0].transition.delay || 0;
    expect(firstDelay).toBe(baseDelay);
  });

  it('should create stagger animations with correct stagger delay', () => {
    const staggerDelay = 0.2;
    const animations = createStaggerAnimation(3, 0, staggerDelay);
    
    const firstDelay = animations[0].transition.delay || 0;
    const secondDelay = animations[1].transition.delay || 0;
    
    expect(secondDelay - firstDelay).toBe(staggerDelay);
  });
});

describe('Animation Preset Structure', () => {
  it('should have all required animation types', () => {
    expect(animationPresets).toHaveProperty('fadeIn');
    expect(animationPresets).toHaveProperty('fadeInUp');
    expect(animationPresets).toHaveProperty('fadeInDown');
    expect(animationPresets).toHaveProperty('scaleIn');
    expect(animationPresets).toHaveProperty('slideInLeft');
    expect(animationPresets).toHaveProperty('slideInRight');
    expect(animationPresets).toHaveProperty('staggerContainer');
  });

  it('should have consistent structure across all presets', () => {
    Object.values(animationPresets).forEach(preset => {
      expect(preset).toHaveProperty('initial');
      expect(preset).toHaveProperty('animate');
      expect(preset).toHaveProperty('transition');
      expect(preset.transition).toHaveProperty('duration');
    });
  });
});

/**
 * Unit Tests for Page Load Animations
 * 
 * Tests that verify page load animations trigger correctly on initial render.
 * Validates: Requirements 4.5
 */

describe('Page Load Animations', () => {
  it('should trigger fadeIn animation on page load', () => {
    const preset = animationPresets.fadeIn;
    
    // Verify initial state (before animation)
    expect(preset.initial.opacity).toBe(0);
    
    // Verify animate state (after animation)
    expect(preset.animate.opacity).toBe(1);
    
    // Verify animation has appropriate duration for page load
    expect(preset.transition.duration).toBeGreaterThanOrEqual(0.4);
    expect(preset.transition.duration).toBeLessThanOrEqual(0.8);
  });

  it('should trigger fadeInUp animation on page load', () => {
    const preset = animationPresets.fadeInUp;
    
    // Verify initial state
    expect(preset.initial.opacity).toBe(0);
    expect(preset.initial.y).toBe(20);
    
    // Verify animate state
    expect(preset.animate.opacity).toBe(1);
    expect(preset.animate.y).toBe(0);
    
    // Verify has easing function for smooth animation
    expect(preset.transition.ease).toBeDefined();
    expect(preset.transition.ease).not.toBe('linear');
  });

  it('should trigger scaleIn animation on page load', () => {
    const preset = animationPresets.scaleIn;
    
    // Verify initial state
    expect(preset.initial.opacity).toBe(0);
    expect(preset.initial.scale).toBe(0.9);
    
    // Verify animate state
    expect(preset.animate.opacity).toBe(1);
    expect(preset.animate.scale).toBe(1);
    
    // Verify animation duration is appropriate for page load
    expect(preset.transition.duration).toBeGreaterThanOrEqual(0.3);
    expect(preset.transition.duration).toBeLessThanOrEqual(0.6);
  });

  it('should support staggered animations for multiple elements on page load', () => {
    const itemCount = 4;
    const animations = createStaggerAnimation(itemCount);
    
    // Verify correct number of animations created
    expect(animations).toHaveLength(itemCount);
    
    // Verify each animation has increasing delay
    animations.forEach((animation, index) => {
      const expectedDelay = index * 0.1; // Default stagger delay
      expect(animation.transition.delay).toBe(expectedDelay);
    });
    
    // Verify all animations start from invisible state
    animations.forEach(animation => {
      expect(animation.initial.opacity).toBe(0);
    });
    
    // Verify all animations end in visible state
    animations.forEach(animation => {
      expect(animation.animate.opacity).toBe(1);
    });
  });

  it('should allow custom delay for page load animations', () => {
    const customDelay = 0.3;
    const preset = getAnimationPreset('fadeIn', customDelay);
    
    expect(preset.transition.delay).toBe(customDelay);
    
    // Verify other properties are preserved
    expect(preset.initial.opacity).toBe(0);
    expect(preset.animate.opacity).toBe(1);
  });

  it('should have slideInLeft animation for page load', () => {
    const preset = animationPresets.slideInLeft;
    
    // Verify initial state (off-screen left)
    expect(preset.initial.opacity).toBe(0);
    expect(preset.initial.x).toBe(-50);
    
    // Verify animate state (on-screen)
    expect(preset.animate.opacity).toBe(1);
    expect(preset.animate.x).toBe(0);
    
    // Verify smooth easing
    expect(preset.transition.ease).toBeDefined();
  });

  it('should have slideInRight animation for page load', () => {
    const preset = animationPresets.slideInRight;
    
    // Verify initial state (off-screen right)
    expect(preset.initial.opacity).toBe(0);
    expect(preset.initial.x).toBe(50);
    
    // Verify animate state (on-screen)
    expect(preset.animate.opacity).toBe(1);
    expect(preset.animate.x).toBe(0);
  });

  it('should have blurIn animation for page load', () => {
    const preset = animationPresets.blurIn;
    
    // Verify initial state (blurred and invisible)
    expect(preset.initial.opacity).toBe(0);
    expect(preset.initial.filter).toBe('blur(10px)');
    
    // Verify animate state (clear and visible)
    expect(preset.animate.opacity).toBe(1);
    expect(preset.animate.filter).toBe('blur(0px)');
    
    // Verify appropriate duration
    expect(preset.transition.duration).toBeGreaterThanOrEqual(0.4);
  });

  it('should have rotateIn animation for page load', () => {
    const preset = animationPresets.rotateIn;
    
    // Verify initial state (rotated and invisible)
    expect(preset.initial.opacity).toBe(0);
    expect(preset.initial.rotate).toBe(-10);
    
    // Verify animate state (straight and visible)
    expect(preset.animate.opacity).toBe(1);
    expect(preset.animate.rotate).toBe(0);
  });

  it('should create stagger animations with custom timing', () => {
    const itemCount = 3;
    const baseDelay = 0.2;
    const staggerDelay = 0.15;
    
    const animations = createStaggerAnimation(itemCount, baseDelay, staggerDelay);
    
    // Verify first item has base delay
    expect(animations[0].transition.delay).toBe(baseDelay);
    
    // Verify second item has base + stagger delay
    expect(animations[1].transition.delay).toBe(baseDelay + staggerDelay);
    
    // Verify third item has base + 2 * stagger delay
    expect(animations[2].transition.delay).toBe(baseDelay + 2 * staggerDelay);
  });

  it('should have all page load animations start from invisible state', () => {
    const pageLoadAnimations = [
      animationPresets.fadeIn,
      animationPresets.fadeInUp,
      animationPresets.fadeInDown,
      animationPresets.scaleIn,
      animationPresets.slideInLeft,
      animationPresets.slideInRight,
      animationPresets.blurIn,
      animationPresets.rotateIn,
    ];
    
    pageLoadAnimations.forEach(preset => {
      expect(preset.initial.opacity).toBe(0);
    });
  });

  it('should have all page load animations end in visible state', () => {
    const pageLoadAnimations = [
      animationPresets.fadeIn,
      animationPresets.fadeInUp,
      animationPresets.fadeInDown,
      animationPresets.scaleIn,
      animationPresets.slideInLeft,
      animationPresets.slideInRight,
      animationPresets.blurIn,
      animationPresets.rotateIn,
    ];
    
    pageLoadAnimations.forEach(preset => {
      expect(preset.animate.opacity).toBe(1);
    });
  });

  it('should have scaleInBounce animation with bounce easing for playful page load', () => {
    const preset = animationPresets.scaleInBounce;
    
    // Verify initial state
    expect(preset.initial.opacity).toBe(0);
    expect(preset.initial.scale).toBe(0.8);
    
    // Verify animate state
    expect(preset.animate.opacity).toBe(1);
    expect(preset.animate.scale).toBe(1);
    
    // Verify bounce easing (should be an array with specific values)
    expect(Array.isArray(preset.transition.ease)).toBe(true);
    expect(preset.transition.ease).toHaveLength(4);
  });

  it('should support stagger container for coordinated page load animations', () => {
    const container = animationPresets.staggerContainer;
    const item = animationPresets.staggerItem;
    
    // Verify container has stagger configuration
    expect(container.animate.transition.staggerChildren).toBeDefined();
    expect(container.animate.transition.staggerChildren).toBeGreaterThan(0);
    
    // Verify item animation is compatible with stagger
    expect(item.initial.opacity).toBe(0);
    expect(item.animate.opacity).toBe(1);
  });

  it('should have appropriate animation durations for perceived performance', () => {
    // Page load animations should feel fast but not jarring
    const criticalAnimations = [
      animationPresets.fadeIn,
      animationPresets.scaleIn,
    ];
    
    criticalAnimations.forEach(preset => {
      const durationMs = preset.transition.duration * 1000;
      
      // Should be fast enough to not feel sluggish
      expect(durationMs).toBeLessThanOrEqual(800);
      
      // Should be slow enough to be perceived as smooth
      expect(durationMs).toBeGreaterThanOrEqual(300);
    });
  });

  it('should preserve animation preset properties when adding delay', () => {
    const originalPreset = animationPresets.fadeInUp;
    const delayedPreset = getAnimationPreset('fadeInUp', 0.5);
    
    // Verify initial state is preserved
    expect(delayedPreset.initial).toEqual(originalPreset.initial);
    
    // Verify animate state is preserved
    expect(delayedPreset.animate).toEqual(originalPreset.animate);
    
    // Verify duration is preserved
    expect(delayedPreset.transition.duration).toBe(originalPreset.transition.duration);
    
    // Verify easing is preserved
    expect(delayedPreset.transition.ease).toEqual(originalPreset.transition.ease);
    
    // Verify delay is added
    expect(delayedPreset.transition.delay).toBe(0.5);
  });
});
