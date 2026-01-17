/**
 * Theme Error Boundary
 * 
 * Catches theme loading errors and provides graceful fallback to modernTheme.
 * Shows warnings in development mode but fails silently in production.
 * 
 * Validates: Requirements 8.1
 * 
 * @example
 * ```tsx
 * import ThemeErrorBoundary from './theme/ThemeErrorBoundary';
 * import { premiumTheme } from './theme/premiumTheme';
 * 
 * function App() {
 *   return (
 *     <ThemeErrorBoundary theme={premiumTheme}>
 *       <YourApp />
 *     </ThemeErrorBoundary>
 *   );
 * }
 * ```
 * 
 * @example With CssBaseline
 * ```tsx
 * import { CssBaseline } from '@mui/material';
 * import ThemeErrorBoundary from './theme/ThemeErrorBoundary';
 * import { premiumTheme } from './theme/premiumTheme';
 * 
 * function App() {
 *   return (
 *     <ThemeErrorBoundary theme={premiumTheme}>
 *       <CssBaseline />
 *       <YourApp />
 *     </ThemeErrorBoundary>
 *   );
 * }
 * ```
 */

import React, { Component, ReactNode } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { modernTheme } from './modernTheme';

interface ThemeErrorBoundaryProps {
  children: ReactNode;
  theme: any;
}

interface ThemeErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ThemeErrorBoundary extends Component<ThemeErrorBoundaryProps, ThemeErrorBoundaryState> {
  constructor(props: ThemeErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ThemeErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log error in development mode
    if (process.env.NODE_ENV === 'development') {
      console.warn('Theme loading error detected. Falling back to modernTheme.', {
        error: error.message,
        componentStack: errorInfo.componentStack,
      });
    }
  }

  render(): ReactNode {
    const { hasError } = this.state;
    const { children, theme } = this.props;

    // If there's an error, fall back to modernTheme
    if (hasError) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Using fallback theme (modernTheme) due to theme error');
      }
      
      return (
        <ThemeProvider theme={modernTheme}>
          {children}
        </ThemeProvider>
      );
    }

    // Normal render with provided theme
    return (
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    );
  }
}

export default ThemeErrorBoundary;
