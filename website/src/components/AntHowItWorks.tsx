import React from 'react';
import { Steps, Card, Typography } from 'antd';
import { SearchOutlined, FileSearchOutlined, DeleteOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTranslation } from 'react-i18next';
import './AntHowItWorks.css';

const { Title, Paragraph, Text } = Typography;

const AntHowItWorks: React.FC = () => {
  const { t } = useTranslation();

  const steps = [
    {
      icon: <SearchOutlined />,
      title: t('howItWorks.step1Title'),
      description: t('howItWorks.step1Desc'),
      details: [
        t('howItWorks.step1Item1'),
        t('howItWorks.step1Item2'),
        t('howItWorks.step1Item3'),
        t('howItWorks.step1Item4')
      ],
    },
    {
      icon: <FileSearchOutlined />,
      title: t('howItWorks.step2Title'),
      description: t('howItWorks.step2Desc'),
      details: [
        t('howItWorks.step2Item1'),
        t('howItWorks.step2Item2'),
        t('howItWorks.step2Item3')
      ],
    },
    {
      icon: <DeleteOutlined />,
      title: t('howItWorks.step3Title'),
      description: t('howItWorks.step3Desc'),
      details: [
        t('howItWorks.step3Item1'),
        t('howItWorks.step3Item2'),
        t('howItWorks.step3Item3')
      ],
    },
    {
      icon: <CheckCircleOutlined />,
      title: t('howItWorks.step4Title'),
      description: t('howItWorks.step4Desc'),
      details: [
        t('howItWorks.step4Item1'),
        t('howItWorks.step4Item2'),
        t('howItWorks.step4Item3')
      ],
    },
  ];

  return (
    <div className="ant-how-it-works">
      <div className="ant-how-it-works-container">
        {/* Section Header */}
        <div className="ant-how-it-works-header">
          <Text className="ant-how-it-works-overline">{t('howItWorks.overline')}</Text>
          <Title level={2} className="ant-how-it-works-title">
            {t('howItWorks.title')}
          </Title>
          <Paragraph className="ant-how-it-works-subtitle">
            {t('howItWorks.subtitle')}
          </Paragraph>
        </div>

        {/* Steps */}
        <div className="ant-how-it-works-steps">
          <Steps
            direction="horizontal"
            responsive={false}
            items={steps.map((step, index) => ({
              title: step.title,
              icon: step.icon,
              status: 'process',
            }))}
          />
        </div>

        {/* Step Details Cards */}
        <div className="ant-how-it-works-cards">
          {steps.map((step, index) => (
            <Card
              key={index}
              className="ant-how-it-works-card"
              bordered={true}
            >
              <div className="ant-how-it-works-card-number">
                {String(index + 1).padStart(2, '0')}
              </div>
              
              <div className="ant-how-it-works-card-icon">
                {step.icon}
              </div>

              <Title level={4} className="ant-how-it-works-card-title">
                {step.title}
              </Title>

              <Paragraph className="ant-how-it-works-card-description">
                {step.description}
              </Paragraph>

              <ul className="ant-how-it-works-card-details">
                {step.details.map((detail, detailIndex) => (
                  <li key={detailIndex}>
                    <span className="ant-how-it-works-card-bullet"></span>
                    <Text>{detail}</Text>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>

        {/* Command Example */}
        <Card className="ant-how-it-works-command" bordered={true}>
          <Title level={5} className="ant-how-it-works-command-title">
            {t('howItWorks.quickStartTitle')}
          </Title>
          <SyntaxHighlighter
            language="bash"
            style={vscDarkPlus}
            customStyle={{
              margin: 0,
              padding: '20px',
              borderRadius: '4px',
              fontSize: '14px',
              lineHeight: '1.8',
              backgroundColor: '#1f1f1f',
            }}
            codeTagProps={{
              style: {
                fontFamily: "'Fira Code', 'SF Mono', 'Consolas', 'Monaco', monospace",
              }
            }}
          >
{`${t('howItWorks.quickStartComment1')}
./kiro-cleaner scan

${t('howItWorks.quickStartComment2')}
./kiro-cleaner clean --dry-run

${t('howItWorks.quickStartComment3')}
./kiro-cleaner clean --backup`}
          </SyntaxHighlighter>
        </Card>
      </div>
    </div>
  );
};

export default AntHowItWorks;
