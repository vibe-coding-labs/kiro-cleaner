import React from 'react';
import { Box, CardContent, Typography, Container } from '@mui/material';
import { AutoFixHigh, Security, SettingsBackupRestore, Visibility } from '@mui/icons-material';
import { colorTokens } from '../theme/tokens';
import { shadowTokens } from '../theme/tokens/shadows';
import { useStaggeredScrollAnimation } from '../hooks/useScrollAnimation';
import GlassCard from './premium/GlassCard';
import { getResponsiveSpacing } from '../utils/responsive';

const Features: React.FC = () => {
  const features = [
    {
      icon: <AutoFixHigh sx={{ fontSize: 32 }} />,
      title: "智能扫描",
      description: "自动发现 Kiro 数据存储位置，智能分析使用情况，精准识别可清理的冗余数据",
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      shadow: shadowTokens.colored.primary,
    },
    {
      icon: <Security sx={{ fontSize: 32 }} />,
      title: "安全清理",
      description: "基于规则的智能清理引擎，确保数据安全，绝不误删重要文件",
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      shadow: shadowTokens.colored.accent,
    },
    {
      icon: <SettingsBackupRestore sx={{ fontSize: 32 }} />,
      title: "自动备份",
      description: "清理前自动创建备份，支持压缩和增量备份，数据安全有保障",
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      shadow: shadowTokens.colored.primary,
    },
    {
      icon: <Visibility sx={{ fontSize: 32 }} />,
      title: "详细报告",
      description: "清理前后对比，空间节省统计，可视化展示清理效果",
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      shadow: shadowTokens.colored.secondary,
    }
  ];

  // Stagger animation for feature cards (Requirements 4.1)
  const animatedItems = useStaggeredScrollAnimation(features.length, 100, { threshold: 0.1 });

  return (
    <Container maxWidth="lg">
      <Box 
        display="grid" 
        gridTemplateColumns={{ 
          xs: '1fr', 
          sm: 'repeat(2, 1fr)', 
        }} 
        gap={getResponsiveSpacing(3, 2)} // Responsive gap (Requirements 7.1, 7.2)
      >
        {features.map((feature, index) => (
          <Box
            key={index}
            ref={animatedItems[index].ref as any}
            sx={{
              // CSS containment for performance (Requirements 7.4)
              contain: 'layout style',
              // Fade-in animation with stagger (Requirements 4.1)
              opacity: animatedItems[index].isVisible ? 1 : 0,
              transform: animatedItems[index].isVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
              // will-change for fade-in animation (Requirements 7.4)
              willChange: animatedItems[index].isVisible ? 'auto' : 'opacity, transform',
            }}
          >
            <GlassCard
              variant="light"
              hover
              glow
              sx={{
                height: '100%',
                position: 'relative',
                overflow: 'hidden',
                // Colored shadow on hover (Requirements 3.3)
                '&:hover': {
                  boxShadow: feature.shadow,
                  // will-change on hover (Requirements 7.4)
                  willChange: 'transform, box-shadow',
                  // Animate icon on hover
                  '& .feature-icon-bg': {
                    opacity: 0.3,
                    transform: 'scale(1.1)',
                  },
                  '& .feature-icon': {
                    transform: 'scale(1.1)',
                  },
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: feature.gradient,
                  transform: 'scaleX(0)',
                  transformOrigin: 'left',
                  transition: 'transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
                  // will-change for top border animation (Requirements 7.4)
                  willChange: 'transform',
                },
                '&:hover::before': {
                  transform: 'scaleX(1)',
                },
              }}
              >
              <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                {/* Icon with gradient background (Requirements 3.3) */}
                <Box 
                  sx={{ 
                    position: 'relative',
                    width: 64,
                    height: 64,
                    mb: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Box
                    className="feature-icon-bg"
                    sx={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      borderRadius: '4px',
                      background: feature.gradient,
                      opacity: 0.15,
                      transition: 'all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
                      boxShadow: feature.shadow,
                      // will-change for icon background animation (Requirements 7.4)
                      willChange: 'opacity, transform',
                    }}
                  />
                  <Box
                    className="feature-icon"
                    sx={{
                      position: 'relative',
                      zIndex: 1,
                      color: colorTokens.text.primary,
                      display: 'flex',
                      transition: 'all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
                      // will-change for icon animation (Requirements 7.4)
                      willChange: 'transform',
                    }}
                  >
                    {feature.icon}
                  </Box>
                </Box>

                <Typography 
                  variant="h5" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 700, 
                    color: colorTokens.text.primary,
                    mb: 1.5,
                    fontSize: '1.5rem',
                  }}
                >
                  {feature.title}
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: colorTokens.text.secondary, 
                    lineHeight: 1.7,
                    fontSize: '1rem',
                  }}
                >
                  {feature.description}
                </Typography>
              </CardContent>
            </GlassCard>
          </Box>
        ))}
      </Box>
    </Container>
  );
};

export default Features;
