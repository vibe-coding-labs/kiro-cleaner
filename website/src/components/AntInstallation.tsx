import React from 'react';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { useTranslation } from 'react-i18next';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './AntInstallation.css';

const AntInstallation: React.FC = () => {
  const { t } = useTranslation();

  const installationMethods = [
    {
      label: t('installation.tab1'),
      language: "bash",
      command: `${t('installation.buildComment1')}
git clone https://github.com/vibe-coding-labs/kiro-cleaner.git
cd kiro-cleaner

${t('installation.buildComment2')}
make build-local

${t('installation.buildComment3')}
sudo make install`
    },
    {
      label: t('installation.tab2'),
      language: "bash",
      command: `${t('installation.precompiledComment1')}
${t('installation.precompiledComment2')}

${t('installation.precompiledComment3')}
brew install kiro-cleaner`
    },
    {
      label: t('installation.tab3'),
      language: "bash",
      command: `${t('installation.usageComment1')}
./kiro-cleaner scan

${t('installation.usageComment2')}
./kiro-cleaner clean --dry-run

${t('installation.usageComment3')}
./kiro-cleaner clean --backup

${t('installation.usageComment4')}
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
