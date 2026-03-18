import path from 'path';
import { defineConfig, devices } from '@playwright/test';

// Load .env so CAN_CLIENT_ID etc. are available for conditional test skips
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

export default defineConfig({
  testDir: './e2e',
  forbidOnly: !!process.env.CI,
  timeout: 90_000,
  workers: 1,
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
