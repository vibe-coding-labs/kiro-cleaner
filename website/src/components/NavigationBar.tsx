import React from 'react';
import { AppBar, Toolbar, Typography, Box, Button, Container } from '@mui/material';
import { GitHub } from '@mui/icons-material';
import { flatColors } from '../theme/colors';

const NavigationBar: React.FC = () => {
  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{ 
        // Flat design: solid background, no shadows or gradients
        backgroundColor: flatColors.surface,
        borderBottom: `1px solid ${flatColors.border}`,
        boxShadow: 'none',
        backgroundImage: 'none',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ justifyContent: 'space-between', py: 1, px: 0, minHeight: '70px' }}>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              fontWeight: 800, 
              color: flatColors.textPrimary,
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              fontSize: '1.25rem',
              cursor: 'pointer',
              transition: 'color 0.2s ease',
              '&:hover': {
                color: flatColors.primary,
              },
            }}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '8px',
                backgroundColor: flatColors.primary,
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
                color: flatColors.textPrimary,
                fontWeight: 500,
                px: 2,
                minHeight: 44,
                textTransform: 'none',
                fontSize: '0.9375rem',
                transition: 'color 0.2s ease, background-color 0.2s ease',
                '&:hover': {
                  backgroundColor: flatColors.primaryLight,
                  color: flatColors.primary,
                },
              }}
            >
              特性
            </Button>
            <Button 
              href="#use-cases" 
              sx={{ 
                color: flatColors.textPrimary,
                fontWeight: 500,
                px: 2,
                minHeight: 44,
                textTransform: 'none',
                fontSize: '0.9375rem',
                transition: 'color 0.2s ease, background-color 0.2s ease',
                '&:hover': {
                  backgroundColor: flatColors.primaryLight,
                  color: flatColors.primary,
                },
              }}
            >
              场景
            </Button>
            <Button 
              href="#faq" 
              sx={{ 
                color: flatColors.textPrimary,
                fontWeight: 500,
                px: 2,
                minHeight: 44,
                textTransform: 'none',
                fontSize: '0.9375rem',
                transition: 'color 0.2s ease, background-color 0.2s ease',
                '&:hover': {
                  backgroundColor: flatColors.primaryLight,
                  color: flatColors.primary,
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
                color: flatColors.textPrimary,
                borderColor: flatColors.border,
                fontWeight: 500,
                px: 2.5,
                minHeight: 44,
                textTransform: 'none',
                fontSize: '0.9375rem',
                borderRadius: '8px',
                ml: 1,
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: flatColors.textPrimary,
                  borderColor: flatColors.textPrimary,
                  color: '#ffffff',
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
