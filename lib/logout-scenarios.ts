import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export type LogoutScenarioRow = {
  id: string;
  description: string;
  usernameEnvKey: string;
  passwordEnvKey: string;
};

export type ResolvedLogoutScenario = LogoutScenarioRow & {
  username: string;
  password: string;
};

function requireEnv(name: string, scenarioId: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(
      `Missing environment variable "${name}" required by logout scenario "${scenarioId}". ` +
        'Set it in your shell, a .env file (local), or CI secrets/variables.',
    );
  }
  return value;
}

export function loadResolvedLogoutScenarios(): ResolvedLogoutScenario[] {
  const raw = readFileSync(join(process.cwd(), 'data', 'logout-scenarios.json'), 'utf-8');
  const rows = JSON.parse(raw) as LogoutScenarioRow[];

  return rows.map((row) => ({
    ...row,
    username: requireEnv(row.usernameEnvKey, row.id),
    password: requireEnv(row.passwordEnvKey, row.id),
  }));
}
