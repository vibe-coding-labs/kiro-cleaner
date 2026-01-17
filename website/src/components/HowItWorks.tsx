/**
 * How It Works Section
 * 
 * Shows the step-by-step process of using Kiro Cleaner
 */

import React from 'react';
import { Box, Container, Typography, Grid, Paper } from '@mui/material';
import { Search, Assessment, CleaningServices, CheckCircle } from '@mui/icons-material';
import { colorTokens } from '../theme/tokens';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: <Search sx={{ fontSize: 48 }} />,
      number: '01',
      title: '智能扫描',
      description: '自动检测 Kiro IDE 数据存储位置，分析数据库、缓存、日志文件的使用情况',
      details: [
        '扫描对话历史数据库',
        '检测缓存文件大小',
        '分析临时文件占用',
        '识别可清理的冗余数据'
      ],
      color: colorTokens.brand.primary,
    },
    {
      icon: <Assessment sx={{ fontSize: 48 }} />,
      number: '02',
      title: '预览分析',
      description: '生成详细的清理报告，让你清楚了解哪些数据会被清理，预计释放多少空间',
      details: [
        '显示可清理数据类型',
        '预估释放空间大小',
        '标注数据重要程度',
        '提供清理建议'
      ],
      color: colorTokens.brand.secondary,
    },
    {
      icon: <CleaningServices sx={{ fontSize: 48 }} />,
      number: '03',
      title: '安全清理',
      description: '自动创建备份后执行清理，基于规则引擎确保不会误删重要数据',
      details: [
        '清理前自动备份',
        '支持压缩和加密',
        '智能规则匹配',
        '保留重要数据'
      ],
      color: colorTokens.semantic.success,
    },
    {
      icon: <CheckCircle sx={{ fontSize: 48 }} />,
      number: '04',
      title: '完成验证',
      description: '清理完成后生成对比报告，展示清理效果，支持一键恢复',
      details: [
        '清理前后对比',
        '空间释放统计',
        '性能提升报告',
        '支持快速恢复'
      ],
      color: colorTokens.brand.accent,
    },
  ];

  return (
    <Box 
      id="how-it-works"
      sx={{ 
        py: { xs: 10, md: 15 }, 
        backgroundColor: colorTokens.background.paper,
        position: 'relative',
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
            工作原理
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
            四步完成数据清理
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
            简单、安全、高效的清理流程，让你放心使用
          </Typography>
        </Box>

        {/* Steps Grid */}
        <Grid container spacing={4}>
          {steps.map((step, index) => (
            <Grid size={{ xs: 12, md: 6 }} key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  height: '100%',
                  backgroundColor: colorTokens.background.subtle,
                  border: `1px solid ${colorTokens.border.default}`,
                  borderRadius: '4px',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  // CSS containment for performance (Requirements 7.4)
                  contain: 'layout style paint',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: `0 20px 40px ${step.color}20`,
                    borderColor: step.color,
                    // will-change on hover (Requirements 7.4)
                    willChange: 'transform, box-shadow',
                    '& .step-number': {
                      transform: 'scale(1.1)',
                      color: step.color,
                    },
                    '& .step-icon': {
                      transform: 'scale(1.1) rotate(5deg)',
                      color: step.color,
                    },
                  },
                }}
              >
                {/* Step Number */}
                <Typography
                  className="step-number"
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    fontSize: '4rem',
                    fontWeight: 800,
                    color: `${step.color}15`,
                    lineHeight: 1,
                    transition: 'all 0.3s ease',
                    // will-change for step number animation (Requirements 7.4)
                    willChange: 'transform, color',
                  }}
                >
                  {step.number}
                </Typography>

                {/* Icon */}
                <Box
                  className="step-icon"
                  sx={{
                    display: 'inline-flex',
                    p: 2,
                    borderRadius: '4px',
                    backgroundColor: `${step.color}15`,
                    color: step.color,
                    mb: 3,
                    transition: 'all 0.3s ease',
                    // will-change for icon animation (Requirements 7.4)
                    willChange: 'transform, color',
                  }}
                >
                  {step.icon}
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
                  {step.title}
                </Typography>

                {/* Description */}
                <Typography
                  variant="body1"
                  sx={{
                    color: colorTokens.text.secondary,
                    lineHeight: 1.7,
                    mb: 3,
                  }}
                >
                  {step.description}
                </Typography>

                {/* Details List */}
                <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                  {step.details.map((detail, detailIndex) => (
                    <Box
                      component="li"
                      key={detailIndex}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 1,
                        '&:last-child': { mb: 0 },
                      }}
                    >
                      <Box
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          backgroundColor: step.color,
                          mr: 1.5,
                          flexShrink: 0,
                        }}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          color: colorTokens.text.secondary,
                          fontSize: '0.875rem',
                        }}
                      >
                        {detail}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Command Example */}
        <Box
          sx={{
            mt: 8,
            p: 4,
            backgroundColor: colorTokens.neutral[900],
            borderRadius: '4px',
            border: `1px solid ${colorTokens.neutral[800]}`,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: colorTokens.text.inverse,
              fontWeight: 600,
              mb: 2,
            }}
          >
            💻 快速开始
          </Typography>
          <Box
            component="pre"
            sx={{
              color: colorTokens.neutral[100],
              fontFamily: "'Fira Code', 'SF Mono', 'Consolas', 'Monaco', monospace",
              fontSize: '14px',
              m: 0,
              lineHeight: 1.8,
              overflowX: 'auto',
            }}
          >
{`# 扫描 Kiro 数据
./kiro-cleaner scan

# 预览清理操作（不会实际删除）
./kiro-cleaner clean --dry-run

# 执行清理（自动备份）
./kiro-cleaner clean --backup`}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default HowItWorks;
