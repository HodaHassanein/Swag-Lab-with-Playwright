import { readFileSync } from 'node:fs';
import { join } from 'node:path';

type BaseCartOp = {
  id: string;
  description: string;
  usernameEnvKey: string;
  passwordEnvKey: string;
  expectedInventoryVisibleText?: string;
  productPositions: number[];
};

export type RemoveOneAmongAddedRow = BaseCartOp & {
  scenarioKind: 'remove_one_among_added';
  /** 1 = first product added in this run, 2 = second, … (must be ≤ number of productPositions). */
  removeAmongAddedOneBasedIndex: number;
};

export type EmptyCartRow = BaseCartOp & {
  scenarioKind: 'empty_cart';
};

export type CartOperationRow = RemoveOneAmongAddedRow | EmptyCartRow;

export type ResolvedRemoveOneAmongAdded = RemoveOneAmongAddedRow & {
  username: string;
  password: string;
};

export type ResolvedEmptyCart = EmptyCartRow & {
  username: string;
  password: string;
};

export type ResolvedCartOperation = ResolvedRemoveOneAmongAdded | ResolvedEmptyCart;

function requireEnv(name: string, scenarioId: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(
      `Missing environment variable "${name}" required by cart scenario "${scenarioId}". ` +
        'Set it in your shell, a .env file (local), or CI variables/secrets.',
    );
  }
  return value;
}

export function loadResolvedCartOperations(): ResolvedCartOperation[] {
  const raw = readFileSync(join(process.cwd(), 'data', 'cart-operations-scenarios.json'), 'utf-8');
  const rows = JSON.parse(raw) as CartOperationRow[];

  return rows.map((row) => {
    const username = requireEnv(row.usernameEnvKey, row.id);
    const password = requireEnv(row.passwordEnvKey, row.id);
    if (row.scenarioKind === 'remove_one_among_added') {
      const idx = row.removeAmongAddedOneBasedIndex;
      if (!Number.isInteger(idx) || idx < 1 || idx > row.productPositions.length) {
        throw new Error(
          `Cart scenario "${row.id}": removeAmongAddedOneBasedIndex must be an integer from 1 to ${row.productPositions.length} (got ${idx}).`,
        );
      }
      return { ...row, username, password };
    }
    return { ...row, username, password };
  });
}
