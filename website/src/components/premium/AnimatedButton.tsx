import React from 'react';
import { Button, type ButtonProps } from '@mui/material';

interface AnimatedButtonProps extends ButtonProps {
  glowColor?: string;
  ripple?: boolean;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  glowColor,
  ripple = true,
  sx,
  ...props
}) => {
  return (
    <Button
      {...props}
      sx={{
        ...sx,
        position: 'relative',
        overflow: 'hidden',
        
        // Glow effect
        ...(glowColor && {
          boxShadow: `0 0 20px ${glowColor}40`,
          '&:hover': {
            boxShadow: `0 0 30px ${glowColor}60`,
          },
        }),
        
        // Ripple effect
        ...(ripple && {
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
          '&:active::before': {
            width: '300px',
            height: '300px',
          },
        }),
      }}
    >
      {children}
    </Button>
  );
};

export default AnimatedButton;
