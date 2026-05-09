import type { Page } from '@playwright/test';

/** Sauce Demo checkout step one — your information. */
export class CheckoutYourInformationPage {
  constructor(readonly page: Page) {}

  async fillForm(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.page.getByPlaceholder('First Name').fill(firstName);
    await this.page.getByPlaceholder('Last Name').fill(lastName);
    await this.page.getByPlaceholder('Zip/Postal Code').fill(postalCode);
  }

  async continue(): Promise<void> {
    await this.page.getByRole('button', { name: 'Continue' }).click();
  }
}
