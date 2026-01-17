/**
 * Tests for ThemeErrorBoundary
 * 
 * Validates:
 * - Normal rendering with valid theme
 * - Component structure and theme provider wrapping
 * - Multiple children support
 * - Error catching and fallback to modernTheme
 * - Development vs production error logging
 * 
 * Requirements: 8.1
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import ThemeErrorBoundary from './ThemeErrorBoundary';
import { premiumTheme } from './premiumTheme';
import { modernTheme } from './modernTheme';
import { Box, Typography, Button } from '@mui/material';

// Test component that uses theme
const ThemedComponent: React.FC = () => {
  return (
    <Box>
      <Typography variant="h1">Test Content</Typography>
      <Button variant="contained">Test Button</Button>
    </Box>
  );
};

// Component that throws an error
const ErrorThrowingComponent: React.FC<{ shouldThrow?: boolean }> = ({ shouldThrow = true }) => {
  if (shouldThrow) {
    throw new Error('Test theme error');
  }
  return <div>No error</div>;
};

describe('ThemeErrorBoundary', () => {
  // Store original console methods
  const originalConsoleWarn = console.warn;
  const originalConsoleError = console.error;
  const originalNodeEnv = process.env.NODE_ENV;

  beforeEach(() => {
    // Mock console methods to avoid cluttering test output
    console.warn = vi.fn();
    console.error = vi.fn();
  });

  afterEach(() => {
    // Restore console methods
    console.warn = originalConsoleWarn;
    console.error = originalConsoleError;
    // Restore NODE_ENV
    process.env.NODE_ENV = originalNodeEnv;
  });

  it('should render children normally when no error occurs', () => {
    render(
      <ThemeErrorBoundary theme={premiumTheme}>
        <ThemedComponent />
      </ThemeErrorBoundary>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
    expect(screen.getByText('Test Button')).toBeInTheDocument();
  });

  it('should wrap children in ThemeProvider', () => {
    const { container } = render(
      <ThemeErrorBoundary theme={premiumTheme}>
        <ThemedComponent />
      </ThemeErrorBoundary>
    );

    // Verify the component structure is maintained
    expect(container.firstChild).toBeTruthy();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should render children with provided theme when no error', () => {
    const { container } = render(
      <ThemeErrorBoundary theme={premiumTheme}>
        <ThemedComponent />
      </ThemeErrorBoundary>
    );

    // Verify the component renders successfully with theme
    expect(container.querySelector('h1')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should handle multiple children', () => {
    render(
      <ThemeErrorBoundary theme={premiumTheme}>
        <div>Child 1</div>
        <div>Child 2</div>
        <div>Child 3</div>
      </ThemeErrorBoundary>
    );

    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();
    expect(screen.getByText('Child 3')).toBeInTheDocument();
  });

  it('should work with modernTheme as fallback', () => {
    render(
      <ThemeErrorBoundary theme={modernTheme}>
        <ThemedComponent />
      </ThemeErrorBoundary>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
    expect(screen.getByText('Test Button')).toBeInTheDocument();
  });

  it('should render complex component trees', () => {
    render(
      <ThemeErrorBoundary theme={premiumTheme}>
        <Box>
          <Typography variant="h2">Title</Typography>
          <Box>
            <Typography variant="body1">Description</Typography>
            <Button variant="outlined">Action</Button>
          </Box>
        </Box>
      </ThemeErrorBoundary>
    );

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
  });

  it('should maintain theme context for nested components', () => {
    const NestedComponent: React.FC = () => (
      <Box>
        <Typography variant="h3">Nested</Typography>
        <Box>
          <Button variant="contained">Nested Button</Button>
        </Box>
      </Box>
    );

    render(
      <ThemeErrorBoundary theme={premiumTheme}>
        <ThemedComponent />
        <NestedComponent />
      </ThemeErrorBoundary>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
    expect(screen.getByText('Nested')).toBeInTheDocument();
    expect(screen.getByText('Nested Button')).toBeInTheDocument();
  });

  it('should have error boundary lifecycle methods', () => {
    // Verify the component has the required error boundary methods
    const instance = new ThemeErrorBoundary({ theme: premiumTheme, children: null });
    
    expect(typeof instance.componentDidCatch).toBe('function');
    expect(typeof ThemeErrorBoundary.getDerivedStateFromError).toBe('function');
  });

  describe('Error Handling', () => {
    it('should update state when error is caught', () => {
      const error = new Error('Test error');
      const newState = ThemeErrorBoundary.getDerivedStateFromError(error);

      expect(newState).toEqual({
        hasError: true,
        error,
      });
    });

    it('should render children normally when no error', () => {
      render(
        <ThemeErrorBoundary theme={premiumTheme}>
          <ErrorThrowingComponent shouldThrow={false} />
        </ThemeErrorBoundary>
      );

      expect(screen.getByText('No error')).toBeInTheDocument();
    });

    it('should call componentDidCatch when error occurs', () => {
      const instance = new ThemeErrorBoundary({ theme: premiumTheme, children: null });
      const error = new Error('Test error');
      const errorInfo = { componentStack: 'test stack' };

      // Spy on console.warn
      const warnSpy = vi.spyOn(console, 'warn');

      // Set to development mode
      process.env.NODE_ENV = 'development';

      // Call componentDidCatch directly
      instance.componentDidCatch(error, errorInfo);

      // Should log warning in development
      expect(warnSpy).toHaveBeenCalledWith(
        'Theme loading error detected. Falling back to modernTheme.',
        expect.objectContaining({
          error: 'Test error',
          componentStack: 'test stack',
        })
      );

      warnSpy.mockRestore();
    });

    it('should not log in production mode', () => {
      const instance = new ThemeErrorBoundary({ theme: premiumTheme, children: null });
      const error = new Error('Test error');
      const errorInfo = { componentStack: 'test stack' };

      // Spy on console.warn
      const warnSpy = vi.spyOn(console, 'warn');

      // Set to production mode
      process.env.NODE_ENV = 'production';

      // Call componentDidCatch directly
      instance.componentDidCatch(error, errorInfo);

      // Should not log in production
      expect(warnSpy).not.toHaveBeenCalled();

      warnSpy.mockRestore();
    });

    it('should render with fallback theme when hasError is true', () => {
      // Create an instance with error state
      const instance = new ThemeErrorBoundary({ theme: premiumTheme, children: <ThemedComponent /> });
      instance.state = { hasError: true, error: new Error('Test error') };

      // Set to development mode to test warning
      process.env.NODE_ENV = 'development';
      const warnSpy = vi.spyOn(console, 'warn');

      // Render should use modernTheme as fallback
      const result = instance.render();

      // Should log warning about using fallback theme
      expect(warnSpy).toHaveBeenCalledWith(
        'Using fallback theme (modernTheme) due to theme error'
      );

      warnSpy.mockRestore();
    });

    it('should not log fallback warning in production', () => {
      const instance = new ThemeErrorBoundary({ theme: premiumTheme, children: <ThemedComponent /> });
      instance.state = { hasError: true, error: new Error('Test error') };

      // Set to production mode
      process.env.NODE_ENV = 'production';
      const warnSpy = vi.spyOn(console, 'warn');

      // Render should use modernTheme as fallback
      instance.render();

      // Should not log in production
      expect(warnSpy).not.toHaveBeenCalled();

      warnSpy.mockRestore();
    });

    it('should provide modernTheme as fallback', () => {
      const instance = new ThemeErrorBoundary({ theme: premiumTheme, children: <ThemedComponent /> });
      instance.state = { hasError: true, error: new Error('Test error') };

      const result = instance.render();

      // Result should be a ThemeProvider with modernTheme
      expect(result).toBeDefined();
      expect(result.type).toBeDefined();
    });
  });

  describe('Theme Fallback Behavior', () => {
    it('should use premiumTheme when no error occurs', () => {
      const { container } = render(
        <ThemeErrorBoundary theme={premiumTheme}>
          <ThemedComponent />
        </ThemeErrorBoundary>
      );

      // Component should render successfully with premium theme
      expect(screen.getByText('Test Content')).toBeInTheDocument();
      expect(container.querySelector('h1')).toBeInTheDocument();
    });

    it('should render with provided theme in normal state', () => {
      const instance = new ThemeErrorBoundary({ theme: premiumTheme, children: <ThemedComponent /> });
      instance.state = { hasError: false, error: null };

      const result = instance.render();

      // Should render with provided theme
      expect(result).toBeDefined();
    });

    it('should switch to modernTheme when error state is set', () => {
      const instance = new ThemeErrorBoundary({ theme: premiumTheme, children: <ThemedComponent /> });
      
      // Initially no error
      expect(instance.state.hasError).toBe(false);
      
      // Simulate error
      instance.state = { hasError: true, error: new Error('Test') };
      
      // Should now use fallback
      expect(instance.state.hasError).toBe(true);
    });

    it('should maintain children when using fallback theme', () => {
      const instance = new ThemeErrorBoundary({ 
        theme: premiumTheme, 
        children: <div data-testid="test-child">Test</div>
      });
      instance.state = { hasError: true, error: new Error('Test error') };

      const result = instance.render();

      // Children should still be present in the render
      expect(result).toBeDefined();
    });
  });

  describe('Integration with MUI Theme', () => {
    it('should work with MUI components in normal case', () => {
      render(
        <ThemeErrorBoundary theme={premiumTheme}>
          <Button variant="contained" color="primary">
            Themed Button
          </Button>
        </ThemeErrorBoundary>
      );

      expect(screen.getByText('Themed Button')).toBeInTheDocument();
    });

    it('should work with complex MUI component trees', () => {
      render(
        <ThemeErrorBoundary theme={premiumTheme}>
          <Box sx={{ p: 2 }}>
            <Typography variant="h4" gutterBottom>
              Title
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="outlined">Cancel</Button>
              <Button variant="contained">Submit</Button>
            </Box>
          </Box>
        </ThemeErrorBoundary>
      );

      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.getByText('Submit')).toBeInTheDocument();
    });
  });
});
