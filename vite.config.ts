import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  // Base directory for resolving imports
  root: 'src',
  
  // Where to output the built files
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
      }
    }
  },
  
  // Serve static assets from this directory during development
  publicDir: 'public',
  
  // Configure server options
  server: {
    port: 3000,
  }
});