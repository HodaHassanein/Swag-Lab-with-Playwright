import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export type CheckoutScenarioRow = {
  id: string;
  description: string;
  usernameEnvKey: string;
  passwordEnvKey: string;
  expectedInventoryVisibleText?: string;
  productPositions: number[];
  firstNameEnvKey: string;
  lastNameEnvKey: string;
  postalCodeEnvKey: string;
  expectedCompleteHeaderContains: string;
};

export type ResolvedCheckoutScenario = CheckoutScenarioRow & {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  postalCode: string;
};

function requireEnv(name: string, scenarioId: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(
      `Missing environment variable "${name}" required by checkout scenario "${scenarioId}". ` +
        'Set it in your shell, a .env file (local), or CI secrets/variables.',
    );
  }
  return value;
}

export function loadResolvedCheckoutScenarios(): ResolvedCheckoutScenario[] {
  const raw = readFileSync(join(process.cwd(), 'data', 'checkout-scenarios.json'), 'utf-8');
  const rows = JSON.parse(raw) as CheckoutScenarioRow[];

  return rows.map((row) => ({
    ...row,
    username: requireEnv(row.usernameEnvKey, row.id),
    password: requireEnv(row.passwordEnvKey, row.id),
    firstName: requireEnv(row.firstNameEnvKey, row.id),
    lastName: requireEnv(row.lastNameEnvKey, row.id),
    postalCode: requireEnv(row.postalCodeEnvKey, row.id),
  }));
}
