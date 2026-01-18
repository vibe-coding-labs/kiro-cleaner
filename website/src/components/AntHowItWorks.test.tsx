import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n/config';
import AntHowItWorks from './AntHowItWorks';

describe('AntHowItWorks', () => {
  const renderWithI18n = (component: React.ReactElement) => {
    return render(
      <I18nextProvider i18n={i18n}>
        {component}
      </I18nextProvider>
    );
  };

  it('renders the section header', () => {
    renderWithI18n(<AntHowItWorks />);
    expect(screen.getByText('How It Works')).toBeInTheDocument();
    expect(screen.getByText('Usage Workflow')).toBeInTheDocument();
    expect(screen.getByText('Simple cleanup process')).toBeInTheDocument();
  });

  it('renders all four steps', () => {
    renderWithI18n(<AntHowItWorks />);
    expect(screen.getAllByText('Scan').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Preview').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Clean').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Complete').length).toBeGreaterThan(0);
  });

  it('renders step descriptions', () => {
    renderWithI18n(<AntHowItWorks />);
    expect(screen.getByText(/Detect Kiro IDE data storage location/)).toBeInTheDocument();
    expect(screen.getByText(/Generate cleanup report/)).toBeInTheDocument();
    expect(screen.getByText(/Automatically create backup before cleanup/)).toBeInTheDocument();
    expect(screen.getByText(/Generate comparison report after cleanup/)).toBeInTheDocument();
  });

  it('renders command example section', () => {
    renderWithI18n(<AntHowItWorks />);
    expect(screen.getByText('💻 Quick Start')).toBeInTheDocument();
    expect(screen.getByText(/kiro-cleaner scan/)).toBeInTheDocument();
  });

  it('renders step details', () => {
    renderWithI18n(<AntHowItWorks />);
    expect(screen.getByText('Scan conversation history database')).toBeInTheDocument();
    expect(screen.getByText('Show cleanable data types')).toBeInTheDocument();
    expect(screen.getByText('Auto backup before cleanup')).toBeInTheDocument();
    expect(screen.getByText('Space freed statistics')).toBeInTheDocument();
  });
});
