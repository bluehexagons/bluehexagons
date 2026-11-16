import assert from 'node:assert/strict';
import test from 'node:test';
import { renderHead } from '../build/site-html.ts';
import { pages } from '../src/site.ts';

test('shared metadata escapes authored text and preserves nested canonical URLs', () => {
  const html = renderHead({
    ...pages.home,
    path: 'projects/example/',
    title: 'A & "B" <project>',
    description: 'Tools & games: "example".',
  });
  assert.ok(html.includes('<title>A &amp; &quot;B&quot; &lt;project&gt;</title>'));
  assert.ok(html.includes('content="Tools &amp; games: &quot;example&quot;."'));
  assert.ok(html.includes('property="og:url" content="https://bluehexagons.com/projects/example/"'));
  assert.ok(html.includes('name="twitter:card" content="summary"'));
  assert.doesNotMatch(html, /<project>/);
});
