import { defineConfig, type Plugin } from 'vite';
import { resolve } from 'path';
import { globSync } from 'glob';

// The shop/account UI is optional: it is only built when VITE_SHOP=1. By
// default `npm run build` excludes everything under src/shop/, so the static
// site ships with no store or login UI in the output bundle.
const includeShop = process.env.VITE_SHOP === '1';

// Find all HTML files in src directory and subdirectories
const htmlEntries = globSync('src/**/*.html', {
  ignore: includeShop ? [] : ['src/shop/**'],
}).reduce((entries: Record<string, string>, path) => {
  const fileName = path.replace('src/', '').replace('.html', '');
  entries[fileName] = resolve(__dirname, path);
  return entries;
}, {});

const jsxInjectPlugin: Plugin = {
  name: 'jsx-inject',
  enforce: 'pre',
  transform(code, id) {
    if (/\.[jt]sx$/.test(id)) {
      return { code: `import { h, Fragment } from '@/jsx';\n${code}` };
    }
  },
};

export default defineConfig({
  // Base directory for resolving imports
  root: 'src',

  plugins: [jsxInjectPlugin],

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
      '@': resolve(__dirname, 'src'),
      '/assets': resolve(__dirname, 'public/assets'),
    }
  },

  oxc: {
    jsx: {
      runtime: 'classic',
      pragma: 'h',
      pragmaFrag: 'Fragment',
    },
  },
});
