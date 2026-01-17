import React from 'react';
import { Container, Box, Typography, Button, Stack, Chip, Avatar } from '@mui/material';
import { Download, ArrowForward, Speed, Security, CloudDone } from '@mui/icons-material';
import { colorTokens } from '../theme/tokens';
import { effectTokens } from '../theme/tokens/effects';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import GradientText from './premium/GradientText';
import { getResponsiveSpacing, getResponsiveFontSize } from '../utils/responsive';
import { getFocusVisibleStyles, getAccessibleAnimation } from '../utils/accessibility';

const HeroSection: React.FC = () => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1, triggerOnce: true });

  return (
    <Box 
      ref={ref as any}
      sx={{ 
        position: 'relative',
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        // CSS containment for performance (Requirements 7.4)
        contain: 'layout style',
        // Mesh gradient background (Requirements 2.2)
        background: effectTokens.mesh.hero,
        backgroundColor: colorTokens.background.paper,
        pt: getResponsiveSpacing(12, 8), // Responsive padding (Requirements 7.1, 7.2)
        pb: getResponsiveSpacing(12, 8),
        
        // Animated gradient overlay (Requirements 2.2)
        // Lazy load: only animate when visible (Requirements 7.4)
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(135deg, ${colorTokens.brand.primary}15 0%, ${colorTokens.brand.secondary}15 50%, ${colorTokens.brand.accent}15 100%)`,
          opacity: 0.3,
          animation: isVisible ? 'gradient-shift 10s ease infinite' : 'none',
          backgroundSize: '200% 200%',
          zIndex: 0,
          // will-change for animated gradient (Requirements 7.4)
          willChange: isVisible ? 'background-position' : 'auto',
        },
        
        '@keyframes gradient-shift': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box 
          display="grid" 
          gridTemplateColumns={{ xs: '1fr', md: 'repeat(2, 1fr)' }} 
          gap={6}
          alignItems="center"
          sx={{
            // Fade-in animation with accessibility support (Requirements 2.5, 4.5, 1.2)
            ...getAccessibleAnimation(
              {
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                // will-change for fade-in animation (Requirements 7.4)
                willChange: isVisible ? 'auto' : 'opacity, transform',
              },
              {
                opacity: 1,
                transform: 'translateY(0)',
              }
            ),
          }}
        >
          {/* Left Content */}
          <Box>
            <Stack spacing={3}>
              {/* Status Badge */}
              <Box>
                <Chip
                  avatar={
                    <Avatar sx={{ bgcolor: colorTokens.semantic.success, width: 24, height: 24 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: colorTokens.background.paper,
                          // Lazy load: only animate when visible (Requirements 7.4)
                          animation: isVisible ? 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' : 'none',
                          // will-change for pulse animation (Requirements 7.4)
                          willChange: isVisible ? 'opacity' : 'auto',
                          '@keyframes pulse': {
                            '0%, 100%': { opacity: 1 },
                            '50%': { opacity: 0.5 },
                          },
                        }}
                      />
                    </Avatar>
                  }
                  label="开源免费 · 持续更新"
                  sx={{
                    backgroundColor: colorTokens.semantic.successLight,
                    color: colorTokens.semantic.success,
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    height: 36,
                    '& .MuiChip-avatar': {
                      marginLeft: '8px',
                    },
                  }}
                />
              </Box>

              {/* Main Headline - Using GradientText component (Requirements 1.1) */}
              <Box>
                <Typography 
                  variant="h1" 
                  component="h1"
                  sx={{ 
                    fontSize: getResponsiveFontSize('4rem', '2.5rem'), // Responsive font size (Requirements 7.1, 7.2)
                    fontWeight: 800,
                    lineHeight: 1.1,
                    color: colorTokens.text.primary,
                  }}
                >
                  让 Kiro IDE
                </Typography>
                <GradientText
                  gradient={colorTokens.gradients.heroAlt}
                  variant="h1"
                  animate={false}
                >
                  <Box
                    component="span"
                    sx={{
                      fontSize: getResponsiveFontSize('4rem', '2.5rem'), // Responsive font size (Requirements 7.1, 7.2)
                      fontWeight: 800,
                      lineHeight: 1.1,
                    }}
                  >
                    轻装上阵
                  </Box>
                </GradientText>
              </Box>

              {/* Subtitle */}
              <Typography 
                variant="h6"
                sx={{ 
                  fontSize: getResponsiveFontSize('1.25rem', '1.125rem'), // Responsive font size (Requirements 7.1, 7.2)
                  fontWeight: 400,
                  lineHeight: 1.7,
                  color: colorTokens.text.secondary,
                  mb: 2,
                }}
              >
                智能扫描、安全清理、自动备份。一键释放存储空间，让你的 AI 助手运行更流畅。
              </Typography>

              {/* Key Benefits */}
              <Box sx={{ mb: 3 }}>
                <Typography 
                  variant="body1"
                  sx={{ 
                    color: colorTokens.text.secondary,
                    lineHeight: 1.8,
                    fontSize: '1rem',
                  }}
                >
                  • 平均释放 <strong style={{ color: colorTokens.brand.primary }}>2-5GB</strong> 存储空间<br/>
                  • 性能提升 <strong style={{ color: colorTokens.brand.primary }}>30-50%</strong><br/>
                  • 支持 <strong style={{ color: colorTokens.brand.primary }}>macOS、Linux、Windows</strong> 全平台
                </Typography>
              </Box>

              {/* Feature Pills */}
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Chip icon={<Speed />} label="快速扫描" size="medium" />
                <Chip icon={<Security />} label="安全可靠" size="medium" />
                <Chip icon={<CloudDone />} label="自动备份" size="medium" />
              </Stack>

              {/* CTA Buttons */}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button 
                  variant="contained"
                  size="large"
                  endIcon={<Download />}
                  href="#installation"
                  aria-label="立即开始使用 Kiro Cleaner"
                  sx={{ 
                    px: 4,
                    py: 1.75,
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    borderRadius: '4px',
                    textTransform: 'none',
                    backgroundColor: colorTokens.brand.primary,
                    boxShadow: `0 4px 14px 0 ${colorTokens.brand.primary}40`,
                    '&:hover': {
                      backgroundColor: colorTokens.brand.primaryDark,
                      boxShadow: `0 6px 20px 0 ${colorTokens.brand.primary}60`,
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.2s ease',
                    // Focus visible styles (Requirements 1.2)
                    ...getFocusVisibleStyles(),
                  }}
                >
                  立即开始
                </Button>
                <Button 
                  variant="outlined"
                  size="large"
                  endIcon={<ArrowForward />}
                  href="#features"
                  aria-label="了解更多关于 Kiro Cleaner 的特性"
                  sx={{ 
                    px: 4,
                    py: 1.75,
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    borderRadius: '4px',
                    textTransform: 'none',
                    borderWidth: '2px',
                    borderColor: colorTokens.neutral[300],
                    color: colorTokens.text.primary,
                    '&:hover': {
                      borderWidth: '2px',
                      borderColor: colorTokens.brand.primary,
                      backgroundColor: colorTokens.brand.primarySubtle,
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.2s ease',
                    // Focus visible styles (Requirements 1.2)
                    ...getFocusVisibleStyles(),
                  }}
                >
                  了解更多
                </Button>
              </Stack>
            </Stack>
          </Box>

          {/* Right Content - Demo Video */}
          <Box>
            <Box
              sx={{
                position: 'relative',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                border: `1px solid ${colorTokens.border.default}`,
                backgroundColor: colorTokens.background.paper,
                transition: 'all 0.3s ease',
                // CSS containment for performance (Requirements 7.4)
                contain: 'layout style paint',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 30px 80px rgba(0,0,0,0.2)',
                  // will-change on hover (Requirements 7.4)
                  willChange: 'transform, box-shadow',
                },
              }}
            >
              <video
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                  style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  borderRadius: '4px',
                  objectFit: 'cover',
                }}
              >
                <source src="/assets/demo-scan-command-hq.mp4" type="video/mp4" />
                <source src="/assets/demo-scan-command.mov" type="video/quicktime" />
                您的浏览器不支持视频播放
              </video>
            </Box>
          </Box>
        </Box>
      </Container>

      {/* Decorative Blobs */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          right: '-5%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: colorTokens.gradients.heroAlt,
          opacity: 0.08,
          filter: 'blur(80px)',
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '20%',
          left: '-5%',
          width: '350px',
          height: '350px',
          borderRadius: '50%',
          background: colorTokens.brand.secondary,
          opacity: 0.08,
          filter: 'blur(80px)',
          zIndex: 0,
        }}
      />
    </Box>
  );
};

export default HeroSection;
