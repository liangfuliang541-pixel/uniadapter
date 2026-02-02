import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['**/*.{test,spec}.{ts,tsx}'],
    globals: true,
    css: true,
    teardownTimeout: 10000,
    onConsoleLog: (log, type) => {
      if (type === 'error') {
        console.error(log)
      }
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        'src/main.tsx',
        'src/App.tsx',
        '**/*.d.ts'
      ]
    }
  },
  resolve: {
    alias: {
      '@': './src'
    }
  }
})