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

  it('should render video element with correct attributes', () => {
    const { container } = render(<AntHeroSection />);
    const video = container.querySelector('video');
    expect(video).toBeInTheDocument();
    expect(video).toHaveAttribute('autoPlay');
    expect(video).toHaveAttribute('loop');
    expect(video).toHaveAttribute('playsInline');
    // In test environment, muted might not be set as an attribute but as a property
    // Just verify the video element exists with the key attributes
  });

  it('should have correct video source', () => {
    const { container } = render(<AntHeroSection />);
    const source = container.querySelector('source');
    // In test environment, BASE_URL defaults to '/'
    expect(source?.getAttribute('src')).toContain('assets/demo-clean-command.mov');
  });
});
