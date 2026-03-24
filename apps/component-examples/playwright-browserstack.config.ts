import path from 'path';
import { defineConfig } from '@playwright/test';

require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

export default defineConfig({
  testDir: './e2e',
  testMatch: '**/*-browserstack.spec.ts',
  forbidOnly: !!process.env.CI,
  timeout: 300_000,
  workers: 1,
  reporter: process.env.CI
    ? [['list'], ['html', { open: 'never' }]]
    : 'html',
  use: {
    trace: 'retain-on-failure',
  },
});
