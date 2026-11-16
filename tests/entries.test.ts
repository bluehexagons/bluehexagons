import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import test, { type TestContext } from 'node:test';
import { htmlEntries, normalizeBasePath } from '../build/entries.ts';
import { pageFile, pages } from '../src/site.ts';

function sourceTree(t: TestContext, files: string[]): string {
  const root = mkdtempSync(join(tmpdir(), 'portfolio-pages-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  for (const file of files) {
    mkdirSync(dirname(join(root, file)), { recursive: true });
    writeFileSync(join(root, file), '<!doctype html><title>Fixture</title>');
  }
  return root;
}

test('registered root and nested pages resolve to independent HTML entries', t => {
  const root = sourceTree(t, ['index.html', 'projects/first/index.html', 'projects/second.html', 'portfolio.ts']);
  const registered = ['', 'projects/first/', 'projects/second.html'].map(path => ({ ...pages.home, path }));
  assert.deepEqual(htmlEntries(root, registered), {
    index: join(root, 'index.html'),
    'projects/first/index': join(root, 'projects/first/index.html'),
    'projects/second': join(root, 'projects/second.html'),
  });
  assert.equal(pageFile(''), 'index.html');
  assert.equal(pageFile('projects/first/'), 'projects/first/index.html');
});

test('page discovery rejects missing, unregistered, duplicate, and invalid entries', t => {
  const root = sourceTree(t, ['index.html']);
  assert.throws(() => htmlEntries(root, []), /Register index.html/);
  assert.throws(() => htmlEntries(root, [pages.home, { ...pages.home, path: 'missing.html' }]), /Missing registered.*missing.html/);
  assert.throws(() => htmlEntries(root, [pages.home, { ...pages.home, path: 'index.html' }]), /Duplicate page entry/);
  for (const path of ['/absolute.html', '../escape.html', 'a//b.html', 'page', 'page.html#section', 'shop/index.html']) {
    assert.throws(() => htmlEntries(root, [{ ...pages.home, path }]), /Invalid public page path/, path);
  }
});

test('shop HTML is discovered only for explicitly enabled builds', t => {
  const root = sourceTree(t, ['index.html', 'shop/index.html', 'shop/admin.html']);
  assert.deepEqual(Object.keys(htmlEntries(root, [pages.home])), ['index']);
  assert.deepEqual(Object.keys(htmlEntries(root, [pages.home], true)), ['index', 'shop/admin', 'shop/index']);
});

test('hosting bases are normalized and reject relative or ambiguous paths', () => {
  assert.equal(normalizeBasePath(), '/');
  assert.equal(normalizeBasePath('/bluehexagons'), '/bluehexagons/');
  assert.equal(normalizeBasePath('/nested/site/'), '/nested/site/');
  for (const base of ['./', 'https://example.com/', '//cdn/', '/a//b/', '/a/../b/', '/site?query', '/site#hash', '/a\\b', '/a%2Fb']) {
    assert.throws(() => normalizeBasePath(base), /VITE_BASE_PATH/, base);
  }
});
