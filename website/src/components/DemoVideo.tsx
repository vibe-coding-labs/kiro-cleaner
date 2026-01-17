import React from 'react';
import { Box } from '@mui/material';
import { colorTokens } from '../theme/tokens';
import { effectTokens } from '../theme/tokens/effects';
import { shadowTokens } from '../theme/tokens/shadows';

const DemoVideo: React.FC = () => {
  return (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{ 
          borderRadius: '8px', 
          overflow: 'hidden', 
          position: 'relative', 
          paddingTop: '56.25%', // 16:9 Aspect Ratio
          backgroundColor: colorTokens.neutral[900],
          // Glass effect border (Requirements 2.3)
          border: effectTokens.glass.light.border,
          // Elevation shadow (Requirements 2.3)
          boxShadow: shadowTokens.elevation['2xl'],
          transition: 'all 0.3s ease',
          // CSS containment for performance (Requirements 7.4)
          contain: 'layout style paint',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: `${shadowTokens.elevation['2xl']}, ${shadowTokens.glow.sm}`,
            // will-change on hover (Requirements 7.4)
            willChange: 'transform, box-shadow',
          },
        }}
      >
        <Box
          component="video"
          src="/demo-scan-command.mov"
          autoPlay
          loop
          muted
          playsInline
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
        />
      </Box>
    </Box>
  );
};

export default DemoVideo;
