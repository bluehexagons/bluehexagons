import assert from 'node:assert/strict';
import test from 'node:test';
import { createServer } from 'vite';

for (const base of ['/', '/bluehexagons/']) {
  test(`development HTML and sitemap work at ${base}`, async () => {
    const server = await createServer({
      base,
      server: { port: 0, host: '127.0.0.1' },
      optimizeDeps: { noDiscovery: true },
    });
    try {
      await server.listen();
      const address = server.httpServer!.address();
      assert.ok(address && typeof address === 'object');
      const origin = `http://127.0.0.1:${address.port}`;
      for (const path of ['', 'antistatic.html', 'basaltwater.html', 'privacy.html', 'sitemap.xml']) {
        const response = await fetch(`${origin}${base}${path}`);
        assert.equal(response.status, 200, path);
        const html = await response.text();
        assert.equal(/<!-- site:|%BASE_URL%/.test(html), false, path);
        if (path.endsWith('.xml')) {
          assert.ok(html.includes('<urlset'), path);
          assert.ok(response.headers.get('content-type')?.includes('application/xml'));
        } else {
          assert.ok(html.includes(`href="${base}assets/icon.png"`), `${path}: icon base`);
          if (path === '') {
            assert.ok(html.includes(`href="${base}profile.md"`), 'profile base');
            assert.ok(html.includes(`href="${base}llms.txt"`), 'llms base');
          }
        }
      }
      for (const path of ['missing-page.html', 'missing-directory/']) {
        const response = await fetch(`${origin}${base}${path}`);
        assert.equal(response.status, 404, path);
      }
      for (const path of ['shop/', 'shop/admin.html', 'shop/success.html', '%73hop/', '%73hop/admin.html', 'shop%2fadmin.html']) {
        const response = await fetch(`${origin}${base}${path}`);
        assert.equal(response.status, process.env.VITE_SHOP === '1' ? 200 : 404, path);
      }
      if (process.env.VITE_SHOP !== '1') {
        for (const path of ['/shop/admin.html', '%2fshop/admin.html', 'x%2f..%2fshop/admin.html', 'shop%5cadmin.html']) {
          assert.equal((await fetch(`${origin}${base}${path}`)).status, 404, path);
        }
        await assert.rejects(
          server.transformIndexHtml('/shop/admin.html', '<!doctype html><title>Shop</title>'),
          /Missing page metadata: shop\/admin.html/,
        );
      }
      assert.equal((await fetch(`${origin}${base}%ZZ.html`)).status, 400, 'malformed URL');
      await assert.rejects(
        server.transformIndexHtml('/unregistered.html', '<!doctype html><title>Unregistered</title>'),
        /Missing page metadata: unregistered.html/,
      );
    } finally {
      await server.close();
    }
  });
}
