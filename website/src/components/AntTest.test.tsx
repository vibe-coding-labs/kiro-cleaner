import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AntTest from './AntTest';

describe('AntTest Component', () => {
  it('should render Ant Design Card component', () => {
    render(<AntTest />);
    expect(screen.getByText(/Ant Design Test/i)).toBeInTheDocument();
  });

  it('should render Ant Design Button with icon', () => {
    render(<AntTest />);
    expect(screen.getByRole('button', { name: /Test Button/i })).toBeInTheDocument();
  });

  it('should display success message', () => {
    render(<AntTest />);
    expect(screen.getByText(/If you can see this card/i)).toBeInTheDocument();
  });
});
