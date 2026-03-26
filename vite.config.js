import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        calculator: resolve(__dirname, 'src/mount-calculator.jsx'),
        diagnostic: resolve(__dirname, 'src/mount-diagnostic.jsx'),
        sample: resolve(__dirname, 'src/mount-sample.jsx'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name]-[hash].js',
        assetFileNames: '[name]-[hash].[ext]',
      },
    },
  },
});
