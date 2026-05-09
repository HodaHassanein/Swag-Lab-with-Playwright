import { test, expect } from './fixtures';
import { LoginPage } from '../pages/LoginPage';
import { AppMenuPage } from '../pages/AppMenuPage';
import { loadResolvedLogoutScenarios } from '../lib/logout-scenarios';

const scenarios = loadResolvedLogoutScenarios();

for (const scenario of scenarios) {
  test(`${scenario.id}: ${scenario.description}`, async ({ page }) => {
    const login = new LoginPage(page);
    const appMenu = new AppMenuPage(page);

    await login.goto();
    await login.login(scenario.username, scenario.password);

    await expect(page).toHaveURL(/inventory\.html/i);
    await expect(login.usernameInput).not.toBeVisible();

    await appMenu.logout();

    await expect(page).not.toHaveURL(/inventory\.html/i);
    await expect(page).toHaveURL(/\//);
    await expect(login.usernameInput).toBeVisible();
    await expect(login.passwordInput).toBeVisible();
    await expect(login.loginButton).toBeVisible();
  });
}
