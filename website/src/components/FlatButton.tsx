import React from 'react';
import { Button, type ButtonProps } from '@mui/material';
import { flatColors } from '../theme/colors';

export interface FlatButtonProps extends Omit<ButtonProps, 'variant'> {
  variant?: 'primary' | 'secondary' | 'outline';
  children: React.ReactNode;
}

const FlatButton: React.FC<FlatButtonProps> = ({ 
  variant = 'primary', 
  children, 
  sx,
  ...props 
}) => {
  const getButtonStyles = () => {
    const baseStyles = {
      px: 3,  // 24px horizontal padding
      py: 1.5, // 12px vertical padding
      fontWeight: 600,
      fontSize: '1rem',
      textTransform: 'none' as const,
      transition: 'background-color 250ms ease-in-out, color 250ms ease-in-out, opacity 250ms ease-in-out, border-color 250ms ease-in-out',
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyles,
          backgroundColor: flatColors.primary,
          color: flatColors.surface,
          border: 'none',
          '&:hover': {
            backgroundColor: flatColors.primaryDark,
            opacity: 0.9,
          },
          '&:active': {
            backgroundColor: flatColors.primaryDark,
          },
        };
      
      case 'secondary':
        return {
          ...baseStyles,
          backgroundColor: flatColors.secondary,
          color: flatColors.surface,
          border: 'none',
          '&:hover': {
            backgroundColor: flatColors.secondaryDark,
            opacity: 0.9,
          },
          '&:active': {
            backgroundColor: flatColors.secondaryDark,
          },
        };
      
      case 'outline':
        return {
          ...baseStyles,
          backgroundColor: 'transparent',
          color: flatColors.primary,
          border: `2px solid ${flatColors.primary}`,
          '&:hover': {
            backgroundColor: flatColors.primary,
            color: flatColors.surface,
            borderColor: flatColors.primary,
          },
          '&:active': {
            backgroundColor: flatColors.primaryDark,
            borderColor: flatColors.primaryDark,
          },
        };
      
      default:
        return baseStyles;
    }
  };

  return (
    <Button
      {...props}
      sx={{
        ...getButtonStyles(),
        ...sx,
      }}
    >
      {children}
    </Button>
  );
};

export default FlatButton;
