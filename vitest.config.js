import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      all: true,
      include: ['src/**/*.js'],
      exclude: [
        'node_modules/',
        'dist/',
        'test/',
        'build.js'
      ],
      reportsDirectory: './coverage'
    },
    reporters: ['verbose']
  }
});

