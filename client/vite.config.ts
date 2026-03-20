import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          ['babel-plugin-react-compiler', { dev: true }],
          [
            'babel-plugin-import',
            {
              libraryName: '@mui/icons-material',
              libraryDirectory: '',
              camel2DashComponentName: false,
            },
            'mui-icons',
          ],
        ],
      },
    }),
    tsconfigPaths(),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
