import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@styles': path.resolve(__dirname, 'src/styles'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@routes': path.resolve(__dirname, 'src/routes'),
      '@api': path.resolve(__dirname, 'src/types'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://discjam-event-management-system.onrender.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
});