import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';
import { navigationLinks, pages, resolveSitePath, siteOrigin } from '../src/site.ts';
import { openSourceGroups } from '../src/content/open-source.ts';

const base = process.env.VITE_BASE_PATH || '/';
const readOutput = (path: string) => readFileSync(resolve('dist', path), 'utf8');

test('navigation handles project hosting, index aliases, fragments, and external links', () => {
  for (const prefix of ['/', '/bluehexagons/']) {
    for (const home of [prefix, `${prefix}index.html`]) {
      const links = navigationLinks(prefix, home);
      assert.deepEqual(links.filter(link => link.current).map(link => link.href), [prefix]);
      assert.equal(links.find(link => link.label === 'Open source')?.href, `${prefix}#open-source`);
      assert.equal(links.find(link => link.label === 'Clicker')?.href, 'https://clicker.bluehexagons.com');
    }
    const links = navigationLinks(prefix, `${prefix}basaltwater.html`);
    assert.deepEqual(links.filter(link => link.current).map(link => link.label), ['Basaltwater']);
    assert.equal(navigationLinks(prefix, `${prefix}privacy.html`).some(link => link.current), false);
  }
  assert.equal(resolveSitePath('/assets/icon.png', '/bluehexagons'), '/bluehexagons/assets/icon.png');
});

test('every public page has complete generated metadata and base-aware assets', () => {
  for (const page of Object.values(pages)) {
    const html = readOutput(page.path || 'index.html');
    assert.equal((html.match(/<title>/g) || []).length, 1, page.path);
    assert.ok(html.includes(`<title>${page.title}</title>`), page.path);
    assert.ok(html.includes(`content="${page.description}"`), page.path);
    assert.ok(html.includes(`rel="canonical" href="${siteOrigin}/${page.path}"`), page.path);
    assert.ok(html.includes(`href="${base}assets/icon.png"`), page.path);
    assert.doesNotMatch(html, /<!-- site:|%BASE_URL%/);
    // Local script and stylesheet references must resolve to real build artifacts.
    const urls = [...html.matchAll(/(?:src|href)="([^"#]+)"/g)].map(match => match[1]);
    for (const url of urls.filter(url => url.startsWith(base) && /\.(?:css|js)$/.test(url))) {
      assert.ok(existsSync(resolve('dist', url.slice(base.length))), url);
    }
  }
});

test('static pages ship content and accessible navigation without JavaScript', () => {
  for (const path of ['privacy.html', 'basaltwater.html']) {
    const html = readOutput(path);
    assert.match(html, /<main id="main-content" tabindex="-1">/);
    assert.match(html, /href="#main-content">Skip to main content/);
    assert.match(html, /<nav aria-label="Primary navigation">/);
    assert.ok(html.includes(`href="${base}basaltwater.html"`));
    assert.ok(html.includes(`href="${base}#open-source"`));
    assert.doesNotMatch(html, /<script[^>]+type="module"|<site-link|<content-area/);
  }
  assert.match(readOutput('privacy.html'), /<h1>Privacy Policy<\/h1>/);
  assert.match(readOutput('privacy.html'), /Effective Date: April 11, 2025/);
  assert.ok(readOutput('basaltwater.html').includes(`href="${base}basaltwater.html" aria-current="page"`));
});

test('homepage fallback includes every curated open-source project', () => {
  const html = readOutput('index.html');
  for (const group of openSourceGroups) {
    for (const project of group.projects) {
      assert.ok(html.includes(`href="https://github.com/bluehexagons/${project.repository}"`), project.name);
    }
  }
  assert.match(html, /id="basaltwater"/);
  assert.match(html, /id="open-source"/);
});

test('sitemap uses canonical URLs and excludes optional shop routes', () => {
  const sitemap = readOutput('sitemap.xml');
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
  assert.deepEqual(urls, Object.values(pages).filter(page => page.sitemap).map(page => `${siteOrigin}/${page.path}`));
  assert.doesNotMatch(sitemap, /shop/);
});

test('shop artifacts appear only in an explicitly enabled build', () => {
  const enabled = process.env.VITE_SHOP === '1';
  for (const path of ['shop/index.html', 'shop/admin.html', 'shop/success.html']) {
    assert.equal(existsSync(resolve('dist', path)), enabled, path);
    if (enabled) assert.match(readOutput(path), /name="robots" content="noindex"/);
  }
});
