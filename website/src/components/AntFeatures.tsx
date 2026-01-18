import React from 'react';
import { Row, Col, Card, Typography } from 'antd';
import { ScanOutlined, SafetyOutlined, CloudSyncOutlined, FileTextOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import './AntFeatures.css';

const { Title, Paragraph } = Typography;

const AntFeatures: React.FC = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: <ScanOutlined />,
      title: t('features.smartScan'),
      description: t('features.smartScanDesc'),
      color: '#1890ff',
    },
    {
      icon: <SafetyOutlined />,
      title: t('features.safeClean'),
      description: t('features.safeCleanDesc'),
      color: '#52c41a',
    },
    {
      icon: <CloudSyncOutlined />,
      title: t('features.autoBackup'),
      description: t('features.autoBackupDesc'),
      color: '#faad14',
    },
    {
      icon: <FileTextOutlined />,
      title: t('features.detailedReport'),
      description: t('features.detailedReportDesc'),
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
