import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          scanner: ['html5-qrcode'],
          generator: ['qrcode'],
        },
      },
    },
  },
  server: {
    port: 3000,
    open: false,
  },
});
