import path from 'path';
import { defineConfig, devices } from '@playwright/test';

// Load .env so CAN_CLIENT_ID etc. are available for conditional test skips
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

export default defineConfig({
  testDir: './e2e',
  forbidOnly: !!process.env.CI,
  timeout: 90_000,
  // Every example route mints its own resource per page load and /dispute is
  // mocked, so no test shares mutable server state.
  fullyParallel: true,
  workers: process.env.CI ? 4 : undefined,
  retries: process.env.CI ? 1 : 0,
  // Assertions wait on a real API with four workers hitting it at once; a
  // tokenize round trip overran 15s on CI. The 90s test timeout still bounds it.
  expect: { timeout: 30_000 },
  reporter: process.env.CI
    ? [['list'], ['html', { open: 'never' }]]
    : 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'pnpm start',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 120000,
  },
});
