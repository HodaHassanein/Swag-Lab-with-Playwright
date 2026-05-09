import { test, expect } from './fixtures';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { loadResolvedLoginScenarios } from '../lib/login-scenarios';

const scenarios = loadResolvedLoginScenarios();

for (const scenario of scenarios) {
  test(`${scenario.id}: ${scenario.description}`, async ({ page }) => {
    const login = new LoginPage(page);
    const inventory = new InventoryPage(page);
    await login.goto();
    await login.login(scenario.username, scenario.password);

    if (scenario.expectSuccess) {
      await expect(page).toHaveURL(new RegExp(scenario.expectedInventoryUrlPart!, 'i'));
      if (scenario.expectedPageTitlePart) {
        await expect(page).toHaveTitle(new RegExp(scenario.expectedPageTitlePart, 'i'));
      }
      if (scenario.expectedInventoryVisibleText) {
        await expect(inventory.inventoryHeadingLabel(scenario.expectedInventoryVisibleText)).toBeVisible();
      }
    } else {
      await expect(login.errorBanner).toContainText(scenario.expectedErrorContains!);
      await expect(page).not.toHaveURL(/inventory\.html/i);
      if (scenario.expectedInventoryVisibleText) {
        await expect(inventory.inventoryHeadingLabel(scenario.expectedInventoryVisibleText)).not.toBeVisible();
      }
    }
  });
}
