import React from 'react';
import { AppBar, Toolbar, Typography, Box, Button, Container } from '@mui/material';
import { GitHub } from '@mui/icons-material';
import { colorTokens } from '../theme/tokens';
import { effectTokens } from '../theme/tokens/effects';
import { shadowTokens } from '../theme/tokens/shadows';
import { getGlassmorphismStyles } from '../utils/featureDetection';

const NavigationBar: React.FC = () => {
  // Get glassmorphism styles with fallback for unsupported browsers
  const glassStyles = getGlassmorphismStyles(
    effectTokens.glass.light.background,
    'rgba(255, 255, 255, 0.95)', // Fallback to solid background
    '10px'
  );

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{ 
        // Glass effect with fallback (Requirements 6.3)
        ...glassStyles,
        borderBottom: effectTokens.glass.light.border,
        // Subtle shadow (Requirements 6.3)
        boxShadow: shadowTokens.elevation.sm,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ justifyContent: 'space-between', py: 1, px: 0, minHeight: '70px' }}>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              fontWeight: 800, 
              color: colorTokens.text.primary,
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              fontSize: '1.25rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              // Optimized hover effect (Requirements 3.1)
              '&:hover': {
                opacity: 0.8,
                transform: 'translateY(-1px)',
                // will-change on hover (Requirements 7.4)
                willChange: 'transform, opacity',
              },
            }}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '8px',
                background: colorTokens.gradients.heroAlt,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
              }}
            >
              🧹
            </Box>
            Kiro Cleaner
          </Typography>
          
          <Box display="flex" gap={1} alignItems="center">
            <Button 
              href="#features" 
              sx={{ 
                color: colorTokens.text.primary,
                fontWeight: 500,
                px: 2,
                minHeight: 44, // Touch target size (Requirements 7.3)
                textTransform: 'none',
                fontSize: '0.9375rem',
                transition: 'all 0.2s ease',
                position: 'relative',
                // Optimized hover effect (Requirements 3.1)
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: 8,
                  left: '50%',
                  transform: 'translateX(-50%) scaleX(0)',
                  width: '60%',
                  height: '2px',
                  background: colorTokens.brand.primary,
                  transition: 'transform 0.2s ease',
                  // will-change for underline animation (Requirements 7.4)
                  willChange: 'transform',
                },
                '&:hover': {
                  backgroundColor: 'transparent',
                  color: colorTokens.brand.primary,
                  '&::after': {
                    transform: 'translateX(-50%) scaleX(1)',
                  },
                },
              }}
            >
              特性
            </Button>
            <Button 
              href="#use-cases" 
              sx={{ 
                color: colorTokens.text.primary,
                fontWeight: 500,
                px: 2,
                minHeight: 44, // Touch target size (Requirements 7.3)
                textTransform: 'none',
                fontSize: '0.9375rem',
                transition: 'all 0.2s ease',
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: 8,
                  left: '50%',
                  transform: 'translateX(-50%) scaleX(0)',
                  width: '60%',
                  height: '2px',
                  background: colorTokens.brand.primary,
                  transition: 'transform 0.2s ease',
                  // will-change for underline animation (Requirements 7.4)
                  willChange: 'transform',
                },
                '&:hover': {
                  backgroundColor: 'transparent',
                  color: colorTokens.brand.primary,
                  '&::after': {
                    transform: 'translateX(-50%) scaleX(1)',
                  },
                },
              }}
            >
              场景
            </Button>
            <Button 
              href="#faq" 
              sx={{ 
                color: colorTokens.text.primary,
                fontWeight: 500,
                px: 2,
                minHeight: 44, // Touch target size (Requirements 7.3)
                textTransform: 'none',
                fontSize: '0.9375rem',
                transition: 'all 0.2s ease',
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: 8,
                  left: '50%',
                  transform: 'translateX(-50%) scaleX(0)',
                  width: '60%',
                  height: '2px',
                  background: colorTokens.brand.primary,
                  transition: 'transform 0.2s ease',
                  // will-change for underline animation (Requirements 7.4)
                  willChange: 'transform',
                },
                '&:hover': {
                  backgroundColor: 'transparent',
                  color: colorTokens.brand.primary,
                  '&::after': {
                    transform: 'translateX(-50%) scaleX(1)',
                  },
                },
              }}
            >
              FAQ
            </Button>
            <Button 
              href="https://github.com/vibe-coding-labs/kiro-cleaner" 
              startIcon={<GitHub />}
              variant="outlined"
              sx={{ 
                color: colorTokens.text.primary,
                borderColor: colorTokens.border.default,
                fontWeight: 500,
                px: 2.5,
                minHeight: 44, // Touch target size (Requirements 7.3)
                textTransform: 'none',
                fontSize: '0.9375rem',
                borderRadius: '8px',
                ml: 1,
                '&:hover': {
                  backgroundColor: colorTokens.text.primary,
                  borderColor: colorTokens.text.primary,
                  color: colorTokens.text.inverse,
                },
              }}
            >
              GitHub
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default NavigationBar;
