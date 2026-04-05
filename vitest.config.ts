import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: './test/setup.ts',
    testTimeout: 15000,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      include: ['test/**/*.spec.ts'],
      exclude: ['node_modules/', 'test/setup.ts'],
      lines: 80,
      functions: 80,
      branches: 75,
      statements: 80,
    },
  },
});
