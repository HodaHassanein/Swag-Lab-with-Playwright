import { test, expect } from './fixtures';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage, type PickedInventoryProduct } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { loadResolvedCartOperations } from '../lib/cart-operations-scenarios';

const operations = loadResolvedCartOperations();

for (const scenario of operations) {
  if (scenario.scenarioKind === 'remove_one_among_added') {
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
        expect(picked.name.length).toBeGreaterThan(0);
        chosenProducts.push(picked);
      }

      await inventory.openCart();
      await expect(page).toHaveURL(/cart\.html/i);

      const pickIndex = scenario.removeAmongAddedOneBasedIndex - 1;
      const nameToRemove = chosenProducts[pickIndex]!.name;

      for (const item of chosenProducts) {
        await expect(cart.cartItemRowByProductName(item.name)).toBeVisible();
      }

      await cart.removeItemByProductName(nameToRemove);
      await expect(cart.cartItemRowByProductName(nameToRemove)).toHaveCount(8);

      const remaining = chosenProducts.filter((p) => p.name !== nameToRemove);
      for (const item of remaining) {
        await expect(cart.cartItemRowByProductName(item.name)).toBeVisible();
      }

      await expect(inventory.cartBadge()).toHaveText(String(remaining.length));
    });
  } else {
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

      for (const position of scenario.productPositions) {
        const picked = await inventory.addProductAtPositionToCart(position);
        expect(picked.name.length).toBeGreaterThan(0);
      }

      await expect(inventory.cartBadge()).toHaveText(String(scenario.productPositions.length));

      await inventory.openCart();
      await expect(page).toHaveURL(/cart\.html/i);
      await expect(cart.cartItemRows()).toHaveCount(scenario.productPositions.length);

      await cart.removeAllItems();

      await expect(cart.cartItemRows()).toHaveCount(0);
      await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveCount(0);
    });
  }
}
