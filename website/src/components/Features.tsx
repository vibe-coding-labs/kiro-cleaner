import React from 'react';
import { Box, Card, CardContent, Typography, Container } from '@mui/material';
import { AutoFixHigh, Security, SettingsBackupRestore, Visibility } from '@mui/icons-material';
import { flatColors } from '../theme/colors';
import { useStaggeredScrollAnimation } from '../hooks/useScrollAnimation';

const Features: React.FC = () => {
  const features = [
    {
      icon: <AutoFixHigh sx={{ fontSize: 32 }} />,
      title: "智能扫描",
      description: "自动发现 Kiro 数据存储位置，分析数据库、缓存和日志文件",
      color: flatColors.primary,
    },
    {
      icon: <Security sx={{ fontSize: 32 }} />,
      title: "安全清理",
      description: "基于规则的清理引擎，只删除缓存和临时文件",
      color: flatColors.accent,
    },
    {
      icon: <SettingsBackupRestore sx={{ fontSize: 32 }} />,
      title: "自动备份",
      description: "清理前自动创建备份，支持压缩",
      color: flatColors.secondary,
    },
    {
      icon: <Visibility sx={{ fontSize: 32 }} />,
      title: "详细报告",
      description: "显示清理前后的空间对比和文件统计",
      color: flatColors.primary,
    }
  ];

  // Stagger animation for feature cards (Requirements 4.1)
  const { containerRef, items: animatedItems } = useStaggeredScrollAnimation(features.length, 100, { threshold: 0.1 });

  return (
    <Container maxWidth="lg" ref={containerRef}>
      <Box 
        display="grid" 
        gridTemplateColumns={{ 
          xs: '1fr', 
          sm: 'repeat(2, 1fr)', 
        }} 
        gap={{ xs: 2, md: 3 }}
      >
        {features.map((feature, index) => (
          <Card
            key={index}
            elevation={0}
            sx={{
              height: '100%',
              backgroundColor: flatColors.surface,
              border: `2px solid ${flatColors.border}`,
              borderRadius: '8px',
              transition: 'all 0.2s ease',
              '&:hover': {
                borderColor: feature.color,
                backgroundColor: flatColors.background,
              },
            }}
          >
            <CardContent sx={{ p: 4 }}>
              {/* Icon with solid background */}
              <Box 
                sx={{ 
                  width: 64,
                  height: 64,
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '8px',
                  backgroundColor: `${feature.color}15`,
                  color: feature.color,
                }}
              >
                {feature.icon}
              </Box>

              <Typography 
                variant="h5" 
                gutterBottom 
                sx={{ 
                  fontWeight: 700, 
                  color: flatColors.textPrimary,
                  mb: 1.5,
                  fontSize: '1.5rem',
                }}
              >
                {feature.title}
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: flatColors.textSecondary, 
                  lineHeight: 1.7,
                  fontSize: '1rem',
                }}
              >
                {feature.description}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  );
};

export default Features;
