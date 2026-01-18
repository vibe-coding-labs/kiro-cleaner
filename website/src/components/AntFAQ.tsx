import React from 'react';
import { Collapse, Typography, Card } from 'antd';
import type { CollapseProps } from 'antd';
import { useTranslation } from 'react-i18next';
import './AntFAQ.css';

const { Title, Paragraph, Text, Link } = Typography;

const AntFAQ: React.FC = () => {
  const { t } = useTranslation();

  const faqs = [
    {
      question: t('faq.q1'),
      answer: t('faq.a1'),
    },
    {
      question: t('faq.q2'),
      answer: t('faq.a2'),
    },
    {
      question: t('faq.q3'),
      answer: t('faq.a3'),
    },
    {
      question: t('faq.q4'),
      answer: t('faq.a4'),
    },
    {
      question: t('faq.q5'),
      answer: t('faq.a5'),
    },
    {
      question: t('faq.q6'),
      answer: t('faq.a6'),
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
          <Text className="ant-faq-overline">{t('faq.overline')}</Text>
          <Title level={2} className="ant-faq-title">
            {t('faq.title')}
          </Title>
          <Paragraph className="ant-faq-subtitle">
            {t('faq.subtitle')}
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
            {t('faq.contactTitle')}
          </Title>
          <Paragraph className="ant-faq-contact-text">
            {t('faq.contactDesc')}
          </Paragraph>
          <div className="ant-faq-contact-links">
            <Link
              href="https://github.com/vibe-coding-labs/kiro-cleaner/issues"
              target="_blank"
              className="ant-faq-contact-link"
            >
              {t('faq.submitIssue')}
            </Link>
            <Text className="ant-faq-contact-separator">·</Text>
            <Link
              href="https://github.com/vibe-coding-labs/kiro-cleaner/discussions"
              target="_blank"
              className="ant-faq-contact-link"
            >
              {t('faq.joinDiscussion')}
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AntFAQ;
