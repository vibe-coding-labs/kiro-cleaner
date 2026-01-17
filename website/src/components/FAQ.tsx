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
      question: 'Kiro IDE 变卡了，清理真的有用吗？',
      answer: '非常有用！当本地缓存过大时，Kiro IDE 会明显变慢、卡顿。使用 Kiro Cleaner 清理冗余数据后，IDE 响应速度会显著提升，立即起飞！',
    },
    {
      question: 'Kiro Cleaner 会删除我的重要数据吗？',
      answer: '不会。Kiro Cleaner 只清理缓存、临时文件和旧的对话历史等冗余数据。清理前会自动创建备份，你可以随时恢复。',
    },
    {
      question: '清理后 Kiro IDE 还能正常工作吗？',
      answer: '可以。Kiro Cleaner 只清理不影响 IDE 正常运行的冗余数据。清理后，IDE 会自动重建必要的缓存和索引。',
    },
    {
      question: '多久清理一次比较合适？',
      answer: '建议根据实际使用情况定期清理。如果发现 IDE 变慢或磁盘空间不足时，就该清理了。',
    },
    {
      question: '支持哪些操作系统？',
      answer: 'Kiro Cleaner 支持 macOS (Intel 和 Apple Silicon)、Linux (x86_64 和 ARM64) 以及 Windows (x86_64)。',
    },
    {
      question: '如何恢复被清理的数据？',
      answer: 'Kiro Cleaner 在清理前会自动创建备份。你可以使用 restore 命令恢复最近的备份。',
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
                boxShadow: 'none',
                '&:before': {
                  display: 'none',
                },
                '&.Mui-expanded': {
                  margin: '0 0 16px 0',
                  borderColor: colorTokens.brand.primary,
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
