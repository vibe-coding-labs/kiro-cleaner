import React from 'react';
import { Card, Typography, Row, Col } from 'antd';
import { DatabaseOutlined, ThunderboltOutlined, CodeOutlined, RiseOutlined } from '@ant-design/icons';
import './AntUseCases.css';

const { Title, Paragraph, Text } = Typography;

const AntUseCases: React.FC = () => {
  const useCases = [
    {
      icon: <ThunderboltOutlined />,
      title: 'IDE 运行缓慢',
      scenario: '当 Kiro IDE 响应变慢、卡顿严重',
      solution: '本地缓存过大是主要原因！清理冗余数据后，IDE 立即起飞，响应速度显著提升。',
      stats: '性能提升明显',
      color: '#52c41a',
    },
    {
      icon: <DatabaseOutlined />,
      title: '存储空间不足',
      scenario: '当你的磁盘空间告急',
      solution: 'Kiro Cleaner 可以清理对话历史、缓存和临时文件，释放大量存储空间。',
      stats: '释放存储空间',
      color: '#1890ff',
    },
    {
      icon: <CodeOutlined />,
      title: '项目切换频繁',
      scenario: '当你在多个项目间切换',
      solution: '定期清理可以避免项目数据混乱，保持 IDE 运行流畅。',
      stats: '支持批量清理',
      color: '#722ed1',
    },
    {
      icon: <RiseOutlined />,
      title: '长期使用维护',
      scenario: '当你长期使用 Kiro IDE',
      solution: '定期维护可以防止数据累积，避免性能下降。',
      stats: '建议定期清理',
      color: '#faad14',
    },
  ];

  return (
    <div className="ant-use-cases" id="use-cases">
      <div className="ant-use-cases-container">
        {/* Section Header */}
        <div className="ant-use-cases-header">
          <Text className="ant-use-cases-overline">使用场景</Text>
          <Title level={2} className="ant-use-cases-title">
            什么时候需要 Kiro Cleaner？
          </Title>
          <Paragraph className="ant-use-cases-subtitle">
            Kiro Cleaner 适用的场景
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
                  📌 {useCase.scenario}
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
                    ✨ {useCase.stats}
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
