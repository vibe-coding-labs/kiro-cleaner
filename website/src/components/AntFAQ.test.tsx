import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AntFAQ from './AntFAQ';

describe('AntFAQ', () => {
  it('renders the section header', () => {
    render(<AntFAQ />);
    expect(screen.getByText('常见问题')).toBeInTheDocument();
    expect(screen.getByText('你可能想知道的')).toBeInTheDocument();
    expect(screen.getByText('关于 Kiro Cleaner 的常见问题解答')).toBeInTheDocument();
  });

  it('renders all FAQ questions', () => {
    render(<AntFAQ />);
    expect(screen.getByText('Kiro Cleaner 会删除我的重要数据吗？')).toBeInTheDocument();
    expect(screen.getByText('清理后 Kiro IDE 还能正常工作吗？')).toBeInTheDocument();
    expect(screen.getByText('多久清理一次比较合适？')).toBeInTheDocument();
    expect(screen.getByText('支持哪些操作系统？')).toBeInTheDocument();
    expect(screen.getByText('如何恢复被清理的数据？')).toBeInTheDocument();
    expect(screen.getByText('是否需要停止 Kiro IDE 才能清理？')).toBeInTheDocument();
  });

  it('renders FAQ answers', () => {
    render(<AntFAQ />);
    expect(screen.getByText(/只清理缓存、临时文件和旧的对话历史/)).toBeInTheDocument();
    expect(screen.getByText(/只清理不影响 IDE 正常运行的冗余数据/)).toBeInTheDocument();
  });

  it('renders contact CTA section', () => {
    render(<AntFAQ />);
    expect(screen.getByText('还有其他问题？')).toBeInTheDocument();
    expect(screen.getByText(/欢迎在 GitHub 上提出 Issue/)).toBeInTheDocument();
  });

  it('renders contact links', () => {
    render(<AntFAQ />);
    expect(screen.getByText('📝 提交 Issue')).toBeInTheDocument();
    expect(screen.getByText('💬 加入讨论')).toBeInTheDocument();
  });

  it('contact links have correct href', () => {
    render(<AntFAQ />);
    const issueLink = screen.getByText('📝 提交 Issue').closest('a');
    const discussionLink = screen.getByText('💬 加入讨论').closest('a');
    
    expect(issueLink).toHaveAttribute('href', 'https://github.com/vibe-coding-labs/kiro-cleaner/issues');
    expect(discussionLink).toHaveAttribute('href', 'https://github.com/vibe-coding-labs/kiro-cleaner/discussions');
  });
});
