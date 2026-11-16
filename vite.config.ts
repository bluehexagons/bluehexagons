import { defineConfig, type Plugin } from 'vite';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { siteHtmlPlugin } from './build/site-html.ts';
import { htmlEntries, normalizeBasePath } from './build/entries.ts';
import { pages } from './src/site.ts';

const projectRoot = dirname(fileURLToPath(import.meta.url));
const sourceRoot = resolve(projectRoot, 'src');

// The shop/account UI is optional: it is only built when VITE_SHOP=1. By
// default `npm run build` excludes everything under src/shop/, so the static
// site ships with no store or login UI in the output bundle.
const includeShop = process.env.VITE_SHOP === '1';

const entries = htmlEntries(sourceRoot, Object.values(pages), includeShop);

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
  appType: 'mpa',
  base: normalizeBasePath(process.env.VITE_BASE_PATH || '/'),

  plugins: [siteHtmlPlugin(sourceRoot, includeShop), jsxInjectPlugin],

  // Where to output the built files
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: entries,
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
      '@': sourceRoot,
      '/assets': resolve(projectRoot, 'public/assets'),
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
