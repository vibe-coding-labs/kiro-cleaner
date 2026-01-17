import React from 'react';
import { Typography, type TypographyProps } from '@mui/material';
import { createGradientTextStyle } from '../../utils/gradientFallbacks';

interface GradientTextProps {
  children: React.ReactNode;
  gradient: string;
  fallbackColor?: string;
  variant?: TypographyProps['variant'];
  animate?: boolean;
}

const GradientText: React.FC<GradientTextProps> = ({
  children,
  gradient,
  fallbackColor = '#0070f3', // Default to primary brand color
  variant = 'h1',
  animate = false,
}) => {
  // Get gradient text styles with fallback support
  const gradientStyles = createGradientTextStyle(gradient, fallbackColor);
  
  return (
    <Typography
      variant={variant}
      sx={{
        ...gradientStyles,
        display: 'inline-block',
        
        ...(animate && {
          backgroundSize: '200% 200%',
          animation: 'gradient-shift 3s ease infinite',
          // will-change for animated gradient text (Requirements 7.4)
          willChange: 'background-position',
          '@keyframes gradient-shift': {
            '0%': { backgroundPosition: '0% 50%' },
            '50%': { backgroundPosition: '100% 50%' },
            '100%': { backgroundPosition: '0% 50%' },
          },
        }),
      }}
    >
      {children}
    </Typography>
  );
};

export default GradientText;
