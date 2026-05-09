import type { FullConfig } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Runs once after the full test run. Removes saved auth/session artifacts if present.
 */
export default async function globalTeardown(_config: FullConfig): Promise<void> {
  const authDir = path.join(process.cwd(), 'playwright', '.auth');
  if (fs.existsSync(authDir)) {
    fs.rmSync(authDir, { recursive: true, force: true });
  }
}
