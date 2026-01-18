import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n/config';
import AntFeatures from './AntFeatures';

describe('AntFeatures Component', () => {
  const renderWithI18n = (component: React.ReactElement) => {
    return render(
      <I18nextProvider i18n={i18n}>
        {component}
      </I18nextProvider>
    );
  };

  it('should render all feature cards', () => {
    const { container } = renderWithI18n(<AntFeatures />);
    const cards = container.querySelectorAll('.feature-card');
    expect(cards.length).toBe(4);
  });

  it('should render feature titles', () => {
    renderWithI18n(<AntFeatures />);
    expect(screen.getByText('Smart Scan')).toBeInTheDocument();
    expect(screen.getByText('Safe Cleanup')).toBeInTheDocument();
    expect(screen.getByText('Auto Backup')).toBeInTheDocument();
    expect(screen.getByText('Detailed Reports')).toBeInTheDocument();
  });

  it('should render feature descriptions', () => {
    renderWithI18n(<AntFeatures />);
    expect(screen.getByText(/Automatically discover Kiro data storage locations/i)).toBeInTheDocument();
    expect(screen.getByText(/Rule-based cleanup engine/i)).toBeInTheDocument();
    expect(screen.getByText(/Automatically creates backups before cleanup/i)).toBeInTheDocument();
    expect(screen.getByText(/Shows before\/after space comparison/i)).toBeInTheDocument();
  });

  it('should render feature icons', () => {
    const { container } = renderWithI18n(<AntFeatures />);
    const icons = container.querySelectorAll('.feature-icon');
    expect(icons.length).toBe(4);
  });

  it('should use Ant Design Card component', () => {
    const { container } = renderWithI18n(<AntFeatures />);
    const antCards = container.querySelectorAll('.ant-card');
    expect(antCards.length).toBeGreaterThan(0);
  });

  it('should use responsive grid layout', () => {
    const { container } = renderWithI18n(<AntFeatures />);
    const row = container.querySelector('.ant-row');
    expect(row).toBeInTheDocument();
    const cols = container.querySelectorAll('.ant-col');
    expect(cols.length).toBe(4);
  });
});
