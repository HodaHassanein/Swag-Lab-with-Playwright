import type { Page } from '@playwright/test';

/** Global burger menu (Sauce Demo) — open menu + logout from inventory/cart/etc. */
export class AppMenuPage {
  constructor(readonly page: Page) {}

  async openMenu(): Promise<void> {
    await this.page.getByRole('button', { name: 'Open Menu' }).click();
  }

  async logout(): Promise<void> {
    await this.openMenu();
    await this.page.getByRole('link', { name: 'Logout' }).click();
  }
}
