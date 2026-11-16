import assert from 'node:assert/strict';
import test from 'node:test';
import { preview } from 'vite';
import { pages } from '../src/site.ts';
import { escapeHtml } from '../build/html.ts';
import { renderProfileMarkdown } from '../build/content.ts';

test('production preview serves public pages and real 404s with the selected feature mode', async () => {
  const server = await preview({ preview: { port: 0, host: '127.0.0.1' } });
  try {
    const address = server.httpServer.address();
    assert.ok(address && typeof address === 'object');
    const origin = `http://127.0.0.1:${address.port}`;
    const base = server.config.base;
    for (const page of Object.values(pages)) {
      const response = await fetch(`${origin}${base}${page.path}`);
      assert.equal(response.status, 200, page.path);
      assert.ok((await response.text()).includes(escapeHtml(page.title)), page.path);
    }
    const profile = await fetch(`${origin}${base}profile.md`);
    assert.equal(profile.status, 200);
    assert.equal(await profile.text(), renderProfileMarkdown());
    for (const path of ['missing-page.html', 'missing-directory/']) {
      assert.equal((await fetch(`${origin}${base}${path}`)).status, 404, path);
    }
    for (const path of ['shop/', 'shop/admin.html', 'shop/success.html']) {
      assert.equal((await fetch(`${origin}${base}${path}`)).status, process.env.VITE_SHOP === '1' ? 200 : 404, path);
    }
  } finally {
    await server.close();
  }
});
