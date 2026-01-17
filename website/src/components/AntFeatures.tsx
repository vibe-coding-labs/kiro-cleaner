import React from 'react';
import { Row, Col, Card, Typography } from 'antd';
import { ScanOutlined, SafetyOutlined, CloudSyncOutlined, FileTextOutlined } from '@ant-design/icons';
import './AntFeatures.css';

const { Title, Paragraph } = Typography;

const AntFeatures: React.FC = () => {
  const features = [
    {
      icon: <ScanOutlined />,
      title: '智能扫描',
      description: '自动发现 Kiro 数据存储位置，分析数据库、缓存和日志文件',
      color: '#1890ff',
    },
    {
      icon: <SafetyOutlined />,
      title: '安全清理',
      description: '基于规则的清理引擎，只删除缓存和临时文件',
      color: '#52c41a',
    },
    {
      icon: <CloudSyncOutlined />,
      title: '自动备份',
      description: '清理前自动创建备份，支持压缩',
      color: '#faad14',
    },
    {
      icon: <FileTextOutlined />,
      title: '详细报告',
      description: '显示清理前后的空间对比和文件统计',
      color: '#13c2c2',
    },
  ];

  return (
    <div style={{ padding: '80px 24px', maxWidth: 1200, margin: '0 auto' }}>
      <Row gutter={[24, 24]}>
        {features.map((feature, index) => (
          <Col xs={24} sm={12} key={index}>
            <Card 
              className="feature-card"
              variant="borderless"
              hoverable
            >
              <div className="feature-icon" style={{ backgroundColor: `${feature.color}15`, color: feature.color }}>
                {React.cloneElement(feature.icon, { style: { fontSize: 32 } })}
              </div>
              <Title level={4} style={{ marginTop: 20, marginBottom: 12 }}>
                {feature.title}
              </Title>
              <Paragraph style={{ color: 'rgba(0, 0, 0, 0.65)', marginBottom: 0 }}>
                {feature.description}
              </Paragraph>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default AntFeatures;
