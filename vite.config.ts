import { defineConfig, type Plugin } from 'vite';
import { readdirSync } from 'node:fs';
import { dirname, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = dirname(fileURLToPath(import.meta.url));
const sourceRoot = resolve(projectRoot, 'src');

function findHtmlEntries(directory = sourceRoot): Record<string, string> {
  const entries: Record<string, string> = {};

  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const fullPath = resolve(directory, entry.name);
    if (entry.isDirectory()) {
      Object.assign(entries, findHtmlEntries(fullPath));
      continue;
    }
    if (!entry.isFile() || !entry.name.endsWith('.html')) continue;

    const entryName = relative(sourceRoot, fullPath)
      .split(sep)
      .join('/')
      .replace(/\.html$/, '');
    entries[entryName] = fullPath;
  }

  return entries;
}

// The shop/account UI is optional: it is only built when VITE_SHOP=1. By
// default `npm run build` excludes everything under src/shop/, so the static
// site ships with no store or login UI in the output bundle.
const includeShop = process.env.VITE_SHOP === '1';

// Find all HTML files in src directory and subdirectories.
const htmlEntries = findHtmlEntries();
if (!includeShop) {
  for (const entryName of Object.keys(htmlEntries)) {
    if (entryName === 'shop' || entryName.startsWith('shop/')) delete htmlEntries[entryName];
  }
}

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
          ...htmlEntries,
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
