import React from 'react';
import { Steps, Card, Typography } from 'antd';
import { SearchOutlined, FileSearchOutlined, DeleteOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './AntHowItWorks.css';

const { Title, Paragraph, Text } = Typography;

const AntHowItWorks: React.FC = () => {
  const steps = [
    {
      icon: <SearchOutlined />,
      title: '扫描',
      description: '检测 Kiro IDE 数据存储位置，分析数据库、缓存和日志文件',
      details: [
        '扫描对话历史数据库',
        '检测缓存文件',
        '分析临时文件',
        '识别可清理的数据'
      ],
    },
    {
      icon: <FileSearchOutlined />,
      title: '预览',
      description: '生成清理报告，显示哪些数据会被清理',
      details: [
        '显示可清理数据类型',
        '预估释放空间大小',
        '提供清理建议'
      ],
    },
    {
      icon: <DeleteOutlined />,
      title: '清理',
      description: '自动创建备份后执行清理',
      details: [
        '清理前自动备份',
        '支持压缩',
        '保留重要数据'
      ],
    },
    {
      icon: <CheckCircleOutlined />,
      title: '完成',
      description: '清理完成后生成对比报告',
      details: [
        '清理前后对比',
        '空间释放统计',
        '支持快速恢复'
      ],
    },
  ];

  return (
    <div className="ant-how-it-works">
      <div className="ant-how-it-works-container">
        {/* Section Header */}
        <div className="ant-how-it-works-header">
          <Text className="ant-how-it-works-overline">工作原理</Text>
          <Title level={2} className="ant-how-it-works-title">
            使用流程
          </Title>
          <Paragraph className="ant-how-it-works-subtitle">
            简单的清理流程
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
            💻 快速开始
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
{`# 扫描 Kiro 数据
./kiro-cleaner scan

# 预览清理操作（不会实际删除）
./kiro-cleaner clean --dry-run

# 执行清理（自动备份）
./kiro-cleaner clean --backup`}
          </SyntaxHighlighter>
        </Card>
      </div>
    </div>
  );
};

export default AntHowItWorks;
