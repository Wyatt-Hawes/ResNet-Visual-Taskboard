import {defineConfig} from 'vitest/config';
import react from '@vitejs/plugin-react';
// import eslint from 'vite-plugin-eslint';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './setupTests.js',
    coverage: {
      exclude: [
        'src/data/*',
        'src/__tests__/*',
        'src/main.jsx',
        '.eslintrc.cjs',
      ],
    },
    server:{
      host: '128.114.140.150',
      port: 80

    }
  },
});
