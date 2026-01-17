import { expect, afterEach, beforeAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// Mock IntersectionObserver for tests
beforeAll(() => {
  (globalThis as any).IntersectionObserver = class IntersectionObserver {
    constructor(
      public callback: IntersectionObserverCallback,
      public options?: IntersectionObserverInit
    ) {}

    observe() {
      // Immediately trigger the callback with a mock entry
      this.callback(
        [
          {
            isIntersecting: true,
            target: document.createElement('div'),
            boundingClientRect: {} as DOMRectReadOnly,
            intersectionRatio: 1,
            intersectionRect: {} as DOMRectReadOnly,
            rootBounds: null,
            time: Date.now(),
          } as IntersectionObserverEntry,
        ],
        this as unknown as IntersectionObserver
      );
    }

    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
    get root() {
      return null;
    }
    get rootMargin() {
      return '0px';
    }
    get thresholds() {
      return [0];
    }
  } as unknown as typeof IntersectionObserver;

  // Mock ResizeObserver for Ant Design components
  (globalThis as any).ResizeObserver = class ResizeObserver {
    constructor(public callback: ResizeObserverCallback) {}
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;

  // Mock matchMedia for tests
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => true,
    }),
  });

  // Mock CSS.supports for tests
  if (typeof CSS === 'undefined') {
    (globalThis as any).CSS = {};
  }
  if (!CSS.supports) {
    CSS.supports = (property: string, value?: string) => {
      // Mock implementation - return true for backdrop-filter
      if (property === 'backdrop-filter' || property === '-webkit-backdrop-filter') {
        return true;
      }
      return false;
    };
  }
});

// Cleanup after each test
afterEach(() => {
  cleanup();
});
