import { defineConfig } from '@playwright/test';
import { normalizeBasePath } from './build/entries.ts';

const base = normalizeBasePath(process.env.VITE_BASE_PATH || '/');
const baseURL = `http://127.0.0.1:4175${base}`;

export default defineConfig({
  testDir: './tests/browser',
  outputDir: './test-results/browser',
  forbidOnly: !!process.env.CI,
  fullyParallel: true,
  workers: 2,
  globalTimeout: 120_000,
  reporter: 'list',
  use: { baseURL, browserName: 'chromium', trace: 'retain-on-failure' },
  projects: [
    { name: 'desktop', testIgnore: 'responsive.spec.ts', use: { viewport: { width: 1280, height: 900 } } },
    { name: 'phone', testIgnore: 'responsive.spec.ts', use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
    { name: 'responsive', testMatch: 'responsive.spec.ts' },
  ],
  webServer: {
    command: 'npm run preview -- --host 127.0.0.1 --port 4175 --strictPort',
    url: baseURL,
    reuseExistingServer: false,
  },
});
