import type { Page, Locator } from '@playwright/test';

/** Shopping cart page (e.g. /cart.html on Sauce Demo). */
export class CartPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(): Promise<void> {
    await this.page.goto('/cart.html');
  }

  cartItemRows(): Locator {
    return this.page.locator('.cart_item');
  }

  cartItemRowByProductName(name: string): Locator {
    return this.page.locator('.cart_item').filter({ hasText: name });
  }

  async removeItemByProductName(name: string): Promise<void> {
    await this.cartItemRowByProductName(name).getByRole('button', { name: 'Remove' }).click();
  }

  /** Remove every line item (Sauce Demo: one Remove button per row). */
  async removeAllItems(): Promise<void> {
    while ((await this.cartItemRows().count()) > 0) {
      await this.cartItemRows().first().getByRole('button', { name: 'Remove' }).click();
    }
  }

  /** Price label inside the cart row for that product (Sauce Demo: .inventory_item_price). */
  itemPriceByProductName(name: string): Locator {
    return this.cartItemRowByProductName(name).locator('.inventory_item_price');
  }

  async checkout(): Promise<void> {
    await this.page.getByRole('button', { name: 'Checkout' }).click();
  }
}
