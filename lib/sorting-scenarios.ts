import fs from 'node:fs';
import path from 'node:path';

export type SortingScenarioRow = {
  id: string;
  description: string;
  usernameEnvKey: string;
  passwordEnvKey: string;
  sortOption: 'az' | 'za' | 'lohi' | 'hilo';
  sortLabel: string;
  sortBy: 'name' | 'price';
  order: 'asc' | 'desc';
};

export type ResolvedSortingScenario = SortingScenarioRow & {
  username: string;
  password: string;
};

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing environment variable '${key}'`);
  return value;
}

export function loadResolvedSortingScenarios(): ResolvedSortingScenario[] {
  const filePath = path.join(process.cwd(), 'data', 'sorting-scenarios.json');
  const rows: SortingScenarioRow[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  return rows.map((row) => ({
    ...row,
    username: requireEnv(row.usernameEnvKey),
    password: requireEnv(row.passwordEnvKey),
  }));
}
