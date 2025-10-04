import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler', { dev: true }]],
      },
    }),
    tsconfigPaths(),
  ],
  resolve: {
    alias: {
      '@assets': path.resolve(__dirname, 'assets'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
