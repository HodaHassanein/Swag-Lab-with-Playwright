import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

const baseURL = process.env.BASE_URL?.trim() || 'https://www.saucedemo.com';

/** ms delay between browser actions; set E2E_SLOW_MO in .env for demos (e.g. 400). 0 = full speed. */
const slowMoMs = (() => {
  const n = Number.parseInt(process.env.E2E_SLOW_MO ?? '0', 10);
  return Number.isFinite(n) && n > 0 ? n : 0;
})();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  globalTeardown: require.resolve('./global-teardown.ts'),
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Always continue running remaining tests even if some fail */
  retries: process.env.CI ? 1 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Always emit HTML under playwright-report/ + list summary; open report locally after each run */
  reporter: [
    ['list'],
    [
      'html',
      {
        outputFolder: 'playwright-report',
        open: process.env.CI ? 'never' : 'always',
      },
    ],
    ...(process.env.CI ? [['json', { outputFile: 'test-results/results.json' }] as const] : []),
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    baseURL,
    /* Sauce Demo uses data-test, not data-testid */
    testIdAttribute: 'data-test',
    trace: 'on-first-retry',
    /* Saves PNG under test-results/ when a test fails (see Playwright docs: test-results folder) */
    screenshot: 'only-on-failure',
    /* Slows each operation by N ms (good for live demos; use E2E_SLOW_MO). */
    launchOptions: {
      slowMo: slowMoMs,
    },
  },

  projects: [
    {
      name: 'Chrome',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },
    {
      name: 'Edge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
    },
  ],

});
