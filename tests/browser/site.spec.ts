import { expect, test, type Page } from '@playwright/test';

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('navigation, project credits, resume, and gallery fallbacks remain usable', async ({ page }) => {
    await page.goto('./');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Games, tools');
    await expect(page.getByRole('link', { name: 'Music by kikiala' })).toHaveAttribute('href', 'https://kikiala.bandcamp.com/');
    await page.getByRole('navigation', { name: 'Primary navigation' }).getByRole('link', { name: 'Portfolio', exact: true }).click();
    const gallery = page.locator('image-scroller').first();
    const original = gallery.locator('a').first();
    await expect(original).toBeVisible();
    const response = await page.request.get((await original.getAttribute('href'))!);
    expect(response.ok()).toBe(true);
    await page.getByRole('navigation', { name: 'Primary navigation' }).getByRole('link', { name: 'Profile / resume' }).click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Loren Crain');
    await expect(page.getByRole('heading', { name: 'Professional experience' })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
});

test('gallery keyboard navigation and modal focus work together', async ({ page }) => {
  await page.goto('antistatic.html');
  const gallery = page.locator('image-scroller[aria-label="Character artwork"]');
  const first = gallery.getByRole('button', { name: 'Show image 1: Silicon', exact: true });
  await first.focus();
  await first.press('ArrowRight');
  await expect(gallery.getByRole('button', { name: 'Show image 2: Carbon', exact: true })).toBeFocused();
  await page.keyboard.press('End');
  await expect(gallery.getByRole('button', { name: 'Show image 6: Rhodium', exact: true })).toBeFocused();
  await page.keyboard.press('Home');
  await expect(first).toBeFocused();
  await expect(first).toHaveAttribute('aria-pressed', 'true');

  const stage = gallery.getByRole('link', { name: 'Enlarge image 1: Silicon', exact: true });
  await stage.click();
  const dialog = gallery.getByRole('dialog');
  await expect(dialog).toBeVisible();
  const close = dialog.getByRole('button', { name: 'Close enlarged view' });
  await expect(close).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(dialog.getByRole('link', { name: 'Open original image (opens in a new tab)' })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(close).toBeFocused();
  await dialog.getByRole('button', { name: 'Next image' }).click();
  await expect(dialog.getByText('Image 2 of 6. Carbon', { exact: true })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(gallery.getByRole('link', { name: 'Enlarge image 2: Carbon', exact: true })).toBeFocused();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe('');
});

test('video playback loads only on activation and stops when changing images', async ({ page }) => {
  let playerRequests = 0;
  await page.route('https://www.youtube-nocookie.com/embed/**', async route => {
    playerRequests++;
    await route.fulfill({ contentType: 'text/html', body: '<!doctype html><title>Video fixture</title>' });
  });
  await page.goto('antistatic.html');
  const gallery = page.locator('image-scroller[aria-label="Antistatic"]');
  await gallery.getByRole('button', { name: 'Show video 2:', exact: false }).click();
  await expect(gallery.locator('iframe')).toHaveCount(0);
  expect(playerRequests).toBe(0);
  await gallery.getByRole('button', { name: 'Play video', exact: true }).click();
  await expect(gallery.locator('iframe')).toHaveAttribute('src', /youtube-nocookie\.com\/embed\/GtGyPGYhTdE\?/);
  await expect.poll(() => playerRequests).toBe(1);
  await gallery.getByRole('button', { name: 'Next image', exact: true }).click();
  await expect(gallery.locator('iframe')).toHaveCount(0);
  await expect(gallery.getByRole('link', { name: /^Enlarge image 3:/ })).toBeVisible();
});

test('fragment links reveal collapsed destinations, including the current fragment', async ({ page }) => {
  await page.goto('antistatic.html#refresh');
  const target = page.locator('#refresh');
  const section = page.locator('expandable-section').filter({ has: target }).last();
  const controls = await section.getByRole('button', { name: 'Show less character details', exact: true }).getAttribute('aria-controls');
  const toggle = section.locator(`button[aria-controls="${controls}"]`);
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(target).toBeInViewport();
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  // A same-hash link generates no hashchange event; its click must still reveal.
  await page.evaluate(() => {
    const link = document.createElement('a');
    link.href = '#refresh';
    link.textContent = 'Revisit refresh';
    document.body.append(link);
  });
  await page.getByRole('link', { name: 'Revisit refresh' }).click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(target).toBeInViewport();
});

async function expandableFixture(page: Page) {
  await page.goto('portfolio.html');
  await page.evaluate(async () => {
    await customElements.whenDefined('expandable-section');
    const section = document.createElement('expandable-section');
    section.id = 'resize-fixture';
    section.setAttribute('aria-label', 'Show more test content');
    const content = document.createElement('div');
    content.id = 'resize-content';
    content.style.height = '400px';
    section.append(content);
    document.body.append(section);
  });
  const section = page.locator('#resize-fixture');
  const toggle = section.getByRole('button', { includeHidden: true });
  return { section, toggle, content: page.locator('#resize-content') };
}

test('expandable controls reset their labels when content fits, then overflows again', async ({ page }) => {
  const { toggle, content } = await expandableFixture(page);
  await expect(toggle).toBeVisible();
  await toggle.click();
  await expect(toggle).toHaveAccessibleName('Show less test content');
  await content.evaluate(element => { element.style.height = '20px'; });
  await expect(toggle).toBeHidden();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle).toHaveAttribute('aria-label', 'Show more test content');
  await content.evaluate(element => { element.style.height = '400px'; });
  await expect(toggle).toBeVisible();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle).toHaveAccessibleName('Show more test content');
});

test('expandable sections preserve controls and keep resizing after reattachment', async ({ page }) => {
  const { section, toggle, content } = await expandableFixture(page);
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  const controls = await toggle.getAttribute('aria-controls');
  await section.evaluate(async element => {
    element.remove();
    element.setAttribute('aria-label', 'Show more updated content');
    element.append(document.createTextNode('Updated while detached.'));
    await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
    document.body.append(element);
  });
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(toggle).toHaveAttribute('aria-controls', controls!);
  await expect(toggle).toHaveAccessibleName('Show less updated content');
  await content.evaluate(element => { element.style.height = '650px'; });
  await expect.poll(() => section.evaluate(element => element.getBoundingClientRect().height)).toBeGreaterThan(650);
  await content.evaluate(element => { element.style.height = '20px'; });
  await expect(toggle).toBeHidden();
  await content.evaluate(element => { element.style.height = '400px'; });
  await expect(toggle).toBeVisible();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle).toHaveAccessibleName('Show more updated content');
});
