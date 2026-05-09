import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export type LoginScenarioRow = {
  id: string;
  description: string;
  usernameEnvKey: string;
  passwordEnvKey: string;
  expectSuccess: boolean;
  expectedInventoryUrlPart?: string;
  expectedPageTitlePart?: string;
  /** Main label shown on the inventory/home page (not the browser tab title). */
  expectedInventoryVisibleText?: string;
  expectedErrorContains?: string;
};

export type ResolvedLoginScenario = LoginScenarioRow & {
  username: string;
  password: string;
};

function requireEnv(name: string, scenarioId: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(
      `Missing environment variable "${name}" required by login scenario "${scenarioId}". ` +
        'Set it in your shell, a .env file (local), or CI secrets/variables.',
    );
  }
  return value;
}

export function loadResolvedLoginScenarios(): ResolvedLoginScenario[] {
  const raw = readFileSync(join(process.cwd(), 'data', 'login-scenarios.json'), 'utf-8');
  const rows = JSON.parse(raw) as LoginScenarioRow[];

  return rows.map((row) => ({
    ...row,
    username: requireEnv(row.usernameEnvKey, row.id),
    password: requireEnv(row.passwordEnvKey, row.id),
  }));
}
