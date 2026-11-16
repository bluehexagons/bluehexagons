import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { build, createServer, preview, type InlineConfig } from 'vite';
import { htmlEntries } from '../build/entries.ts';
import { siteHtmlPlugin } from '../build/site-html.ts';
import { pageFile, pages, siteOrigin } from '../src/site.ts';

for (const base of ['/', '/bluehexagons/']) {
  test(`nested pages survive development, build, and preview at ${base}`, async t => {
    const project = mkdtempSync(join(tmpdir(), 'portfolio-nested-'));
    const root = join(project, 'src');
    t.after(() => rmSync(project, { recursive: true, force: true }));
    const registered = ['', 'projects/first/', 'projects/second.html'].map(path => ({
      ...pages.basaltwater, path, title: `Fixture ${path || 'home'}`,
    }));
    for (const page of registered) {
      const file = join(root, pageFile(page.path));
      mkdirSync(dirname(file), { recursive: true });
      writeFileSync(file, `<!doctype html><html lang="en"><head><meta charset="utf-8">
        <!-- site:head --><link rel="stylesheet" href="/fixture.css"></head><body>
        <!-- site:layout-start --><h1>${page.title}</h1>
        <a href="%BASE_URL%projects/first/#details">Nested destination</a><h2 id="details">Details</h2>
        <!-- site:layout-end --></body></html>`);
    }
    writeFileSync(join(root, 'fixture.css'), 'body { color: navy; }');
    mkdirSync(join(project, 'public/assets'), { recursive: true });
    writeFileSync(join(project, 'public/assets/icon.png'), 'fixture');

    const config = (): InlineConfig => ({
      configFile: false, root, base, appType: 'mpa', logLevel: 'silent', publicDir: '../public',
      plugins: [siteHtmlPlugin(root, registered)],
      build: { outDir: '../dist', emptyOutDir: true, rollupOptions: { input: htmlEntries(root, registered) } },
      server: { host: '127.0.0.1', port: 0 },
      preview: { host: '127.0.0.1', port: 0 },
      optimizeDeps: { noDiscovery: true },
    });
    const checkHtml = (html: string, page: typeof registered[number]) => {
      assert.ok(html.includes(`<title>${page.title}</title>`), page.path);
      assert.ok(html.includes(`rel="canonical" href="${siteOrigin}/${page.path}"`), page.path);
      assert.ok(html.includes(`href="${base}assets/icon.png"`), page.path);
      assert.ok(html.includes(`href="${base}projects/first/#details"`), page.path);
      assert.ok(html.includes(`href="${base}privacy.html"`), page.path);
      assert.match(html, /<main id="main-content"/);
      assert.doesNotMatch(html, /<!-- site:|%BASE_URL%/);
    };
    const checkHttp = async (origin: string) => {
      for (const page of registered) {
        // Directory routes and their explicit index aliases must render the same page.
        for (const path of new Set([page.path, pageFile(page.path)])) {
          const response = await fetch(`${origin}${base}${path}`);
          assert.equal(response.status, 200, path);
          checkHtml(await response.text(), page);
        }
      }
      const sitemap = await (await fetch(`${origin}${base}sitemap.xml`)).text();
      for (const page of registered) assert.ok(sitemap.includes(`<loc>${siteOrigin}/${page.path}</loc>`));
      assert.equal((await fetch(`${origin}${base}projects/missing/`)).status, 404);
    };

    const dev = await createServer(config());
    try {
      await dev.listen();
      const address = dev.httpServer!.address();
      assert.ok(address && typeof address === 'object');
      await checkHttp(`http://127.0.0.1:${address.port}`);
    } finally {
      await dev.close();
    }
    await build(config());
    for (const page of registered) checkHtml(readFileSync(join(project, 'dist', pageFile(page.path)), 'utf8'), page);
    const production = await preview(config());
    try {
      const address = production.httpServer.address();
      assert.ok(address && typeof address === 'object');
      await checkHttp(`http://127.0.0.1:${address.port}`);
    } finally {
      await production.close();
    }
  });
}
