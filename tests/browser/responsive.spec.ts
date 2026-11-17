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

test.describe('phone orientation changes', () => {
  test.use({ isMobile: true, hasTouch: true });

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
