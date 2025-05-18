jest.setup.ts
/**
 * Jest setup file for frontend testing
 * This configures the test environment and applies mocks
 */

// Import our WebSocket mock
import './../../__mocks__/websocket';

// Suppress Node.js deprecation warnings
process.env.NODE_OPTIONS = '--no-deprecation';

// Mock fetch API for tests
global.fetch = jest.fn().mockImplementation((url, options) => {
  return Promise.resolve({
    ok: true,
    status: 200,
    json: async () => ({}),
    text: async () => '',
    blob: async () => new Blob(),
  });
});

// Fix requestAnimationFrame for React testing
global.requestAnimationFrame = (callback) => {
  setTimeout(callback, 0);
  return 0;
};

// Suppress console errors during tests
// This is useful for expected errors that might be thrown during testing
const originalConsoleError = console.error;
console.error = (...args) => {
  // Filter out specific expected errors
  const isWebSocketError = args.some(arg => 
    typeof arg === 'string' && arg.includes('WebSocket error')
  );
  
  // Log unexpected errors
  if (!isWebSocketError) {
    originalConsoleError(...args);
  }
};

// Mock the localStorage API
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    length: 0,
    key: (_: number) => null,
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Test setup has been moved to jest.setup.ts
// This ensures consistent test environment across all test files
import '../jest.setup';

// Import our WebSocket mock for test-specific handling
import MockWebSocket from '../__mocks__/websocket';require('@testing-library/jest-dom');

// Set fixed time for all tests
const fixedDate = new Date('2025-05-18T12:00:00Z');
global.Date = class extends Date {
  constructor(date?: any) {
    if (date) {
      // @ts-ignore
      return super(date);
    }
    return fixedDate;
  }
  
  static now() {
    return fixedDate.getTime();
  }
};

// Enable mockClear and mockReset on fetch
afterEach(() => {
  (global.fetch as jest.Mock).mockClear();
});
