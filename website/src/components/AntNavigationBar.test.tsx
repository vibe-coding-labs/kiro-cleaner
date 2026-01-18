import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n/config';
import AntNavigationBar from './AntNavigationBar';

describe('AntNavigationBar', () => {
  const renderWithI18n = (component: React.ReactElement) => {
    return render(
      <I18nextProvider i18n={i18n}>
        {component}
      </I18nextProvider>
    );
  };

  it('renders the logo and brand name', () => {
    renderWithI18n(<AntNavigationBar />);
    expect(screen.getByText('Kiro Cleaner')).toBeInTheDocument();
    expect(screen.getByText('🧹')).toBeInTheDocument();
  });

  it('renders navigation menu items', () => {
    renderWithI18n(<AntNavigationBar />);
    expect(screen.getByText('Features')).toBeInTheDocument();
    expect(screen.getByText('Use Cases')).toBeInTheDocument();
    expect(screen.getByText('FAQ')).toBeInTheDocument();
  });

  it('renders GitHub button', () => {
    renderWithI18n(<AntNavigationBar />);
    const githubButtons = screen.getAllByText('GitHub');
    expect(githubButtons.length).toBeGreaterThan(0);
  });

  it('has correct href for navigation links', () => {
    renderWithI18n(<AntNavigationBar />);
    const featuresLink = screen.getByText('Features').closest('a');
    const useCasesLink = screen.getByText('Use Cases').closest('a');
    const faqLink = screen.getByText('FAQ').closest('a');
    
    expect(featuresLink).toHaveAttribute('href', '#features');
    expect(useCasesLink).toHaveAttribute('href', '#use-cases');
    expect(faqLink).toHaveAttribute('href', '#faq');
  });

  it('GitHub button links to correct repository', () => {
    renderWithI18n(<AntNavigationBar />);
    const githubLinks = screen.getAllByRole('link', { name: /GitHub/i });
    githubLinks.forEach(link => {
      expect(link).toHaveAttribute('href', 'https://github.com/vibe-coding-labs/kiro-cleaner');
    });
  });
});
