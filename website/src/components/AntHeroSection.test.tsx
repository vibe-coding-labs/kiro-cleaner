import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AntHeroSection from './AntHeroSection';

describe('AntHeroSection Component', () => {
  it('should render the main heading', () => {
    render(<AntHeroSection />);
    expect(screen.getByText(/让 Kiro IDE/i)).toBeInTheDocument();
    expect(screen.getByText(/轻装上阵/i)).toBeInTheDocument();
  });

  it('should render the subtitle', () => {
    render(<AntHeroSection />);
    expect(screen.getByText(/Kiro IDE 缓存过大导致卡顿/i)).toBeInTheDocument();
  });

  it('should render CTA buttons', () => {
    render(<AntHeroSection />);
    expect(screen.getByRole('link', { name: /立即开始/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /了解更多/i })).toBeInTheDocument();
  });

  it('should render feature tags', () => {
    render(<AntHeroSection />);
    expect(screen.getByText(/快速扫描/i)).toBeInTheDocument();
    expect(screen.getAllByText(/安全可靠/i).length).toBeGreaterThan(0);
    // "自动备份" appears twice in the component, so we use getAllByText
    expect(screen.getAllByText(/自动备份/i).length).toBeGreaterThan(0);
  });

  it('should render demo image with correct attributes', () => {
    const { container } = render(<AntHeroSection />);
    const img = container.querySelector('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('alt', 'Kiro Cleaner Demo');
  });

  it('should have correct demo image source', () => {
    const { container } = render(<AntHeroSection />);
    const img = container.querySelector('img');
    // In test environment, BASE_URL defaults to '/'
    expect(img?.getAttribute('src')).toContain('assets/demo-clean-command-3x.gif');
  });
});
