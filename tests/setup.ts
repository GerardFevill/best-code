// @ai-refactor: Test setup following BestCode security practices

// Global test setup
beforeAll(() => {
  // Ensure clean environment for tests
  process.env.NODE_ENV = 'test';
});

afterAll(() => {
  // Cleanup after all tests
});

// Custom matchers for Result<T, E> pattern
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeSuccessResult(): R;
      toBeErrorResult(): R;
    }
  }
}

expect.extend({
  toBeSuccessResult(received) {
    const pass = received && received.success === true && 'data' in received;
    if (pass) {
      return {
        message: () => `expected ${JSON.stringify(received)} not to be a success result`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${JSON.stringify(received)} to be a success result`,
        pass: false,
      };
    }
  },
  
  toBeErrorResult(received) {
    const pass = received && received.success === false && 'error' in received;
    if (pass) {
      return {
        message: () => `expected ${JSON.stringify(received)} not to be an error result`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${JSON.stringify(received)} to be an error result`,
        pass: false,
      };
    }
  },
});
