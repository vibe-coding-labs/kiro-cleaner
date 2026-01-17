import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AntHowItWorks from './AntHowItWorks';

describe('AntHowItWorks', () => {
  it('renders the section header', () => {
    render(<AntHowItWorks />);
    expect(screen.getByText('工作原理')).toBeInTheDocument();
    expect(screen.getByText('使用流程')).toBeInTheDocument();
    expect(screen.getByText('简单的清理流程')).toBeInTheDocument();
  });

  it('renders all four steps', () => {
    render(<AntHowItWorks />);
    expect(screen.getAllByText('扫描').length).toBeGreaterThan(0);
    expect(screen.getAllByText('预览').length).toBeGreaterThan(0);
    expect(screen.getAllByText('清理').length).toBeGreaterThan(0);
    expect(screen.getAllByText('完成').length).toBeGreaterThan(0);
  });

  it('renders step descriptions', () => {
    render(<AntHowItWorks />);
    expect(screen.getByText(/检测 Kiro IDE 数据存储位置/)).toBeInTheDocument();
    expect(screen.getByText(/生成清理报告/)).toBeInTheDocument();
    expect(screen.getByText(/自动创建备份后执行清理/)).toBeInTheDocument();
    expect(screen.getByText(/清理完成后生成对比报告/)).toBeInTheDocument();
  });

  it('renders command example section', () => {
    render(<AntHowItWorks />);
    expect(screen.getByText('💻 快速开始')).toBeInTheDocument();
    expect(screen.getByText(/kiro-cleaner scan/)).toBeInTheDocument();
  });

  it('renders step details', () => {
    render(<AntHowItWorks />);
    expect(screen.getByText('扫描对话历史数据库')).toBeInTheDocument();
    expect(screen.getByText('显示可清理数据类型')).toBeInTheDocument();
    expect(screen.getByText('清理前自动备份')).toBeInTheDocument();
    expect(screen.getByText('空间释放统计')).toBeInTheDocument();
  });
});
