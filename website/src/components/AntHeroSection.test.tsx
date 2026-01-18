import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n/config';
import AntHeroSection from './AntHeroSection';

describe('AntHeroSection Component', () => {
  const renderWithI18n = (component: React.ReactElement) => {
    return render(
      <I18nextProvider i18n={i18n}>
        {component}
      </I18nextProvider>
    );
  };

  it('should render the main heading', () => {
    renderWithI18n(<AntHeroSection />);
    expect(screen.getByText(/Make Kiro IDE/i)).toBeInTheDocument();
    expect(screen.getByText(/Run Light/i)).toBeInTheDocument();
  });

  it('should render the subtitle', () => {
    renderWithI18n(<AntHeroSection />);
    expect(screen.getByText(/Is Kiro IDE lagging due to large cache/i)).toBeInTheDocument();
  });

  it('should render CTA buttons', () => {
    renderWithI18n(<AntHeroSection />);
    expect(screen.getByRole('link', { name: /Get Started/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Learn More/i })).toBeInTheDocument();
  });

  it('should render feature tags', () => {
    renderWithI18n(<AntHeroSection />);
    expect(screen.getByText(/Fast Scan/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Safe & Reliable/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Auto Backup/i).length).toBeGreaterThan(0);
  });

  it('should render demo image with correct attributes', () => {
    const { container } = renderWithI18n(<AntHeroSection />);
    const img = container.querySelector('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('alt', 'Kiro Cleaner Demo');
  });

  it('should have correct demo image source', () => {
    const { container } = renderWithI18n(<AntHeroSection />);
    const img = container.querySelector('img');
    expect(img?.getAttribute('src')).toContain('assets/demo-clean-command-3x.gif');
  });
});
