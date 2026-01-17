import React from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import { colorTokens } from '../theme/tokens';
import GlassCard from './premium/GlassCard';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 4 }}>
          {/* Use GlassCard to wrap code block (Requirements 3.3) */}
          <GlassCard
            variant="dark"
            hover={false}
            sx={{
              background: colorTokens.neutral[900],
              border: `1px solid ${colorTokens.neutral[800]}`,
            }}
          >
            <pre style={{ 
              color: colorTokens.neutral[100], 
              fontFamily: "'Fira Code', 'SF Mono', 'Consolas', 'Monaco', monospace",
              fontSize: '14px',
              margin: 0,
              lineHeight: 1.8,
              overflowX: 'auto',
            }}>
              {children}
            </pre>
          </GlassCard>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const Installation: React.FC = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const installationMethods = [
    {
      label: "从源码构建",
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
      command: `# 从 Releases 页面下载适合您操作系统的预编译二进制文件
# https://github.com/vibe-coding-labs/kiro-cleaner/releases

# 或者使用 Homebrew (如果可用)
brew install kiro-cleaner`
    },
    {
      label: "使用方法",
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

  return (
    <GlassCard
      variant="light"
      hover={false}
      sx={{ 
        borderRadius: '4px', 
        overflow: 'hidden',
        padding: 0,
      }}
    >
      <Box sx={{ borderBottom: `1px solid ${colorTokens.border.default}`, backgroundColor: colorTokens.background.subtle }}>
        <Tabs 
          value={value} 
          onChange={handleChange} 
          aria-label="安装方法标签"
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: colorTokens.brand.primary,
              height: '3px',
              borderRadius: '3px 3px 0 0',
            },
          }}
        >
          {installationMethods.map((method, index) => (
            <Tab 
              key={index} 
              label={method.label} 
              {...a11yProps(index)} 
              sx={{ 
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1rem',
                py: 2,
                minHeight: 44, // Touch target size (Requirements 7.3)
                transition: 'all 0.2s ease',
                // Hover effects (Requirements 3.3)
                '&:hover': {
                  backgroundColor: 'rgba(0, 112, 243, 0.05)',
                },
                '&.Mui-selected': {
                  color: colorTokens.brand.primary,
                },
              }}
            />
          ))}
        </Tabs>
      </Box>
      
      {installationMethods.map((method, index) => (
        <CustomTabPanel key={index} value={value} index={index}>
          {method.command}
        </CustomTabPanel>
      ))}
    </GlassCard>
  );
};

export default Installation;
