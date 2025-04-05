import { defineConfig } from 'vite';
import { resolve } from 'path';
import { globSync } from 'glob';

// Find all HTML files in src directory and subdirectories
const htmlEntries = globSync('src/**/*.html').reduce((entries, path) => {
  const fileName = path.replace('src/', '').replace('.html', '');
  entries[fileName] = resolve(__dirname, path);
  return entries;
}, {});

export default defineConfig({
  // Base directory for resolving imports
  root: 'src',
  
  // Where to output the built files
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        // Include all HTML files as entry points
        ...htmlEntries
      }
    }
  },
  
  // Serve static assets from this directory during development
  publicDir: '../public',
  
  // Configure server options
  server: {
    port: 3000,
  },

  // Explicitly configure asset handling
  resolve: {
    alias: {
      '/assets': resolve(__dirname, 'public/assets'),
    }
  }
});