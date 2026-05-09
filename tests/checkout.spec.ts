import { test, expect } from './fixtures';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage, type PickedInventoryProduct } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutYourInformationPage } from '../pages/CheckoutYourInformationPage';
import { CheckoutOverviewPage } from '../pages/CheckoutOverviewPage';
import { CheckoutCompletePage } from '../pages/CheckoutCompletePage';
import { loadResolvedCheckoutScenarios } from '../lib/checkout-scenarios';

const scenarios = loadResolvedCheckoutScenarios();

for (const scenario of scenarios) {
  test(`${scenario.id}: ${scenario.description}`, async ({ page }) => {
    const login = new LoginPage(page);
    const inventory = new InventoryPage(page);
    const cart = new CartPage(page);
    const checkoutInfo = new CheckoutYourInformationPage(page);
    const checkoutOverview = new CheckoutOverviewPage(page);
    const checkoutComplete = new CheckoutCompletePage(page);

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
      expect(picked.price.length).toBeGreaterThan(0);
      chosenProducts.push(picked);
    }

    await expect(inventory.cartBadge()).toHaveText(String(chosenProducts.length));

    await inventory.openCart();
    await expect(page).toHaveURL(/cart\.html/i);

    for (const item of chosenProducts) {
      await expect(cart.cartItemRowByProductName(item.name)).toBeVisible();
      await expect(cart.itemPriceByProductName(item.name)).toHaveText(item.price);
    }

    await cart.checkout();
    await expect(page).toHaveURL(/checkout-step-one\.html/i);

    await checkoutInfo.fillForm(scenario.firstName, scenario.lastName, scenario.postalCode);
    await checkoutInfo.continue();
    await expect(page).toHaveURL(/checkout-step-two\.html/i);

    await checkoutOverview.finish();
    await expect(page).toHaveURL(/checkout-complete\.html/i);

    await expect(checkoutComplete.completeHeader()).toContainText(scenario.expectedCompleteHeaderContains);

    await checkoutComplete.backToProducts();
    await expect(page).toHaveURL(/inventory\.html/i);
    if (scenario.expectedInventoryVisibleText) {
      await expect(inventory.inventoryHeadingLabel(scenario.expectedInventoryVisibleText)).toBeVisible();
    }
  });
}
