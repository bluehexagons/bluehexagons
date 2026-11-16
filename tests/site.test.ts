import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';
import { navigationLinks, pageFile, pages, resolveSitePath, siteOrigin } from '../src/site.ts';
import { openSourceGroups } from '../src/content/open-source.ts';
import { normalizeBasePath } from '../build/entries.ts';

const base = normalizeBasePath(process.env.VITE_BASE_PATH || '/');
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
    const html = readOutput(pageFile(page.path));
    assert.equal((html.match(/<title>/g) || []).length, 1, page.path);
    assert.ok(html.includes(`<title>${page.title}</title>`), page.path);
    assert.ok(html.includes(`content="${page.description}"`), page.path);
    assert.ok(html.includes(`rel="canonical" href="${siteOrigin}/${page.path}"`), page.path);
    assert.ok(html.includes(`property="og:url" content="${siteOrigin}/${page.path}"`), page.path);
    assert.ok(html.includes(`property="og:title" content="${page.title}"`), page.path);
    assert.ok(html.includes(`href="${base}assets/icon.png"`), page.path);
    assert.doesNotMatch(html, /<!-- site:|%BASE_URL%/);
    // Links and assets must resolve to real artifacts, including original media
    // used by gallery fallbacks and files copied unchanged from public/.
    const urls = [...html.matchAll(/(?:src|href)="([^"#]+)"/g)].map(match => match[1]);
    for (const url of urls.filter(url => url.startsWith(base) && !url.startsWith('//'))) {
      const path = decodeURIComponent(url.slice(base.length).split(/[?#]/)[0]) || 'index.html';
      assert.ok(existsSync(resolve('dist', path)), url);
    }
  }
});

test('public page IDs are unique and internal fragment links resolve', () => {
  const output = new Map(Object.values(pages).map(page => [pageFile(page.path), readOutput(pageFile(page.path))]));
  const idsByFile = new Map<string, Set<string>>();
  for (const [file, html] of output) {
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
    assert.equal(new Set(ids).size, ids.length, `${file}: duplicate IDs`);
    idsByFile.set(file, new Set(ids));
  }
  for (const page of Object.values(pages)) {
    const file = pageFile(page.path);
    for (const [, href] of output.get(file)!.matchAll(/\bhref="([^"]+)"/g)) {
      const url = new URL(href, `https://example.test${base}${page.path}`);
      if (url.origin !== 'https://example.test' || !url.hash || !url.pathname.startsWith(base)) continue;
      const target = pageFile(decodeURIComponent(url.pathname.slice(base.length)));
      if (!idsByFile.has(target)) continue;
      assert.ok(idsByFile.get(target)!.has(decodeURIComponent(url.hash.slice(1))), `${file}: ${href}`);
    }
  }
});

test('all public pages ship content and accessible navigation without JavaScript', () => {
  for (const page of Object.values(pages)) {
    const html = readOutput(pageFile(page.path));
    assert.equal((html.match(/<main\b/g) || []).length, 1);
    assert.equal((html.match(/<h1\b/g) || []).length, 1);
    assert.match(html, /<main id="main-content"[^>]*tabindex="-1">/);
    assert.match(html, /href="#main-content">Skip to main content/);
    assert.match(html, /<nav\b[^>]*aria-label="Primary navigation">/);
    assert.ok(html.includes(`href="${base}basaltwater.html"`));
    assert.ok(html.includes(`href="${base}#open-source"`));
    assert.doesNotMatch(html, /<site-link|<content-area|<page-header|<page-footer|id="app"/);
    if (page.layout === 'article') assert.doesNotMatch(html, /<script[^>]+type="module"/);
  }
  assert.match(readOutput('privacy.html'), /<h1>Privacy Policy<\/h1>/);
  assert.match(readOutput('privacy.html'), /Effective Date: April 11, 2025/);
  assert.ok(readOutput('basaltwater.html').includes(`href="${base}basaltwater.html" aria-current="page"`));
});

test('homepage includes full project descriptions and optional demos in static HTML', () => {
  const html = readOutput('index.html');
  for (const group of openSourceGroups) {
    for (const project of group.projects) {
      assert.ok(html.includes(`href="https://github.com/bluehexagons/${project.repository}"`), project.name);
      assert.ok(html.includes(project.description), project.name);
      if (project.demo) assert.ok(html.includes(`href="${project.demo}"`), project.name);
    }
  }
  assert.match(html, /id="basaltwater"/);
  assert.match(html, /id="open-source"/);
});

test('portfolio content retains career details, guide anchors, and usable gallery fallbacks', () => {
  const home = readOutput('index.html');
  assert.equal((home.match(/<article\b/g) || []).length, 10);
  assert.match(home, /Senior UI Engineer @ Zazzle.com/);
  assert.match(home, /Application Developer @ Dexter Solutions/);
  assert.match(home, /href="mailto:loren@bluehexagons.com"/);
  const game = readOutput('antistatic.html');
  for (const id of ['refresh', 'guide', 'energy', 'familiar', 'differences', 'shields-and-energy', 'controllers', 'control-rebinding']) {
    assert.ok(game.includes(`id="${id}"`), id);
  }
  for (const html of [home, game]) {
    const fallbackImages = [...html.matchAll(/<image-scroller\b[^>]*>([\s\S]*?)<\/image-scroller>/g)];
    assert.ok(fallbackImages.length > 0);
    for (const [, gallery] of fallbackImages) {
      const images = [...gallery.matchAll(/<img\b([^>]+)>/g)];
      assert.ok(images.length > 0);
      assert.equal((gallery.match(/<a\b/g) || []).length, images.length);
      for (const [, attrs] of images) {
        assert.match(attrs, /alt="[^"]+"/);
        const source = attrs.match(/src="([^"]+)"/)![1];
        assert.ok(source.startsWith(base), source);
        assert.ok(existsSync(resolve('dist', decodeURIComponent(source.slice(base.length)))), source);
      }
    }
    assert.doesNotMatch(html, /\{sitePath|\{' '\}|slot="content"/);
  }
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
