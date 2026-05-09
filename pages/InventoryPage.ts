import type { Page, Locator } from '@playwright/test';

export type PickedInventoryProduct = {
  name: string;
  price: string;
};

/** Sauce Demo inventory / products listing (post-login home). */
export class InventoryPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  inventoryHeadingLabel(label: string): Locator {
    return this.page.getByText(label, { exact: true });
  }

  private inventoryCards(): Locator {
    return this.page.locator('.inventory_item');
  }

  private productCardByName(name: string): Locator {
    return this.inventoryCards().filter({ hasText: name });
  }

  /**
   * 1-based index: 1 = first product on the grid, 5 = fifth, etc.
   * Reads name and price from the card, adds to cart, returns both for cart assertions.
   */
  async addProductAtPositionToCart(oneBasedIndex: number): Promise<PickedInventoryProduct> {
    const card = this.inventoryCards().nth(oneBasedIndex - 1);
    const name = (await card.locator('.inventory_item_name').textContent())?.trim() ?? '';
    const price = (await card.locator('.inventory_item_price').textContent())?.trim() ?? '';
    await card.getByRole('button', { name: 'Add to cart' }).click();
    return { name, price };
  }

  async addProductToCartByName(name: string): Promise<void> {
    const card = this.productCardByName(name);
    await card.getByRole('button', { name: 'Add to cart' }).click();
  }

  cartBadge(): Locator {
    return this.page.getByTestId('shopping-cart-badge');
  }

  async openCart(): Promise<void> {
    await this.page.getByTestId('shopping-cart-link').click();
  }
}
