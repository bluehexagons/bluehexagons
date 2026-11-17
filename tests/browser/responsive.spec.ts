import { expect, test } from '@playwright/test';

for (const viewport of [
  { width: 320, height: 568 },
  { width: 844, height: 390 },
  { width: 768, height: 1024 },
  { width: 1920, height: 1080 },
]) {
  test(`public pages reflow at ${viewport.width} × ${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    for (const path of ['./', 'portfolio.html', 'profile.html', 'antistatic.html', 'basaltwater.html', 'privacy.html']) {
      await page.goto(path);
      const navigation = page.getByRole('navigation', { name: 'Primary navigation' });
      for (const link of await navigation.getByRole('link').all()) {
        const bounds = await link.boundingBox();
        expect(bounds, path).not.toBeNull();
        expect(bounds!.height, `${path}: navigation touch target`).toBeGreaterThanOrEqual(44);
        expect(bounds!.x, path).toBeGreaterThanOrEqual(0);
        expect(bounds!.x + bounds!.width, path).toBeLessThanOrEqual(viewport.width);
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), path).toBe(true);
      const clippedText = await page.locator('main').evaluate(main =>
        [...main.querySelectorAll<HTMLElement>('h1, h2, h3, h4, p, li, dt, dd')]
          .filter(element => element.clientWidth > 0 && element.scrollWidth > element.clientWidth + 2)
          .map(element => element.textContent!.trim().slice(0, 80)));
      expect(clippedText, `${path}: clipped text`).toEqual([]);
    }
  });
}

test.describe('phone interactions', () => {
  test.use({ isMobile: true, hasTouch: true });

  test('native touch separates image swipes, page scrolling, and pinch zoom', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('antistatic.html');
    const gallery = page.locator('image-scroller[aria-label="Character artwork"]');
    const stage = gallery.locator('.gallery__stage');
    await stage.scrollIntoViewIfNeeded();
    const client = await page.context().newCDPSession(page);
    const gesture = async (frames: { x: number; y: number; id?: number }[][]) => {
      await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: frames[0] });
      for (const touches of frames.slice(1)) {
        await client.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: touches });
      }
      await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    };
    let bounds = (await stage.boundingBox())!;
    const startScroll = await page.evaluate(() => scrollY);
    await gesture(Array.from({ length: 7 }, (_, step) => [{
      x: bounds.x + bounds.width * (0.8 - step * 0.1), y: bounds.y + bounds.height / 2,
    }]));
    await expect(gallery.locator('.gallery__counter')).toHaveText('02 / 06');
    await expect(gallery.getByRole('dialog')).not.toBeVisible();
    expect(Math.abs(await page.evaluate(() => scrollY) - startScroll)).toBeLessThan(2);

    const beforeScroll = await page.evaluate(() => scrollY);
    bounds = (await stage.boundingBox())!;
    await gesture(Array.from({ length: 7 }, (_, step) => [{
      x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height * 0.8 - step * 20,
    }]));
    await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(beforeScroll + 50);
    await expect(gallery.locator('.gallery__counter')).toHaveText('02 / 06');

    await stage.scrollIntoViewIfNeeded();
    bounds = (await stage.boundingBox())!;
    const x = bounds.x + bounds.width / 2;
    const y = bounds.y + bounds.height / 2;
    await gesture([30, 40, 50, 60, 70, 80].map(offset => [
      { x: x - offset, y, id: 1 }, { x: x + offset, y, id: 2 },
    ]));
    await expect.poll(() => page.evaluate(() => visualViewport!.scale)).toBeGreaterThan(1.1);
    await expect(gallery.locator('.gallery__counter')).toHaveText('02 / 06');
    await expect(gallery.getByRole('dialog')).not.toBeVisible();
    await client.detach();
  });

  test('larger text reflows and keeps the gallery description and Close control usable', async ({ page }) => {
    for (const viewport of [{ width: 320, height: 568 }, { width: 568, height: 320 }]) {
      await page.setViewportSize(viewport);
      for (const path of ['./', 'profile.html', 'antistatic.html', 'basaltwater.html', 'privacy.html', 'portfolio.html']) {
        await page.goto(path);
        await page.evaluate(async () => {
          document.documentElement.style.fontSize = '200%';
          await document.fonts.ready;
        });
        const clipped = await page.locator('nav a, main h1, main h2, main h3, main h4, main p, main li').evaluateAll(elements =>
          elements.filter(element => element.clientWidth > 0 && element.scrollWidth > element.clientWidth + 2)
            .map(element => element.textContent!.trim().slice(0, 80)));
        expect(clipped, `${path} at ${viewport.width}px with larger text`).toEqual([]);
      }
      const gallery = page.locator('image-scroller[aria-label="Zazzle web and editing tools"]');
      await gallery.getByRole('link', { name: /^Enlarge image 1:/ }).click();
      const dialog = gallery.getByRole('dialog');
      const caption = dialog.getByRole('region', { name: 'Image description' });
      expect(await caption.evaluate(element => element.clientHeight / Number.parseFloat(getComputedStyle(element).lineHeight)))
        .toBeGreaterThanOrEqual(2);
      await caption.focus();
      await expect(caption).toBeInViewport();
      const close = dialog.getByRole('button', { name: 'Close enlarged view' });
      await expect(close).toBeInViewport();
      const original = dialog.getByRole('link', { name: 'Open original image (opens in a new tab)' });
      await original.focus();
      await expect(original).toBeInViewport();
      await expect(close).toBeInViewport();
      await original.press('Tab');
      await expect(close).toBeFocused();
      await close.click();
      await expect(dialog).not.toBeVisible();
    }
  });

  test('the enlarged viewer uses landscape height and keeps controls reachable', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('portfolio.html');
    const gallery = page.locator('image-scroller[aria-label="Zazzle web and editing tools"]');
    const stage = gallery.getByRole('link', { name: /^Enlarge image 1:/ });
    await stage.click();
    const dialog = gallery.getByRole('dialog');
    const close = dialog.getByRole('button', { name: 'Close enlarged view' });
    await expect(close).toBeFocused();

    for (const viewport of [{ width: 844, height: 390 }, { width: 667, height: 375 }, { width: 568, height: 320 }, { width: 390, height: 844 }]) {
      await page.setViewportSize(viewport);
      await expect(close).toBeInViewport();
      await expect(close).toBeFocused();
      const bounds = await dialog.boundingBox();
      expect(bounds!.x).toBeGreaterThanOrEqual(0);
      expect(bounds!.y).toBeGreaterThanOrEqual(0);
      expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(viewport.width);
      expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(viewport.height);
      if (viewport.width > viewport.height) {
        expect(await dialog.locator('.viewer__image_wrap').evaluate(element => element.clientHeight))
          .toBeGreaterThan(viewport.height * 0.75);
        await expect(dialog.getByRole('button', { name: 'Previous image', exact: true })).toBeInViewport();
        await expect(dialog.getByRole('button', { name: 'Next image', exact: true })).toBeInViewport();
        const caption = dialog.getByRole('region', { name: 'Image description' });
        await close.press('Tab');
        await expect(caption).toBeFocused();
        if (await caption.evaluate(element => element.scrollHeight > element.clientHeight)) {
          await caption.press('PageDown');
          await expect.poll(() => caption.evaluate(element => element.scrollTop)).toBeGreaterThan(0);
          const description = await caption.textContent();
          await caption.press('End');
          await expect(caption).toHaveText(description!);
        }
      }
      await dialog.getByRole('button', { name: 'Next image', exact: true }).click();
      await expect(dialog.locator('.viewer__caption')).toContainText('Image');
      expect(await dialog.locator('.viewer__caption').evaluate(element => element.scrollTop)).toBe(0);
      await expect(dialog.getByRole('link', { name: 'Open original image (opens in a new tab)' })).toBeInViewport();
      await close.focus();
    }
    await close.click();
    await expect(dialog).not.toBeVisible();
    await expect(gallery.locator('.gallery__stage')).toBeFocused();
  });
});
