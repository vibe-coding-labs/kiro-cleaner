/**
 * Use Cases Section
 * 
 * Showcases different scenarios where Kiro Cleaner is useful
 */

import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent } from '@mui/material';
import { Code, Storage, Speed, TrendingUp } from '@mui/icons-material';
import { colorTokens } from '../theme/tokens';

const UseCases: React.FC = () => {
  const useCases = [
    {
      icon: <Speed sx={{ fontSize: 40 }} />,
      title: 'IDE 运行缓慢',
      scenario: '当 Kiro IDE 响应变慢、卡顿严重',
      solution: '本地缓存过大是主要原因！清理冗余数据后，IDE 立即起飞，响应速度显著提升。',
      stats: '性能提升明显',
      color: colorTokens.semantic.success,
    },
    {
      icon: <Storage sx={{ fontSize: 40 }} />,
      title: '存储空间不足',
      scenario: '当你的磁盘空间告急',
      solution: 'Kiro Cleaner 可以清理对话历史、缓存和临时文件，释放大量存储空间。',
      stats: '释放存储空间',
      color: colorTokens.brand.primary,
    },
    {
      icon: <Code sx={{ fontSize: 40 }} />,
      title: '项目切换频繁',
      scenario: '当你在多个项目间切换',
      solution: '定期清理可以避免项目数据混乱，保持 IDE 运行流畅。',
      stats: '支持批量清理',
      color: colorTokens.brand.secondary,
    },
    {
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      title: '长期使用维护',
      scenario: '当你长期使用 Kiro IDE',
      solution: '定期维护可以防止数据累积，避免性能下降。',
      stats: '建议定期清理',
      color: colorTokens.semantic.warning,
    },
  ];

  return (
    <Box 
      id="use-cases"
      sx={{ 
        py: { xs: 10, md: 15 }, 
        backgroundColor: colorTokens.background.paper,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="lg">
        {/* Section Header */}
        <Box sx={{ textAlign: 'center', mb: 10 }}>
          <Typography 
            variant="overline"
            sx={{
              color: colorTokens.brand.primary,
              fontWeight: 700,
              fontSize: '0.875rem',
              letterSpacing: '0.1em',
              mb: 2,
              display: 'block',
            }}
          >
            使用场景
          </Typography>
          <Typography 
            variant="h2" 
            sx={{ 
              fontWeight: 800, 
              mb: 2, 
              fontSize: { xs: '2rem', md: '2.5rem' },
              color: colorTokens.text.primary,
            }}
          >
            什么时候需要 Kiro Cleaner？
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: colorTokens.text.secondary,
              fontWeight: 400,
              maxWidth: '700px',
              mx: 'auto',
              lineHeight: 1.7,
            }}
          >
            Kiro Cleaner 适用的场景
          </Typography>
        </Box>

        {/* Use Cases Grid */}
        <Grid container spacing={4}>
          {useCases.map((useCase, index) => (
            <Grid size={{ xs: 12, md: 6 }} key={index}>
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  backgroundColor: colorTokens.background.subtle,
                  border: `1px solid ${colorTokens.border.default}`,
                  borderRadius: '4px',
                  boxShadow: 'none',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    borderColor: useCase.color,
                    '& .use-case-icon': {
                      transform: 'scale(1.1) rotate(5deg)',
                      color: useCase.color,
                    },
                    '& .use-case-bg': {
                      transform: 'scale(1.2)',
                      opacity: 0.15,
                    },
                  },
                }}
              >
                {/* Background decoration */}
                <Box
                  className="use-case-bg"
                  sx={{
                    position: 'absolute',
                    top: -50,
                    right: -50,
                    width: 200,
                    height: 200,
                    borderRadius: '50%',
                    backgroundColor: useCase.color,
                    opacity: 0.05,
                    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                />

                <CardContent sx={{ p: 4, position: 'relative', zIndex: 1 }}>
                  {/* Icon */}
                  <Box
                    className="use-case-icon"
                    sx={{
                      display: 'inline-flex',
                      p: 2,
                      borderRadius: '4px',
                      backgroundColor: `${useCase.color}15`,
                      color: useCase.color,
                      mb: 3,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  >
                    {useCase.icon}
                  </Box>

                  {/* Title */}
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      color: colorTokens.text.primary,
                      mb: 2,
                    }}
                  >
                    {useCase.title}
                  </Typography>

                  {/* Scenario */}
                  <Typography
                    variant="body2"
                    sx={{
                      color: colorTokens.text.secondary,
                      fontWeight: 600,
                      mb: 1.5,
                      fontSize: '0.875rem',
                    }}
                  >
                    📌 {useCase.scenario}
                  </Typography>

                  {/* Solution */}
                  <Typography
                    variant="body1"
                    sx={{
                      color: colorTokens.text.secondary,
                      lineHeight: 1.7,
                      mb: 2,
                    }}
                  >
                    {useCase.solution}
                  </Typography>

                  {/* Stats Badge */}
                  <Box
                    sx={{
                      display: 'inline-block',
                      px: 2,
                      py: 1,
                      borderRadius: '4px',
                      backgroundColor: `${useCase.color}10`,
                      border: `1px solid ${useCase.color}30`,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: useCase.color,
                        fontWeight: 700,
                        fontSize: '0.875rem',
                      }}
                    >
                      ✨ {useCase.stats}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default UseCases;
