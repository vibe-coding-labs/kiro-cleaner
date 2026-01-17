import React from 'react';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './AntInstallation.css';

const AntInstallation: React.FC = () => {
  const installationMethods = [
    {
      label: "从源码构建",
      language: "bash",
      command: `# 克隆仓库
git clone https://github.com/vibe-coding-labs/kiro-cleaner.git
cd kiro-cleaner

# 构建
make build-local

# 安装到系统（可选）
sudo make install`
    },
    {
      label: "使用预编译版本",
      language: "bash",
      command: `# 从 Releases 页面下载适合您操作系统的预编译二进制文件
# https://github.com/vibe-coding-labs/kiro-cleaner/releases

# 或者使用 Homebrew (如果可用)
brew install kiro-cleaner`
    },
    {
      label: "使用方法",
      language: "bash",
      command: `# 扫描 Kiro 数据存储
./kiro-cleaner scan

# 预览清理操作
./kiro-cleaner clean --dry-run

# 执行清理（带备份）
./kiro-cleaner clean --backup

# 管理备份
./kiro-cleaner backup list
./kiro-cleaner backup restore <backup-id>`
    }
  ];

  const items: TabsProps['items'] = installationMethods.map((method, index) => ({
    key: String(index + 1),
    label: method.label,
    children: (
      <div className="ant-installation-code-wrapper">
        <SyntaxHighlighter
          language={method.language}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: '20px',
            borderRadius: 0,
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
          {method.command}
        </SyntaxHighlighter>
      </div>
    ),
  }));

  return (
    <div className="ant-installation">
      <Tabs
        defaultActiveKey="1"
        items={items}
        className="ant-installation-tabs"
      />
    </div>
  );
};

export default AntInstallation;
