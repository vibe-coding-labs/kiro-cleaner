import React from 'react';
import { Container, Box, Typography, Button, Stack, Chip } from '@mui/material';
import { Download, ArrowForward, Speed, Security, CloudDone } from '@mui/icons-material';
import { flatColors } from '../theme/colors';

const HeroSection: React.FC = () => {
  return (
    <Box 
      sx={{ 
        position: 'relative',
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: flatColors.background,
        pt: { xs: 8, md: 12 },
        pb: { xs: 8, md: 12 },
      }}
    >
      <Container maxWidth="lg">
        <Box 
          display="grid" 
          gridTemplateColumns={{ xs: '1fr', md: 'repeat(2, 1fr)' }} 
          gap={6}
          alignItems="center"
        >
          {/* Left Content */}
          <Box>
            <Stack spacing={3}>
              {/* Status Badge */}
              <Box>
                <Chip
                  label="开源免费 · 持续更新"
                  sx={{
                    backgroundColor: flatColors.secondaryLight,
                    color: flatColors.secondary,
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    height: 36,
                  }}
                />
              </Box>

              {/* Main Headline */}
              <Box>
                <Typography 
                  variant="h1" 
                  component="h1"
                  sx={{ 
                    fontSize: { xs: '2.5rem', md: '4rem' },
                    fontWeight: 800,
                    lineHeight: 1.1,
                    color: flatColors.textPrimary,
                    mb: 1,
                  }}
                >
                  让 Kiro IDE
                </Typography>
                <Typography 
                  variant="h1" 
                  component="h1"
                  sx={{ 
                    fontSize: { xs: '2.5rem', md: '4rem' },
                    fontWeight: 800,
                    lineHeight: 1.1,
                    color: flatColors.primary,
                  }}
                >
                  轻装上阵
                </Typography>
              </Box>

              {/* Subtitle */}
              <Typography 
                variant="h6"
                sx={{ 
                  fontSize: { xs: '1.125rem', md: '1.25rem' },
                  fontWeight: 400,
                  lineHeight: 1.7,
                  color: flatColors.textSecondary,
                  mb: 2,
                }}
              >
                Kiro IDE 缓存过大导致卡顿？一键清理，立即提速！
              </Typography>

              {/* Key Benefits */}
              <Box sx={{ mb: 3 }}>
                <Typography 
                  variant="body1"
                  sx={{ 
                    color: flatColors.textSecondary,
                    lineHeight: 1.8,
                    fontSize: '1rem',
                  }}
                >
                  • <strong style={{ color: flatColors.primary }}>解决卡顿</strong>：清理冗余缓存，IDE 响应速度提升<br/>
                  • <strong style={{ color: flatColors.primary }}>释放空间</strong>：清理对话历史、临时文件<br/>
                  • <strong style={{ color: flatColors.primary }}>安全可靠</strong>：自动备份，随时恢复
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
                    backgroundColor: flatColors.primary,
                    boxShadow: 'none',
                    '&:hover': {
                      backgroundColor: flatColors.primaryDark,
                      boxShadow: 'none',
                    },
                    transition: 'background-color 0.2s ease',
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
                    borderColor: flatColors.border,
                    color: flatColors.textPrimary,
                    '&:hover': {
                      borderWidth: '2px',
                      borderColor: flatColors.primary,
                      backgroundColor: flatColors.primaryLight,
                    },
                    transition: 'all 0.2s ease',
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
                border: `2px solid ${flatColors.border}`,
                backgroundColor: '#000',
                transform: 'scale(1.3)',
                transformOrigin: 'center',
              }}
            >
              <video
                autoPlay
                loop
                muted
                playsInline
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                }}
                key="/assets/demo-clean-command.mov"
              >
                <source src="/assets/demo-clean-command.mov" type="video/mp4" />
                您的浏览器不支持视频播放
              </video>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default HeroSection;
