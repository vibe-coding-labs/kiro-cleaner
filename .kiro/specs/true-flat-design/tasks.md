# Implementation Plan: True Flat Design

## Overview

系统性地将网站改造为真正的扁平化设计，移除所有渐变、阴影和 glassmorphism 效果。

## Tasks

- [x] 1. Remove gradient and glass components
  - Delete or disable GradientText component usage
  - Delete or disable GlassCard component usage
  - Remove gradient utility functions
  - _Requirements: 1.3, 3.1, 3.2_

- [x] 2. Update HeroSection to flat design
  - Remove gradient overlay (::before pseudo-element)
  - Remove decorative gradient blobs
  - Replace GradientText with regular Typography
  - Simplify video container (remove heavy shadow, use border)
  - Use solid background color
  - _Requirements: 1.1, 1.2, 1.4, 2.4, 4.3_

- [x] 3. Update Features component to flat design
  - Remove gradient icon backgrounds
  - Use solid color backgrounds for icons
  - Remove colored shadows on hover
  - Use border color change on hover
  - Remove gradient top border animation
  - _Requirements: 1.1, 2.1, 2.2, 5.4_

- [x] 4. Update NavigationBar to flat design
  - Ensure solid background (already done)
  - Verify no glassmorphism effects
  - Simplify hover effects (color change only)
  - _Requirements: 3.1, 3.2, 4.1, 7.4_

- [x] 5. Update all buttons to flat design
  - Remove all box-shadow from buttons
  - Use solid backgrounds
  - Change background color on hover (no shadow)
  - Keep borders for outlined buttons
  - _Requirements: 2.1, 2.2, 5.4, 7.1_

- [x] 6. Update HowItWorks component
  - Remove gradient backgrounds from step cards
  - Use solid color accents
  - Simplify hover effects
  - Use borders instead of shadows
  - _Requirements: 1.1, 2.3, 5.1, 5.2_

- [x] 7. Update UseCases component
  - Remove gradient decorative backgrounds
  - Use solid color icon backgrounds
  - Simplify hover effects
  - Use borders for cards
  - _Requirements: 1.1, 2.3, 5.1, 5.2_

- [x] 8. Update FAQ component
  - Ensure accordions have no shadows
  - Use borders for separation
  - Simplify expand/collapse animation
  - _Requirements: 2.1, 5.1, 5.2_

- [x] 9. Update global theme and CSS
  - Verify all shadows are 'none' in theme
  - Remove gradient definitions from color tokens
  - Update global CSS to prevent gradients
  - Simplify transition definitions
  - _Requirements: 1.1, 2.1, 4.2, 6.1, 6.2_

- [x] 10. Clean up unused utilities
  - Remove gradient fallback utilities
  - Remove glassmorphism utilities
  - Remove complex animation presets
  - Keep only simple fade/color transitions
  - _Requirements: 3.3, 4.1, 4.2_

- [x] 11. Visual review and refinement
  - Review all pages for consistency
  - Adjust colors for better contrast
  - Fine-tune spacing and borders
  - Ensure clean, modern appearance
  - _Requirements: 5.3, 6.3, 6.4_

- [x] 12. Run tests and fix failures
  - Run all component tests
  - Fix any failing tests related to gradients/shadows
  - Ensure all flat design properties pass
  - _Requirements: All_

## Notes

- Focus on removing effects, not adding new ones
- Use borders and spacing for visual hierarchy
- Keep transitions simple (color and opacity only)
- Maintain accessibility (contrast, focus states)
- Test on different screen sizes
