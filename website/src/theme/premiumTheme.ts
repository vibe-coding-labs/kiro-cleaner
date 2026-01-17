/**
 * Premium Theme Configuration
 * 
 * Extends modernTheme with advanced visual effects including:
 * - Multi-level shadow system
 * - Glassmorphism effects
 * - Enhanced animations
 * - Premium component styles
 */

import { createTheme, type Shadows } from '@mui/material/styles';
import { modernTheme } from './modernTheme';
import { colorTokens, typographyTokens, spacingTokens, animationTokens } from './tokens';
import { shadowTokens } from './tokens/shadows';
import { effectTokens } from './tokens/effects';

// Create premium shadows array
const premiumShadows = Array(25).fill('none') as Shadows;
premiumShadows[0] = 'none';
premiumShadows[1] = shadowTokens.elevation.xs;
premiumShadows[2] = shadowTokens.elevation.sm;
premiumShadows[3] = shadowTokens.elevation.md;
premiumShadows[4] = shadowTokens.elevation.lg;
premiumShadows[5] = shadowTokens.elevation.xl;
premiumShadows[6] = shadowTokens.elevation['2xl'];

export const premiumTheme = createTheme({
  ...modernTheme,
  
  // Enhanced shadows
  shadows: premiumShadows,
  
  components: {
    ...modernTheme.components,
    
    // Enhanced CssBaseline with animations
    MuiCssBaseline: {
      styleOverrides: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        * {
          box-sizing: border-box;
        }
        
        html {
          scroll-behavior: smooth;
        }
        
        body {
          font-family: ${typographyTokens.fontFamily.primary};
        }
        
        /* Focus visible styles */
        *:focus-visible {
          outline: 2px solid ${colorTokens.brand.primary};
          outline-offset: 2px;
        }
        
        /* Shimmer animation - for loading states and shine effects */
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        /* Gradient shift animation - for animated gradient backgrounds */
        @keyframes gradient-shift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        /* Fade animations */
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Scale animations */
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes scaleInBounce {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        /* Slide animations */
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Rotate animation */
        @keyframes rotateIn {
          from {
            opacity: 0;
            transform: rotate(-10deg);
          }
          to {
            opacity: 1;
            transform: rotate(0);
          }
        }
        
        /* Blur animation */
        @keyframes blurIn {
          from {
            opacity: 0;
            filter: blur(10px);
          }
          to {
            opacity: 1;
            filter: blur(0);
          }
        }
        
        /* Pulse animation - for attention-grabbing elements */
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        
        /* Float animation - for floating elements */
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        /* Glow animation - for glowing effects */
        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 5px currentColor;
          }
          50% {
            box-shadow: 0 0 20px currentColor;
          }
        }
        
        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `,
    },
    
    // Enhanced Button with ripple and glow effects
    MuiButton: {
      styleOverrides: {
        root: {
          ...modernTheme.components?.MuiButton?.styleOverrides?.root,
          position: 'relative',
          overflow: 'hidden',
          // CSS containment for performance (Requirements 7.4)
          contain: 'layout style paint',
          
          // Ripple effect
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 0,
            height: 0,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.5)',
            transform: 'translate(-50%, -50%)',
            transition: 'width 0.6s, height 0.6s',
          },
          
          '&:hover': {
            // Add will-change on hover for better performance (Requirements 7.4)
            willChange: 'transform, box-shadow',
          },
          
          '&:active::before': {
            width: '300px',
            height: '300px',
          },
        },
        
        contained: {
          background: colorTokens.gradients.heroAlt,
          boxShadow: shadowTokens.colored.primary,
          
          '&:hover': {
            background: colorTokens.gradients.heroAlt,
            boxShadow: shadowTokens.elevation.xl,
            transform: 'translateY(-2px)',
          },
          
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        
        outlined: {
          borderWidth: '2px',
          background: effectTokens.glass.light.background,
          backdropFilter: effectTokens.glass.light.backdropFilter,
          
          '&:hover': {
            borderWidth: '2px',
            background: effectTokens.glass.medium.background,
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    
    // Enhanced Card with glass effect and shine
    MuiCard: {
      styleOverrides: {
        root: {
          ...modernTheme.components?.MuiCard?.styleOverrides?.root,
          background: effectTokens.glass.light.background,
          backdropFilter: effectTokens.glass.light.backdropFilter,
          border: effectTokens.glass.light.border,
          position: 'relative',
          // CSS containment for performance (Requirements 7.4)
          contain: 'layout style paint',
          
          '&:hover': {
            transform: 'translateY(-8px) scale(1.02)',
            boxShadow: shadowTokens.elevation['2xl'],
            borderColor: colorTokens.brand.primary,
            // Add will-change on hover for better performance (Requirements 7.4)
            willChange: 'transform, box-shadow',
          },
          
          // Shine effect on hover
          '&::after': {
            content: '""',
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background: effectTokens.shimmer.gradient,
            transform: 'rotate(45deg)',
            opacity: 0,
            transition: 'opacity 0.3s',
            pointerEvents: 'none',
            // will-change for shimmer animation (Requirements 7.4)
            willChange: 'opacity, transform',
          },
          
          '&:hover::after': {
            opacity: 1,
            animation: `${effectTokens.shimmer.animation}`,
          },
        },
      },
    },
    
    // Enhanced AppBar with glass effect
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: effectTokens.glass.light.background,
          backdropFilter: effectTokens.glass.light.backdropFilter,
          borderBottom: effectTokens.glass.light.border,
          boxShadow: shadowTokens.elevation.sm,
        },
      },
    },
    
    // Enhanced Paper
    MuiPaper: {
      styleOverrides: {
        root: {
          ...modernTheme.components?.MuiPaper?.styleOverrides?.root,
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: shadowTokens.elevation.sm,
        },
        elevation2: {
          boxShadow: shadowTokens.elevation.md,
        },
        elevation3: {
          boxShadow: shadowTokens.elevation.lg,
        },
        elevation4: {
          boxShadow: shadowTokens.elevation.xl,
        },
      },
    },
    
    // Enhanced Tabs
    MuiTabs: {
      styleOverrides: {
        root: {
          ...modernTheme.components?.MuiTabs?.styleOverrides?.root,
          borderBottom: `2px solid ${colorTokens.border.default}`,
        },
        indicator: {
          height: '3px',
          borderRadius: '3px 3px 0 0',
          background: colorTokens.gradients.heroAlt,
        },
      },
    },
    
    // Enhanced Tab
    MuiTab: {
      styleOverrides: {
        root: {
          ...modernTheme.components?.MuiTab?.styleOverrides?.root,
          transition: `all ${animationTokens.duration.fast}ms ${animationTokens.easing.standard}`,
          
          '&:hover': {
            background: effectTokens.glass.light.background,
          },
          
          '&.Mui-selected': {
            background: effectTokens.glass.light.background,
          },
        },
      },
    },
  },
});
