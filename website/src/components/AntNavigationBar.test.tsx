import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AntNavigationBar from './AntNavigationBar';

describe('AntNavigationBar', () => {
  it('renders the logo and brand name', () => {
    render(<AntNavigationBar />);
    expect(screen.getByText('Kiro Cleaner')).toBeInTheDocument();
    expect(screen.getByText('🧹')).toBeInTheDocument();
  });

  it('renders navigation menu items', () => {
    render(<AntNavigationBar />);
    expect(screen.getByText('特性')).toBeInTheDocument();
    expect(screen.getByText('场景')).toBeInTheDocument();
    expect(screen.getByText('FAQ')).toBeInTheDocument();
  });

  it('renders GitHub button', () => {
    render(<AntNavigationBar />);
    const githubButtons = screen.getAllByText('GitHub');
    expect(githubButtons.length).toBeGreaterThan(0);
  });

  it('has correct href for navigation links', () => {
    render(<AntNavigationBar />);
    const featuresLink = screen.getByText('特性').closest('a');
    const useCasesLink = screen.getByText('场景').closest('a');
    const faqLink = screen.getByText('FAQ').closest('a');
    
    expect(featuresLink).toHaveAttribute('href', '#features');
    expect(useCasesLink).toHaveAttribute('href', '#use-cases');
    expect(faqLink).toHaveAttribute('href', '#faq');
  });

  it('GitHub button links to correct repository', () => {
    render(<AntNavigationBar />);
    const githubLinks = screen.getAllByRole('link', { name: /GitHub/i });
    githubLinks.forEach(link => {
      expect(link).toHaveAttribute('href', 'https://github.com/vibe-coding-labs/kiro-cleaner');
    });
  });
});
