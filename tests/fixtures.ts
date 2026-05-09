import { test as base } from '@playwright/test';

/**
 * Clears cookies and web storage after each test so no session leaks to the next test
 * (each test already gets its own context; this makes teardown explicit).
 */
export const test = base.extend({
  page: async ({ page }, use) => {
    await use(page);

    const ctx = page.context();
    await ctx.clearCookies();

    if (!page.isClosed()) {
      await page
        .evaluate(() => {
          try {
            localStorage.clear();
            sessionStorage.clear();
          } catch {
            /* e.g. not on a document with storage */
          }
        })
        .catch(() => {});
    }
  },
});

export { expect } from '@playwright/test';
