import { expect, afterEach, beforeAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// Mock IntersectionObserver for tests
beforeAll(() => {
  global.IntersectionObserver = class IntersectionObserver {
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
});

// Cleanup after each test
afterEach(() => {
  cleanup();
});
