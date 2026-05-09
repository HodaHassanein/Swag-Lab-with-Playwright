import type { Page, Locator } from '@playwright/test';

/** Sauce Demo checkout complete — thank you page. */
export class CheckoutCompletePage {
  constructor(readonly page: Page) {}

  completeHeader(): Locator {
    return this.page.getByTestId('complete-header');
  }

  /** Returns to the products (inventory) home after order is placed. */
  async backToProducts(): Promise<void> {
    await this.page.getByTestId('back-to-products').click();
  }
}
