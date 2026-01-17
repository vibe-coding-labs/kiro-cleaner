/**
 * GlassCard Component
 * 
 * A card component with glassmorphism effect.
 * Supports different variants, hover effects, and glow effects.
 * Automatically falls back to solid backgrounds when backdrop-filter is not supported.
 * 
 * Features:
 * - Three glass variants (light, medium, dark)
 * - Optional hover animation
 * - Optional glow effect
 * - Configurable elevation
 * - Graceful degradation for unsupported browsers
 */

import React from 'react';
import { Box, type SxProps, type Theme } from '@mui/material';
import { effectTokens } from '../../theme/tokens/effects';
import { shadowTokens } from '../../theme/tokens/shadows';
import { getGlassmorphismStyles } from '../../utils/featureDetection';

export interface GlassCardProps {
  children: React.ReactNode;
  variant?: 'light' | 'medium' | 'dark';
  hover?: boolean;
  glow?: boolean;
  elevation?: keyof typeof shadowTokens.elevation;
  sx?: SxProps<Theme>;
}

// Fallback colors for browsers that don't support backdrop-filter
const fallbackColors = {
  light: 'rgba(255, 255, 255, 0.95)',
  medium: 'rgba(255, 255, 255, 0.90)',
  dark: 'rgba(0, 0, 0, 0.85)',
};

/**
 * GlassCard component with glassmorphism effect
 * 
 * @param children - Content to display inside the card
 * @param variant - Glass effect variant (light, medium, dark)
 * @param hover - Enable hover animation
 * @param glow - Enable glow effect on hover
 * @param elevation - Shadow elevation level
 * @param sx - Additional MUI sx styles
 * 
 * @example
 * ```tsx
 * <GlassCard variant="light" hover glow>
 *   <Typography>Card content</Typography>
 * </GlassCard>
 * ```
 */
export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  variant = 'light',
  hover = true,
  glow = false,
  elevation = 'md',
  sx = {},
}) => {
  const glassStyle = effectTokens.glass[variant];
  const shadowStyle = shadowTokens.elevation[elevation];
  
  // Get glassmorphism styles with fallback for unsupported browsers
  const glassEffectStyles = getGlassmorphismStyles(
    glassStyle.background,
    fallbackColors[variant],
    '10px'
  );
  
  return (
    <Box
      sx={{
        // Glass effect with fallback
        ...glassEffectStyles,
        border: glassStyle.border,
        
        // Base styles
        borderRadius: '4px',
        padding: 3,
        position: 'relative',
        overflow: 'hidden',
        
        // CSS containment for performance (Requirements 7.4)
        contain: 'layout style paint',
        
        // Shadow
        boxShadow: shadowStyle,
        
        // Transition
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        
        // Hover effects
        ...(hover && {
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: glow 
              ? shadowTokens.glow.md 
              : shadowTokens.elevation.xl,
            borderColor: glow ? 'primary.main' : glassStyle.border,
            // Add will-change on hover for better performance (Requirements 7.4)
            willChange: 'transform, box-shadow',
          },
        }),
        
        // Custom styles
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};

export default GlassCard;
