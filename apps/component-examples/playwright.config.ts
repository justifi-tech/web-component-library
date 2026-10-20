import path from 'path';
import { defineConfig, devices } from '@playwright/test';

// Load .env so CAN_CLIENT_ID etc. are available for conditional test skips
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

export default defineConfig({
  testDir: './e2e',
  forbidOnly: !!process.env.CI,
  timeout: 90_000,
  // Every example route mints its own resource per page load (new checkout, new
  // business, new payment) and /dispute traffic is mocked, so no test shares
  // mutable server state and the suite is safe to run fully parallel.
  fullyParallel: true,
  workers: process.env.CI ? 4 : undefined,
  retries: process.env.CI ? 1 : 0,
  // These assertions wait on a real API over the network — a tokenize round
  // trip happens before the checkout error being asserted on can surface, for
  // instance. Playwright's 5s default is tuned for a local app and turns
  // slow-but-correct paths into flakes.
  expect: { timeout: 15_000 },
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
