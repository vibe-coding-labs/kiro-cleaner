/**
 * Technical Features Section
 * 
 * Highlights technical capabilities and architecture
 */

import React from 'react';
import { Box, Container, Typography, Grid, Paper } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { colorTokens } from '../theme/tokens';

const TechnicalFeatures: React.FC = () => {
  const features = [
    {
      category: '核心技术',
      items: [
        'Go 语言开发，高性能原生应用',
        'SQLite 数据库分析引擎',
        '智能规则匹配系统',
        '增量备份算法',
      ],
    },
    {
      category: '安全保障',
      items: [
        '只读模式扫描，不修改原始数据',
        '清理前自动创建完整备份',
        '支持备份压缩和加密',
        '详细的操作日志记录',
      ],
    },
    {
      category: '性能优化',
      items: [
        '并发扫描，充分利用多核CPU',
        '智能缓存，避免重复扫描',
        '增量分析，只处理变化部分',
        '内存优化，支持大型数据库',
      ],
    },
    {
      category: '跨平台支持',
      items: [
        'macOS (Intel & Apple Silicon)',
        'Linux (x86_64 & ARM64)',
        'Windows (x86_64)',
        '统一的命令行界面',
      ],
    },
  ];

  return (
    <Box 
      id="technical"
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
            技术特性
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
            强大的技术架构
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
            基于现代技术栈构建，确保性能、安全和可靠性
          </Typography>
        </Box>

        {/* Features Grid */}
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid size={{ xs: 12, md: 6 }} key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  height: '100%',
                  backgroundColor: colorTokens.background.paper,
                  border: `1px solid ${colorTokens.border.default}`,
                  borderRadius: '4px',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.08)',
                    borderColor: colorTokens.brand.primary,
                  },
                }}
              >
                {/* Category Title */}
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: colorTokens.text.primary,
                    mb: 3,
                    pb: 2,
                    borderBottom: `2px solid ${colorTokens.border.default}`,
                  }}
                >
                  {feature.category}
                </Typography>

                {/* Feature Items */}
                <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                  {feature.items.map((item, itemIndex) => (
                    <Box
                      component="li"
                      key={itemIndex}
                      sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        mb: 2,
                        '&:last-child': { mb: 0 },
                      }}
                    >
                      <CheckCircle
                        sx={{
                          color: colorTokens.semantic.success,
                          fontSize: 20,
                          mr: 1.5,
                          mt: 0.25,
                          flexShrink: 0,
                        }}
                      />
                      <Typography
                        variant="body1"
                        sx={{
                          color: colorTokens.text.secondary,
                          lineHeight: 1.6,
                        }}
                      >
                        {item}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Architecture Diagram Placeholder */}
        <Box
          sx={{
            mt: 8,
            p: 6,
            backgroundColor: colorTokens.background.paper,
            border: `2px dashed ${colorTokens.border.default}`,
            borderRadius: '4px',
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: colorTokens.text.secondary,
              fontWeight: 600,
              mb: 2,
            }}
          >
            🏗️ 系统架构
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: colorTokens.text.secondary,
              maxWidth: '600px',
              mx: 'auto',
            }}
          >
            采用模块化设计，扫描引擎、清理引擎、备份管理器相互独立，易于维护和扩展
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default TechnicalFeatures;
