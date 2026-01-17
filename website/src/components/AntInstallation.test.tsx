import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AntInstallation from './AntInstallation';

describe('AntInstallation', () => {
  it('renders all three tabs', () => {
    render(<AntInstallation />);
    expect(screen.getByText('从源码构建')).toBeInTheDocument();
    expect(screen.getByText('使用预编译版本')).toBeInTheDocument();
    expect(screen.getByText('使用方法')).toBeInTheDocument();
  });

  it('renders installation commands', () => {
    render(<AntInstallation />);
    expect(screen.getByText(/git clone/)).toBeInTheDocument();
    expect(screen.getByText(/make build-local/)).toBeInTheDocument();
  });

  it('renders code blocks', () => {
    render(<AntInstallation />);
    const codeBlocks = document.querySelectorAll('.ant-installation-code');
    expect(codeBlocks.length).toBeGreaterThan(0);
  });
});
