import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  server: {
    port: 5174,
  },
  build: {
    outDir: 'dist/editor',
    emptyOutDir: true,
    sourcemap: true,
    target: 'esnext',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'public/index.html'),
      },
    },
  },
  // SparkJS uses WASM with base64 data URLs - must be loaded via CDN importmap
  // Do NOT bundle Three.js or SparkJS - they are loaded via importmap in HTML
  optimizeDeps: {
    exclude: ['@sparkjsdev/spark', 'three'],
  },
});
