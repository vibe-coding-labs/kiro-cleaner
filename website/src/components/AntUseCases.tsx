import React from 'react';
import { Card, Typography, Row, Col } from 'antd';
import { DatabaseOutlined, ThunderboltOutlined, CodeOutlined, RiseOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import './AntUseCases.css';

const { Title, Paragraph, Text } = Typography;

const AntUseCases: React.FC = () => {
  const { t } = useTranslation();

  const useCases = [
    {
      icon: <ThunderboltOutlined />,
      title: t('useCases.case1Title'),
      scenario: t('useCases.case1Scenario'),
      solution: t('useCases.case1Solution'),
      stats: t('useCases.case1Badge'),
      color: '#52c41a',
    },
    {
      icon: <DatabaseOutlined />,
      title: t('useCases.case2Title'),
      scenario: t('useCases.case2Scenario'),
      solution: t('useCases.case2Solution'),
      stats: t('useCases.case2Badge'),
      color: '#1890ff',
    },
    {
      icon: <CodeOutlined />,
      title: t('useCases.case3Title'),
      scenario: t('useCases.case3Scenario'),
      solution: t('useCases.case3Solution'),
      stats: t('useCases.case3Badge'),
      color: '#722ed1',
    },
    {
      icon: <RiseOutlined />,
      title: t('useCases.case4Title'),
      scenario: t('useCases.case4Scenario'),
      solution: t('useCases.case4Solution'),
      stats: t('useCases.case4Badge'),
      color: '#faad14',
    },
  ];

  return (
    <div className="ant-use-cases" id="use-cases">
      <div className="ant-use-cases-container">
        {/* Section Header */}
        <div className="ant-use-cases-header">
          <Text className="ant-use-cases-overline">{t('useCases.overline')}</Text>
          <Title level={2} className="ant-use-cases-title">
            {t('useCases.title')}
          </Title>
          <Paragraph className="ant-use-cases-subtitle">
            {t('useCases.subtitle')}
          </Paragraph>
        </div>

        {/* Use Cases Grid */}
        <Row gutter={[24, 24]}>
          {useCases.map((useCase, index) => (
            <Col xs={24} md={12} key={index}>
              <Card
                className="ant-use-cases-card"
                bordered={true}
                style={{
                  ['--card-color' as string]: useCase.color,
                }}
              >
                <div className="ant-use-cases-card-bg"></div>

                <div className="ant-use-cases-card-icon" style={{ color: useCase.color }}>
                  {useCase.icon}
                </div>

                <Title level={4} className="ant-use-cases-card-title">
                  {useCase.title}
                </Title>

                <Paragraph className="ant-use-cases-card-scenario">
                  {useCase.scenario}
                </Paragraph>

                <Paragraph className="ant-use-cases-card-solution">
                  {useCase.solution}
                </Paragraph>

                <div className="ant-use-cases-card-badge" style={{ 
                  backgroundColor: `${useCase.color}10`,
                  borderColor: `${useCase.color}30`,
                  color: useCase.color,
                }}>
                  <Text style={{ color: useCase.color, fontWeight: 700 }}>
                    {useCase.stats}
                  </Text>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default AntUseCases;
