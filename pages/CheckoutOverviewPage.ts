import type { Page } from '@playwright/test';

/** Sauce Demo checkout step two — overview before finish. */
export class CheckoutOverviewPage {
  constructor(readonly page: Page) {}

  async finish(): Promise<void> {
    await this.page.getByRole('button', { name: 'Finish' }).click();
  }
}
