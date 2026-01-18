import React from 'react';
import { Layout, Typography, Button, Space, Row, Col } from 'antd';
import { DownloadOutlined, ArrowRightOutlined, ThunderboltOutlined, SafetyOutlined, CloudSyncOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import './AntHeroSection.css';

const { Title, Paragraph, Text } = Typography;

const AntHeroSection: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="hero-section">
      <Layout.Content style={{ padding: '80px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <Row gutter={[48, 48]} align="middle">
          {/* Left Content */}
          <Col xs={24} md={12}>
            <Space orientation="vertical" size="large" style={{ width: '100%' }}>
              {/* Badge */}
              <div className="hero-badge">
                <Text style={{ fontSize: 14, fontWeight: 500 }}>
                  {t('hero.badge')}
                </Text>
              </div>

              {/* Main Headline */}
              <div>
                <Title level={1} style={{ fontSize: 56, fontWeight: 800, lineHeight: 1.2, marginBottom: 8 }}>
                  {t('hero.title1')}
                </Title>
                <Title level={1} style={{ fontSize: 56, fontWeight: 800, lineHeight: 1.2, margin: 0, color: '#1890ff' }}>
                  {t('hero.title2')}
                </Title>
              </div>

              {/* Subtitle */}
              <Paragraph style={{ fontSize: 18, color: 'rgba(0, 0, 0, 0.65)', marginBottom: 24, lineHeight: 1.7 }}>
                {t('hero.subtitle')}
              </Paragraph>

              {/* Key Points */}
              <Space orientation="vertical" size="small">
                <Text style={{ fontSize: 16, color: 'rgba(0, 0, 0, 0.65)' }}>
                  ✓ <Text strong style={{ color: '#1890ff' }}>{t('hero.benefit1')}</Text>：{t('hero.benefit1Desc')}
                </Text>
                <Text style={{ fontSize: 16, color: 'rgba(0, 0, 0, 0.65)' }}>
                  ✓ <Text strong style={{ color: '#1890ff' }}>{t('hero.benefit2')}</Text>：{t('hero.benefit2Desc')}
                </Text>
                <Text style={{ fontSize: 16, color: 'rgba(0, 0, 0, 0.65)' }}>
                  ✓ <Text strong style={{ color: '#1890ff' }}>{t('hero.benefit3')}</Text>：{t('hero.benefit3Desc')}
                </Text>
              </Space>

              {/* Feature Tags */}
              <Space size="middle" wrap>
                <div className="feature-tag">
                  <ThunderboltOutlined style={{ fontSize: 16, marginRight: 6 }} />
                  {t('hero.featureTag1')}
                </div>
                <div className="feature-tag">
                  <SafetyOutlined style={{ fontSize: 16, marginRight: 6 }} />
                  {t('hero.featureTag2')}
                </div>
                <div className="feature-tag">
                  <CloudSyncOutlined style={{ fontSize: 16, marginRight: 6 }} />
                  {t('hero.featureTag3')}
                </div>
              </Space>

              {/* CTA Buttons */}
              <Space size="middle">
                <Button 
                  type="primary" 
                  size="large" 
                  icon={<DownloadOutlined />}
                  href="#installation"
                  style={{ height: 48, fontSize: 16, fontWeight: 500, paddingLeft: 32, paddingRight: 32 }}
                >
                  {t('hero.ctaStart')}
                </Button>
                <Button 
                  size="large" 
                  icon={<ArrowRightOutlined />}
                  href="#features"
                  style={{ height: 48, fontSize: 16, fontWeight: 500, paddingLeft: 32, paddingRight: 32 }}
                >
                  {t('hero.ctaLearnMore')}
                </Button>
              </Space>
            </Space>
          </Col>

          {/* Right Content - Demo Video */}
          <Col xs={24} md={12}>
            <div className="video-container">
              <img
                src={`${import.meta.env.BASE_URL}assets/demo-clean-command-3x.gif`}
                alt={t('hero.demoAlt')}
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  borderRadius: 8,
                  backgroundColor: '#000',
                }}
              />
            </div>
          </Col>
        </Row>
      </Layout.Content>
    </div>
  );
};

export default AntHeroSection;
