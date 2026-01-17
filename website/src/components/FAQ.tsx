/**
 * FAQ Section
 * 
 * Frequently Asked Questions with expandable answers
 */

import React, { useState } from 'react';
import { Box, Container, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { colorTokens } from '../theme/tokens';

const FAQ: React.FC = () => {
  const [expanded, setExpanded] = useState<string | false>('panel1');

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const faqs = [
    {
      question: 'Kiro Cleaner 会删除我的重要数据吗？',
      answer: '不会。Kiro Cleaner 采用智能规则引擎，只清理缓存、临时文件和旧的对话历史等冗余数据。在清理前会自动创建完整备份，确保数据安全。你可以随时恢复被清理的数据。',
    },
    {
      question: '清理后 Kiro IDE 还能正常工作吗？',
      answer: '完全可以。Kiro Cleaner 只清理不影响 IDE 正常运行的冗余数据。清理后，IDE 会自动重建必要的缓存和索引，不会影响任何功能。实际上，清理后 IDE 的性能通常会有所提升。',
    },
    {
      question: '多久清理一次比较合适？',
      answer: '建议每月清理一次，或者当你发现磁盘空间不足、IDE 运行缓慢时进行清理。Kiro Cleaner 的扫描功能可以帮你评估当前的数据使用情况，决定是否需要清理。',
    },
    {
      question: '清理能释放多少存储空间？',
      answer: '这取决于你的使用情况。一般来说，长期使用的 Kiro IDE 可以释放 2-5GB 的空间。如果你有大量的对话历史和缓存文件，释放的空间可能更多。使用扫描功能可以预览清理效果。',
    },
    {
      question: '支持哪些操作系统？',
      answer: 'Kiro Cleaner 支持 macOS (Intel 和 Apple Silicon)、Linux (x86_64 和 ARM64) 以及 Windows (x86_64)。我们提供预编译的二进制文件，也支持从源码构建。',
    },
    {
      question: '如何恢复被清理的数据？',
      answer: 'Kiro Cleaner 在清理前会自动创建备份。你可以使用 restore 命令恢复最近的备份。备份文件默认保存在 ~/.kiro-cleaner/backups 目录，支持压缩和加密。',
    },
    {
      question: '是否需要停止 Kiro IDE 才能清理？',
      answer: '建议在清理前关闭 Kiro IDE，以确保所有数据都已保存。Kiro Cleaner 会检测 IDE 是否正在运行，如果检测到运行中的实例，会提示你先关闭 IDE。',
    },
    {
      question: '清理过程需要多长时间？',
      answer: '扫描通常只需要几秒钟，清理过程取决于数据量，一般在 1-5 分钟内完成。大型数据库可能需要更长时间。你可以使用 --verbose 选项查看详细的进度信息。',
    },
  ];

  return (
    <Box 
      id="faq"
      sx={{ 
        py: { xs: 10, md: 15 }, 
        backgroundColor: colorTokens.background.paper,
      }}
    >
      <Container maxWidth="md">
        {/* Section Header */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
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
            常见问题
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
            你可能想知道的
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: colorTokens.text.secondary,
              fontWeight: 400,
              lineHeight: 1.7,
            }}
          >
            关于 Kiro Cleaner 的常见问题解答
          </Typography>
        </Box>

        {/* FAQ Accordions */}
        <Box>
          {faqs.map((faq, index) => (
            <Accordion
              key={index}
              expanded={expanded === `panel${index + 1}`}
              onChange={handleChange(`panel${index + 1}`)}
              elevation={0}
              sx={{
                mb: 2,
                backgroundColor: colorTokens.background.subtle,
                border: `1px solid ${colorTokens.border.default}`,
                borderRadius: '12px !important',
                '&:before': {
                  display: 'none',
                },
                '&.Mui-expanded': {
                  margin: '0 0 16px 0',
                  borderColor: colorTokens.brand.primary,
                  boxShadow: `0 4px 12px ${colorTokens.brand.primary}20`,
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMore sx={{ color: colorTokens.brand.primary }} />}
                sx={{
                  px: 3,
                  py: 2,
                  minHeight: 44, // Touch target size (Requirements 7.3)
                  '& .MuiAccordionSummary-content': {
                    my: 1,
                  },
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: colorTokens.text.primary,
                    fontSize: { xs: '1rem', md: '1.125rem' },
                  }}
                >
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails
                sx={{
                  px: 3,
                  pb: 3,
                  pt: 0,
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    color: colorTokens.text.secondary,
                    lineHeight: 1.8,
                  }}
                >
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>

        {/* Contact CTA */}
        <Box
          sx={{
            mt: 8,
            p: 4,
            backgroundColor: colorTokens.brand.primarySubtle,
            border: `1px solid ${colorTokens.brand.primary}30`,
            borderRadius: '4px',
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: colorTokens.text.primary,
              mb: 1,
            }}
          >
            还有其他问题？
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: colorTokens.text.secondary,
              mb: 2,
            }}
          >
            欢迎在 GitHub 上提出 Issue 或加入我们的社区讨论
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Typography
              component="a"
              href="https://github.com/vibe-coding-labs/kiro-cleaner/issues"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: colorTokens.brand.primary,
                fontWeight: 600,
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              📝 提交 Issue
            </Typography>
            <Typography sx={{ color: colorTokens.text.secondary }}>·</Typography>
            <Typography
              component="a"
              href="https://github.com/vibe-coding-labs/kiro-cleaner/discussions"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: colorTokens.brand.primary,
                fontWeight: 600,
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              💬 加入讨论
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default FAQ;
