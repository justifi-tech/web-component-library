import { test, expect, webkit, Browser, Page } from '@playwright/test';
import * as BrowserStackLocal from 'browserstack-local';

const BROWSERSTACK_USERNAME = process.env.BROWSERSTACK_USERNAME;
const BROWSERSTACK_ACCESS_KEY = process.env.BROWSERSTACK_ACCESS_KEY;

const hasCreds = !!(BROWSERSTACK_USERNAME && BROWSERSTACK_ACCESS_KEY);

let bsLocal: BrowserStackLocal.Local;

// --- BrowserStack executor helpers ---

async function bsExecutor(page: Page, action: string, args: Record<string, unknown>) {
  await page.evaluate(
    (_cmd) => {},
    `browserstack_executor: ${JSON.stringify({ action, arguments: args })}`,
  );
}

async function clickApplePay(page: Page) {
  await bsExecutor(page, 'ios-click', {
    xpath: "//*[@name='Apple Pay']",
  });
}

async function fillApplePayDetails(page: Page) {
  await bsExecutor(page, 'applePayDetails', {
    shippingDetails: {
      firstName: 'Jane',
      lastName: 'Doe',
      street: '123 Main St',
      city: 'Minneapolis',
      state: 'MN',
      postCode: '55114',
      country: 'US',
    },
    billingDetails: {
      firstName: 'Jane',
      lastName: 'Doe',
      street: '123 Main St',
      city: 'Minneapolis',
      state: 'MN',
      postCode: '55114',
      country: 'US',
    },
    contact: {
      email: 'jane.doe@example.com',
      phone: '+1-612-555-0100',
    },
  });
}

async function confirmApplePay(page: Page) {
  await bsExecutor(page, 'applePay', { confirmPayment: 'true' });
}

async function enterPasscode(page: Page) {
  await page.keyboard.type('123456');
}

// --- Tests ---

test.describe('Apple Pay (BrowserStack)', () => {
  test.skip(!hasCreds, 'BROWSERSTACK_USERNAME or BROWSERSTACK_ACCESS_KEY not set');

  test.beforeAll(async () => {
    bsLocal = new BrowserStackLocal.Local();
    await new Promise<void>((resolve, reject) => {
      bsLocal.start(
        { key: BROWSERSTACK_ACCESS_KEY, forceLocal: true },
        (err) => (err ? reject(err) : resolve()),
      );
    });
  });

  test.afterAll(async () => {
    if (bsLocal?.isRunning()) {
      await new Promise<void>((resolve) => bsLocal.stop(() => resolve()));
    }
  });

  test('completes Apple Pay checkout on iPhone', async () => {
    let browser: Browser | undefined;

    try {
      const caps = {
        device: 'iPhone 15',
        os_version: '17',
        real_mobile: 'true',
        browser: 'safari',
        name: 'Apple Pay checkout test',
        build: process.env.GITHUB_RUN_ID || 'local',
        'browserstack.username': BROWSERSTACK_USERNAME,
        'browserstack.accessKey': BROWSERSTACK_ACCESS_KEY,
        'browserstack.local': 'true',
        enableApplePay: true,
        nativeWebTap: true,
        applePayPreferredNetworks: ['Visa', 'Mastercard'],
      };

      const wsEndpoint =
        `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(JSON.stringify(caps))}`;

      browser = await webkit.connect(wsEndpoint);
      const context = await browser.newContext();
      const page = await context.newPage();

      // Intercept checkout GET to enable apple_payments
      await page.route('**/v1/checkouts/*', async (route, request) => {
        if (request.method() !== 'GET') return route.continue();
        const response = await route.fetch();
        const json = await response.json();
        json.data.payment_settings.apple_payments = true;
        await route.fulfill({ response, json });
      });

      await page.goto('http://localhost:3000/modular-checkout');
      await page.waitForSelector('justifi-modular-checkout');
      // Extra wait for Apple Pay SDK load + initialization
      await page.waitForTimeout(5000);

      // Assert justifi-apple-pay element exists
      const applePay = page.locator('justifi-apple-pay');
      await expect(applePay).toBeAttached();

      // Check Apple Pay button renders inside shadow DOM
      const applePayButton = await page.evaluate(() => {
        const el = document.querySelector('justifi-apple-pay');
        if (!el?.shadowRoot) return null;
        const btn = el.shadowRoot.querySelector(
          'button[aria-label="Pay with Apple Pay"]',
        ) as HTMLButtonElement | null;
        return btn ? { exists: true, disabled: btn.disabled } : null;
      });

      expect(applePayButton).not.toBeNull();
      expect(applePayButton!.exists).toBe(true);

      await page.screenshot({ path: 'e2e-results/apple-pay-rendered.png' });

      // Set up response listener for checkout completion
      const responsePromise = page.waitForResponse(
        (resp) =>
          resp.url().includes('/v1/checkouts/') &&
          resp.url().endsWith('/complete'),
      );

      // Trigger Apple Pay payment flow
      await clickApplePay(page);
      await page.waitForTimeout(2000);

      await fillApplePayDetails(page);
      await page.waitForTimeout(1000);

      await confirmApplePay(page);
      await page.waitForTimeout(1000);

      await enterPasscode(page);

      // Verify checkout completion
      const completeResponse = await responsePromise;
      expect(completeResponse.status()).toBe(200);

      await page.screenshot({ path: 'e2e-results/apple-pay-completed.png' });
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  });
});
