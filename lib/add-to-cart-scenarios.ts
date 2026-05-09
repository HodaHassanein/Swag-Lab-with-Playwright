import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export type AddToCartScenarioRow = {
  id: string;
  description: string;
  usernameEnvKey: string;
  passwordEnvKey: string;
  expectedInventoryVisibleText?: string;
  /** 1-based positions on the inventory grid (e.g. 1 = first product, 5 = fifth). Names are read at runtime from the page. */
  productPositions: number[];
};

export type ResolvedAddToCartScenario = AddToCartScenarioRow & {
  username: string;
  password: string;
};

function requireEnv(name: string, scenarioId: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(
      `Missing environment variable "${name}" required by add-to-cart scenario "${scenarioId}". ` +
        'Set it in your shell, a .env file (local), or CI secrets/variables.',
    );
  }
  return value;
}

export function loadResolvedAddToCartScenarios(): ResolvedAddToCartScenario[] {
  const raw = readFileSync(join(process.cwd(), 'data', 'add-to-cart-scenarios.json'), 'utf-8');
  const rows = JSON.parse(raw) as AddToCartScenarioRow[];

  return rows.map((row) => ({
    ...row,
    username: requireEnv(row.usernameEnvKey, row.id),
    password: requireEnv(row.passwordEnvKey, row.id),
  }));
}
