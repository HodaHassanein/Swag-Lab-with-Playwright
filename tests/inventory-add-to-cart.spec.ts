import { test, expect } from './fixtures';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage, type PickedInventoryProduct } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { loadResolvedAddToCartScenarios } from '../lib/add-to-cart-scenarios';

const scenarios = loadResolvedAddToCartScenarios();

for (const scenario of scenarios) {
  test(`${scenario.id}: ${scenario.description}`, async ({ page }) => {
    const login = new LoginPage(page);
    const inventory = new InventoryPage(page);
    const cart = new CartPage(page);

    await login.goto();
    await login.login(scenario.username, scenario.password);

    await expect(page).toHaveURL(/inventory\.html/i);
    if (scenario.expectedInventoryVisibleText) {
      await expect(inventory.inventoryHeadingLabel(scenario.expectedInventoryVisibleText)).toBeVisible();
    }

    const chosenProducts: PickedInventoryProduct[] = [];
    for (const position of scenario.productPositions) {
      const picked = await inventory.addProductAtPositionToCart(position);
      expect(picked.name.length, `Product name at position ${position} should be non-empty`).toBeGreaterThan(0);
      expect(picked.price.length, `Product price at position ${position} should be non-empty`).toBeGreaterThan(0);
      chosenProducts.push(picked);
    }

    await expect(inventory.cartBadge()).toHaveText(String(chosenProducts.length));

    await inventory.openCart();
    await expect(page).toHaveURL(/cart\.html/i);

    for (const item of chosenProducts) {
      await expect(cart.cartItemRowByProductName(item.name)).toBeVisible();
      await expect(cart.itemPriceByProductName(item.name)).toHaveText(item.price);
    }
  });
}
