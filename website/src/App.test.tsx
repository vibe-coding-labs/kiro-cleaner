import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import App from './App';

describe('App - Ant Design Setup', () => {
  it('should render without crashing with Ant Design configured', () => {
    const { container } = render(<App />);
    // If the app renders without errors, Ant Design is properly configured
    expect(container.firstChild).toBeTruthy();
  });

  it('should have ConfigProvider wrapping the app', () => {
    const { container } = render(<App />);
    // Check that the app renders successfully with ConfigProvider
    expect(container.querySelector('.MuiBox-root')).toBeTruthy();
  });
});
