import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/api': {
        // Docker Compose service name by default; API_TARGET=http://localhost:5000 for a local backend.
        target: process.env.API_TARGET || 'http://backend:5000',
        changeOrigin: true,
      },
    },
  },
});
