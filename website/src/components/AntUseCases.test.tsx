import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AntUseCases from './AntUseCases';

describe('AntUseCases', () => {
  it('renders the section header', () => {
    render(<AntUseCases />);
    expect(screen.getByText('使用场景')).toBeInTheDocument();
    expect(screen.getByText('什么时候需要 Kiro Cleaner？')).toBeInTheDocument();
    expect(screen.getByText('Kiro Cleaner 适用的场景')).toBeInTheDocument();
  });

  it('renders all four use cases', () => {
    render(<AntUseCases />);
    expect(screen.getByText('存储空间不足')).toBeInTheDocument();
    expect(screen.getByText('IDE 运行缓慢')).toBeInTheDocument();
    expect(screen.getByText('项目切换频繁')).toBeInTheDocument();
    expect(screen.getByText('长期使用维护')).toBeInTheDocument();
  });

  it('renders use case scenarios', () => {
    render(<AntUseCases />);
    expect(screen.getByText(/当你的磁盘空间告急/)).toBeInTheDocument();
    expect(screen.getByText(/当 Kiro IDE 响应变慢/)).toBeInTheDocument();
    expect(screen.getByText(/当你在多个项目间切换/)).toBeInTheDocument();
    expect(screen.getByText(/当你长期使用 Kiro IDE/)).toBeInTheDocument();
  });

  it('renders use case solutions', () => {
    render(<AntUseCases />);
    expect(screen.getByText(/Kiro Cleaner 可以清理对话历史/)).toBeInTheDocument();
    expect(screen.getByText(/清理冗余数据可能有助于提升 IDE 性能/)).toBeInTheDocument();
    expect(screen.getByText(/定期清理可以避免项目数据混乱/)).toBeInTheDocument();
    expect(screen.getByText(/定期维护可以防止数据累积/)).toBeInTheDocument();
  });

  it('renders stats badges', () => {
    render(<AntUseCases />);
    expect(screen.getByText(/释放存储空间/)).toBeInTheDocument();
    expect(screen.getByText(/优化性能/)).toBeInTheDocument();
    expect(screen.getByText(/支持批量清理/)).toBeInTheDocument();
    expect(screen.getByText(/建议定期清理/)).toBeInTheDocument();
  });
});
