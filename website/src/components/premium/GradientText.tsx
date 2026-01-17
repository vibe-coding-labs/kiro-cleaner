import React, { type ComponentProps } from 'react';
import { Typography } from '@mui/material';

interface GradientTextProps extends ComponentProps<typeof Typography> {
  gradient?: string;
}

const GradientText: React.FC<GradientTextProps> = ({ 
  children, 
  gradient = 'linear-gradient(135deg, #3498db 0%, #2ecc71 100%)',
  sx,
  ...props 
}) => {
  return (
    <Typography
      sx={{
        background: gradient,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        display: 'inline-block',
        ...sx,
      }}
      {...props}
    >
      {children}
    </Typography>
  );
};

export default GradientText;
