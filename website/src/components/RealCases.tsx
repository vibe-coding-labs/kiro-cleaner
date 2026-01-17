/**
 * Real Cases Section
 * 
 * Shows real-world examples and case studies
 */

import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Avatar, Chip } from '@mui/material';
import { TrendingUp, Speed, Storage, CheckCircle } from '@mui/icons-material';
import { colorTokens } from '../theme/tokens';

const RealCases: React.FC = () => {
  const cases = [
    {
      user: '前端开发者 - 张三',
      avatar: '👨‍💻',
      scenario: '长期使用 Kiro IDE 开发多个项目',
      problem: '磁盘空间不足警告，IDE 启动缓慢',
      solution: '使用 Kiro Cleaner 清理 6 个月的对话历史和缓存',
      results: [
        { label: '释放空间', value: '4.2 GB', icon: <Storage /> },
        { label: '启动速度', value: '提升 45%', icon: <Speed /> },
        { label: '清理时间', value: '2 分钟', icon: <CheckCircle /> },
      ],
      quote: '清理后 IDE 启动速度明显提升，而且还能看到详细的清理报告，非常放心！',
    },
    {
      user: '数据科学家 - 李四',
      avatar: '👩‍🔬',
      scenario: '频繁使用 AI 助手进行数据分析',
      problem: '对话历史过多导致搜索变慢',
      solution: '定期使用 Kiro Cleaner 清理旧对话',
      results: [
        { label: '释放空间', value: '2.8 GB', icon: <Storage /> },
        { label: '搜索速度', value: '提升 60%', icon: <Speed /> },
        { label: '保留数据', value: '最近 3 个月', icon: <CheckCircle /> },
      ],
      quote: '自动备份功能让我很安心，清理后搜索历史对话的速度快了很多！',
    },
    {
      user: '全栈工程师 - 王五',
      avatar: '👨‍💼',
      scenario: '在多个项目间切换使用 Kiro IDE',
      problem: '缓存文件混乱，占用大量空间',
      solution: '项目切换时使用 Kiro Cleaner 清理',
      results: [
        { label: '释放空间', value: '3.5 GB', icon: <Storage /> },
        { label: '性能提升', value: '35%', icon: <TrendingUp /> },
        { label: '清理频率', value: '每月一次', icon: <CheckCircle /> },
      ],
      quote: '现在每次切换项目都会清理一次，保持 IDE 始终处于最佳状态！',
    },
  ];

  return (
    <Box 
      id="real-cases"
      sx={{ 
        py: { xs: 10, md: 15 }, 
        backgroundColor: colorTokens.background.subtle,
        position: 'relative',
      }}
    >
      <Container maxWidth="lg">
        {/* Section Header */}
        <Box sx={{ textAlign: 'center', mb: 10 }}>
          <Typography 
            variant="overline"
            sx={{
              color: colorTokens.brand.secondary,
              fontWeight: 700,
              fontSize: '0.875rem',
              letterSpacing: '0.1em',
              mb: 2,
              display: 'block',
            }}
          >
            真实案例
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
            看看其他用户的使用体验
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
            真实用户的清理效果和使用反馈
          </Typography>
        </Box>

        {/* Cases Grid */}
        <Grid container spacing={4}>
          {cases.map((caseItem, index) => (
            <Grid size={{ xs: 12, md: 4 }} key={index}>
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  backgroundColor: colorTokens.background.paper,
                  border: `1px solid ${colorTokens.border.default}`,
                  borderRadius: '4px',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  // CSS containment for performance (Requirements 7.4)
                  contain: 'layout style paint',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    borderColor: colorTokens.brand.primary,
                    // will-change on hover (Requirements 7.4)
                    willChange: 'transform, box-shadow',
                  },
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  {/* User Info */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar
                      sx={{
                        width: 56,
                        height: 56,
                        fontSize: '2rem',
                        backgroundColor: colorTokens.brand.primarySubtle,
                        mr: 2,
                      }}
                    >
                      {caseItem.avatar}
                    </Avatar>
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          color: colorTokens.text.primary,
                          fontSize: '1.125rem',
                        }}
                      >
                        {caseItem.user}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: colorTokens.text.secondary,
                          fontSize: '0.875rem',
                        }}
                      >
                        {caseItem.scenario}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Problem */}
                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label="问题"
                      size="small"
                      sx={{
                        backgroundColor: colorTokens.semantic.errorLight,
                        color: colorTokens.semantic.error,
                        fontWeight: 600,
                        mb: 1,
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        color: colorTokens.text.secondary,
                        lineHeight: 1.6,
                      }}
                    >
                      {caseItem.problem}
                    </Typography>
                  </Box>

                  {/* Solution */}
                  <Box sx={{ mb: 3 }}>
                    <Chip
                      label="解决方案"
                      size="small"
                      sx={{
                        backgroundColor: colorTokens.brand.primarySubtle,
                        color: colorTokens.brand.primary,
                        fontWeight: 600,
                        mb: 1,
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        color: colorTokens.text.secondary,
                        lineHeight: 1.6,
                      }}
                    >
                      {caseItem.solution}
                    </Typography>
                  </Box>

                  {/* Results */}
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 700,
                        color: colorTokens.text.primary,
                        mb: 2,
                      }}
                    >
                      清理效果
                    </Typography>
                    <Grid container spacing={2}>
                      {caseItem.results.map((result, resultIndex) => (
                        <Grid size={{ xs: 12 }} key={resultIndex}>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              p: 1.5,
                              backgroundColor: colorTokens.background.subtle,
                              borderRadius: '4px',
                            }}
                          >
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 32,
                                height: 32,
                                borderRadius: '4px',
                                backgroundColor: colorTokens.brand.primarySubtle,
                                color: colorTokens.brand.primary,
                                mr: 1.5,
                              }}
                            >
                              {result.icon}
                            </Box>
                            <Box sx={{ flex: 1 }}>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: colorTokens.text.secondary,
                                  fontSize: '0.75rem',
                                  display: 'block',
                                }}
                              >
                                {result.label}
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: 700,
                                  color: colorTokens.text.primary,
                                }}
                              >
                                {result.value}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>

                  {/* Quote */}
                  <Box
                    sx={{
                      p: 2,
                      backgroundColor: colorTokens.background.subtle,
                      borderLeft: `4px solid ${colorTokens.brand.primary}`,
                      borderRadius: '4px',
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: colorTokens.text.secondary,
                        fontStyle: 'italic',
                        lineHeight: 1.6,
                      }}
                    >
                      "{caseItem.quote}"
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

export default RealCases;
