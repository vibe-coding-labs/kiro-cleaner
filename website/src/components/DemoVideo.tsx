import React from 'react';
import { Box } from '@mui/material';
import { colorTokens } from '../theme/tokens';
import { effectTokens } from '../theme/tokens/effects';
import { shadowTokens } from '../theme/tokens/shadows';

const DemoVideo: React.FC = () => {
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 3.0; // 3x speed
    }
  }, []);

  return (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{ 
          borderRadius: '8px', 
          overflow: 'hidden', 
          position: 'relative', 
          paddingTop: '56.25%', // 16:9 Aspect Ratio
          backgroundColor: colorTokens.neutral[900],
          // Flat design: border instead of shadow
          border: `1px solid ${colorTokens.border.default}`,
          boxShadow: 'none',
          transition: 'border-color 0.3s ease',
          // CSS containment for performance
          contain: 'layout style paint',
          '&:hover': {
            borderColor: colorTokens.brand.primary,
          },
        }}
      >
        <Box
          component="video"
          ref={videoRef}
          src="/assets/demo-clean-command.mov"
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
