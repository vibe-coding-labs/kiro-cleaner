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
      title: '扫描',
      description: '检测 Kiro IDE 数据存储位置，分析数据库、缓存和日志文件',
      details: [
        '扫描对话历史数据库',
        '检测缓存文件',
        '分析临时文件',
        '识别可清理的数据'
      ],
      color: colorTokens.brand.primary,
    },
    {
      icon: <Assessment sx={{ fontSize: 48 }} />,
      number: '02',
      title: '预览',
      description: '生成清理报告，显示哪些数据会被清理',
      details: [
        '显示可清理数据类型',
        '预估释放空间大小',
        '提供清理建议'
      ],
      color: colorTokens.brand.secondary,
    },
    {
      icon: <CleaningServices sx={{ fontSize: 48 }} />,
      number: '03',
      title: '清理',
      description: '自动创建备份后执行清理',
      details: [
        '清理前自动备份',
        '支持压缩',
        '保留重要数据'
      ],
      color: colorTokens.semantic.success,
    },
    {
      icon: <CheckCircle sx={{ fontSize: 48 }} />,
      number: '04',
      title: '完成',
      description: '清理完成后生成对比报告',
      details: [
        '清理前后对比',
        '空间释放统计',
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
            使用流程
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
            简单的清理流程
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
                  boxShadow: 'none',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  // CSS containment for performance
                  contain: 'layout style paint',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    borderColor: step.color,
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
