import React, { type ComponentProps } from 'react';
import { Box } from '@mui/material';
import { getGlassmorphismStyles } from '../../utils/featureDetection';

interface GlassCardProps extends ComponentProps<typeof Box> {
  hover?: boolean;
  blur?: string;
}

const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  hover = true, 
  blur = '10px',
  sx,
  ...props 
}) => {
  const glassStyles = getGlassmorphismStyles();

  return (
    <Box
      sx={{
        ...glassStyles,
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '12px',
        padding: 3,
        transition: 'all 0.3s ease',
        ...(hover && {
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
          },
        }),
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

export default GlassCard;
