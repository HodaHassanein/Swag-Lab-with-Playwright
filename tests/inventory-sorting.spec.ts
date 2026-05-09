import { test, expect } from './fixtures';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { loadResolvedSortingScenarios } from '../lib/sorting-scenarios';

const scenarios = loadResolvedSortingScenarios();

for (const scenario of scenarios) {
  test(`${scenario.id}: ${scenario.description}`, async ({ page }) => {
    const login = new LoginPage(page);
    const inventory = new InventoryPage(page);

    await login.goto();
    await login.login(scenario.username, scenario.password);
    await expect(page).toHaveURL(/inventory\.html/i);

    await inventory.selectSortOption(scenario.sortOption);

    if (scenario.sortBy === 'name') {
      const names = await inventory.getAllProductNames();
      const sorted = [...names].sort((a, b) =>
        scenario.order === 'asc' ? a.localeCompare(b) : b.localeCompare(a)
      );
      expect(names).toEqual(sorted);
    } else {
      const prices = await inventory.getAllProductPrices();
      const sorted = [...prices].sort((a, b) =>
        scenario.order === 'asc' ? a - b : b - a
      );
      expect(prices).toEqual(sorted);
    }
  });
}
