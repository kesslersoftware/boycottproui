/**
 * Jest setup file - runs after environment setup but before tests
 * Sets up test utilities and mocking helpers
 */

// Mock console methods to reduce test noise
const originalConsoleWarn = console.warn;
const originalConsoleLog = console.log;

beforeEach(() => {
  // Reset console mocks for each test
  console.warn = jest.fn();
  console.log = jest.fn();
});

afterAll(() => {
  // Restore console methods
  console.warn = originalConsoleWarn;
  console.log = originalConsoleLog;
});