import assert from 'node:assert/strict';
import { globSync, readFileSync, statSync } from 'node:fs';
import { extname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import test from 'node:test';
import { normalizeBasePath } from '../build/entries.ts';
import { siteOrigin } from '../src/site.ts';

const base = normalizeBasePath(process.env.VITE_BASE_PATH || '/');
const buildOrigin = 'https://build.example';
const read = (path: string) => readFileSync(path, 'utf8');

// The maintained guides use inline links and ATX headings. Ignore examples in
// fenced code; archived Markdown in public/etc/ is deliberately outside scope.
const prose = (markdown: string) => markdown.replace(/^(`{3,}|~{3,})[^\n]*\n[\s\S]*?^\1\s*$/gm, '');
const links = (markdown: string) => [...prose(markdown).matchAll(/\[[^\]\n]+\]\(([^\s)]+)\)/g)].map(match => match[1]);

function headingIds(markdown: string) {
  const ids = new Set<string>();
  for (const [, heading] of prose(markdown).matchAll(/^#{1,6}\s+(.+?)\s*#*\s*$/gm)) {
    const slug = heading.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/<[^>]*>/g, '')
      .toLowerCase().replace(/[^\p{L}\p{N}\p{M}_\-\s]/gu, '').replace(/\s/g, '-');
    let id = slug;
    for (let suffix = 1; ids.has(id); suffix++) id = `${slug}-${suffix}`;
    ids.add(id);
  }
  return ids;
}

function checkLinks(markdown: string, source: URL) {
  for (const href of links(markdown)) {
    const url = new URL(href, source);
    let target: string;
    if (url.origin === siteOrigin) {
      // Canonical links in the profile README always target the root domain,
      // even when this particular build is hosted under a project prefix.
      target = resolve('dist', `.${decodeURIComponent(url.pathname)}`);
    } else if (url.origin === buildOrigin) {
      assert.ok(url.pathname.startsWith(base), `${source}: link leaves hosting base: ${href}`);
      target = resolve('dist', decodeURIComponent(url.pathname.slice(base.length)));
    } else if (url.protocol === 'file:') {
      target = fileURLToPath(url);
    } else {
      continue; // External URLs are not network dependencies of local checks.
    }
    const info = statSync(target, { throwIfNoEntry: false });
    assert.ok(info, `${source}: missing destination: ${href}`);
    if (info.isDirectory()) target = resolve(target, 'index.html');
    assert.ok(statSync(target, { throwIfNoEntry: false })?.isFile(), `${source}: missing file: ${href}`);
    if (!url.hash) continue;
    const content = read(target);
    const ids = extname(target) === '.md'
      ? headingIds(content)
      : new Set([...content.matchAll(/\bid=["']([^"']+)["']/g)].map(match => match[1]));
    assert.ok(ids.has(decodeURIComponent(url.hash.slice(1))), `${source}: missing fragment: ${href}`);
  }
}

test('maintained repository documentation links resolve to files and headings', () => {
  for (const file of globSync(['*.md', 'docs/**/*.md', 'server/README.md'])) {
    checkLinks(read(file), pathToFileURL(resolve(file)));
  }
});

test('published Markdown links resolve within the matching site build', () => {
  for (const file of ['profile.md', 'llms.txt']) {
    checkLinks(read(resolve('dist', file)), new URL(`${base}${file}`, buildOrigin));
  }
});

test('documentation checks detect missing files and fragments while ignoring fenced examples', () => {
  const source = pathToFileURL(resolve('README.md'));
  assert.throws(() => checkLinks('[Missing](docs/does-not-exist.md)', source), /missing destination/);
  assert.throws(() => checkLinks('[Missing](docs/development.md#does-not-exist)', source), /missing fragment/);
  assert.throws(() => checkLinks('[Missing](https://bluehexagons.com/does-not-exist.html)', source), /missing destination/);
  assert.throws(() => checkLinks('[Missing](portfolio.html#does-not-exist)', new URL(`${base}profile.md`, buildOrigin)), /missing fragment/);
  if (base !== '/') {
    assert.throws(() => checkLinks('[Outside](/profile.html)', new URL(`${base}profile.md`, buildOrigin)), /leaves hosting base/);
  }
  assert.deepEqual(links('```md\n[Example](missing.md)\n```\n[Real](README.md)'), ['README.md']);
  assert.deepEqual([...headingIds('# Example\n## Example\n## Skills & tools\n## [Antistatic](antistatic.html)')],
    ['example', 'example-1', 'skills--tools', 'antistatic']);
});
