import React from 'react';
import { Layout, Typography, Button, Space, Row, Col } from 'antd';
import { DownloadOutlined, ArrowRightOutlined, ThunderboltOutlined, SafetyOutlined, CloudSyncOutlined } from '@ant-design/icons';
import './AntHeroSection.css';

const { Title, Paragraph, Text } = Typography;

const AntHeroSection: React.FC = () => {
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
                  🎉 开源免费 · 持续更新
                </Text>
              </div>

              {/* Main Headline */}
              <div>
                <Title level={1} style={{ fontSize: 56, fontWeight: 800, lineHeight: 1.2, marginBottom: 8 }}>
                  让 Kiro IDE
                </Title>
                <Title level={1} style={{ fontSize: 56, fontWeight: 800, lineHeight: 1.2, margin: 0, color: '#1890ff' }}>
                  轻装上阵
                </Title>
              </div>

              {/* Subtitle */}
              <Paragraph style={{ fontSize: 18, color: 'rgba(0, 0, 0, 0.65)', marginBottom: 24, lineHeight: 1.7 }}>
                Kiro IDE 缓存过大导致卡顿？一键清理，立即提速！
              </Paragraph>

              {/* Key Points */}
              <Space orientation="vertical" size="small">
                <Text style={{ fontSize: 16, color: 'rgba(0, 0, 0, 0.65)' }}>
                  ✓ <Text strong style={{ color: '#1890ff' }}>解决卡顿</Text>：清理冗余缓存，IDE 响应速度提升
                </Text>
                <Text style={{ fontSize: 16, color: 'rgba(0, 0, 0, 0.65)' }}>
                  ✓ <Text strong style={{ color: '#1890ff' }}>释放空间</Text>：清理对话历史、临时文件
                </Text>
                <Text style={{ fontSize: 16, color: 'rgba(0, 0, 0, 0.65)' }}>
                  ✓ <Text strong style={{ color: '#1890ff' }}>安全可靠</Text>：自动备份，随时恢复
                </Text>
              </Space>

              {/* Feature Tags */}
              <Space size="middle" wrap>
                <div className="feature-tag">
                  <ThunderboltOutlined style={{ fontSize: 16, marginRight: 6 }} />
                  快速扫描
                </div>
                <div className="feature-tag">
                  <SafetyOutlined style={{ fontSize: 16, marginRight: 6 }} />
                  安全可靠
                </div>
                <div className="feature-tag">
                  <CloudSyncOutlined style={{ fontSize: 16, marginRight: 6 }} />
                  自动备份
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
                  立即开始
                </Button>
                <Button 
                  size="large" 
                  icon={<ArrowRightOutlined />}
                  href="#features"
                  style={{ height: 48, fontSize: 16, fontWeight: 500, paddingLeft: 32, paddingRight: 32 }}
                >
                  了解更多
                </Button>
              </Space>
            </Space>
          </Col>

          {/* Right Content - Demo Video */}
          <Col xs={24} md={12}>
            <div className="video-container">
              <video
                autoPlay
                loop
                muted
                playsInline
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  borderRadius: 8,
                  backgroundColor: '#000',
                }}
                key={`${import.meta.env.BASE_URL}assets/demo-clean-command.mov`}
              >
                <source src={`${import.meta.env.BASE_URL}assets/demo-clean-command.mov`} type="video/mp4" />
                您的浏览器不支持视频播放
              </video>
            </div>
          </Col>
        </Row>
      </Layout.Content>
    </div>
  );
};

export default AntHeroSection;
