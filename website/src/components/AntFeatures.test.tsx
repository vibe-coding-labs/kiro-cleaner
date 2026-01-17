import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AntFeatures from './AntFeatures';

describe('AntFeatures Component', () => {
  it('should render all feature cards', () => {
    const { container } = render(<AntFeatures />);
    const cards = container.querySelectorAll('.feature-card');
    expect(cards.length).toBe(4);
  });

  it('should render feature titles', () => {
    render(<AntFeatures />);
    expect(screen.getByText('智能扫描')).toBeInTheDocument();
    expect(screen.getByText('安全清理')).toBeInTheDocument();
    expect(screen.getByText('自动备份')).toBeInTheDocument();
    expect(screen.getByText('详细报告')).toBeInTheDocument();
  });

  it('should render feature descriptions', () => {
    render(<AntFeatures />);
    expect(screen.getByText(/自动发现 Kiro 数据存储位置/i)).toBeInTheDocument();
    expect(screen.getByText(/基于规则的清理引擎/i)).toBeInTheDocument();
    expect(screen.getByText(/清理前自动创建备份/i)).toBeInTheDocument();
    expect(screen.getByText(/显示清理前后的空间对比/i)).toBeInTheDocument();
  });

  it('should render feature icons', () => {
    const { container } = render(<AntFeatures />);
    const icons = container.querySelectorAll('.feature-icon');
    expect(icons.length).toBe(4);
  });

  it('should use Ant Design Card component', () => {
    const { container } = render(<AntFeatures />);
    const antCards = container.querySelectorAll('.ant-card');
    expect(antCards.length).toBeGreaterThan(0);
  });

  it('should use responsive grid layout', () => {
    const { container } = render(<AntFeatures />);
    const row = container.querySelector('.ant-row');
    expect(row).toBeInTheDocument();
    const cols = container.querySelectorAll('.ant-col');
    expect(cols.length).toBe(4);
  });
});
