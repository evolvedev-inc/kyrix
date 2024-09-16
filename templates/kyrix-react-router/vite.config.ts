import path from 'path';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: path.resolve(__dirname, 'dist/client'),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  base: process.env.BASE || '/',
  plugins: [react()],
});
