import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { pageFile, type Page } from '../src/site.ts';

export function normalizeBasePath(base = '/'): string {
  if (!base.startsWith('/') || base.includes('//') || /[?#\\\s%]/.test(base)
    || base.split('/').some(part => part === '.' || part === '..')) {
    throw new Error('VITE_BASE_PATH must be an absolute URL path such as / or /bluehexagons/.');
  }
  return base.replace(/\/?$/, '/');
}

function findHtmlFiles(root: string, includeShop: boolean, directory = ''): string[] {
  return readdirSync(resolve(root, directory), { withFileTypes: true }).flatMap(entry => {
    const path = `${directory}${entry.name}`;
    if (path === 'shop' && !includeShop) return [];
    if (entry.isDirectory()) return findHtmlFiles(root, includeShop, `${path}/`);
    return entry.isFile() && entry.name.endsWith('.html') ? [path] : [];
  }).sort();
}

export function htmlEntries(root: string, registeredPages: readonly Page[], includeShop = false): Record<string, string> {
  const expected = new Set<string>();
  for (const page of registeredPages) {
    if (!/^(?:[a-zA-Z0-9_-]+\/)*(?:[a-zA-Z0-9_-]+\.html)?$/.test(page.path)
      || page.path.startsWith('shop/')) {
      throw new Error(`Invalid public page path: ${page.path}`);
    }
    const file = pageFile(page.path);
    if (expected.has(file)) throw new Error(`Duplicate page entry: ${file}`);
    expected.add(file);
  }
  const files = findHtmlFiles(root, includeShop);
  for (const file of files) {
    if (file.startsWith('shop/')) continue;
    if (!expected.delete(file)) throw new Error(`Register ${file} in src/site.ts before adding it to the site.`);
  }
  if (expected.size) throw new Error(`Missing registered page file(s): ${[...expected].join(', ')}`);
  return Object.fromEntries(files.map(file => [file.replace(/\.html$/, ''), resolve(root, file)]));
}
