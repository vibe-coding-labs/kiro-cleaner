import React from 'react';
import { Collapse, Typography, Card } from 'antd';
import type { CollapseProps } from 'antd';
import './AntFAQ.css';

const { Title, Paragraph, Text, Link } = Typography;

const AntFAQ: React.FC = () => {
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

  const items: CollapseProps['items'] = faqs.map((faq, index) => ({
    key: String(index + 1),
    label: <span className="ant-faq-question">{faq.question}</span>,
    children: <Paragraph className="ant-faq-answer">{faq.answer}</Paragraph>,
  }));

  return (
    <div className="ant-faq" id="faq">
      <div className="ant-faq-container">
        {/* Section Header */}
        <div className="ant-faq-header">
          <Text className="ant-faq-overline">常见问题</Text>
          <Title level={2} className="ant-faq-title">
            你可能想知道的
          </Title>
          <Paragraph className="ant-faq-subtitle">
            关于 Kiro Cleaner 的常见问题解答
          </Paragraph>
        </div>

        {/* FAQ Collapse */}
        <Collapse
          items={items}
          defaultActiveKey={['1']}
          className="ant-faq-collapse"
          bordered={false}
        />

        {/* Contact CTA */}
        <Card className="ant-faq-contact" bordered={true}>
          <Title level={5} className="ant-faq-contact-title">
            还有其他问题？
          </Title>
          <Paragraph className="ant-faq-contact-text">
            欢迎在 GitHub 上提出 Issue 或加入我们的社区讨论
          </Paragraph>
          <div className="ant-faq-contact-links">
            <Link
              href="https://github.com/vibe-coding-labs/kiro-cleaner/issues"
              target="_blank"
              className="ant-faq-contact-link"
            >
              📝 提交 Issue
            </Link>
            <Text className="ant-faq-contact-separator">·</Text>
            <Link
              href="https://github.com/vibe-coding-labs/kiro-cleaner/discussions"
              target="_blank"
              className="ant-faq-contact-link"
            >
              💬 加入讨论
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AntFAQ;
