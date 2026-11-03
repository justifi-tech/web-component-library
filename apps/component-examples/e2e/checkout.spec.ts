import { test, expect, type Page } from '@playwright/test';
import {
  fillIframeInput,
  waitForComponent,
  waitForBankAccountForm,
  waitForBankAccountFieldsSynced,
  waitForCardForm,
  waitForCardFieldsSynced,
  listenForErrorEvent,
  TEST_DATA,
} from './helpers';

test.describe('Checkout Component', () => {
  test('should complete checkout with bank account', async ({ page }) => {
    await page.goto('/checkout');
    await waitForComponent(page, 'justifi-checkout');

    await page.getByRole('radio', { name: 'New bank account' }).click();
    await waitForBankAccountForm(page);

    await page.getByTestId('fill-billing-form-button').click();
    await expect(page.getByRole('textbox', { name: 'Full Name' })).toHaveValue(
      'John Doe',
    );

    await fillIframeInput(
      page,
      'routingNumber',
      TEST_DATA.bankAccount.routingNumber,
    );
    await fillIframeInput(
      page,
      'accountNumber',
      TEST_DATA.bankAccount.accountNumber,
    );

    await waitForBankAccountFieldsSynced(page);

    const errorPromise = listenForErrorEvent(page, 'justifi-checkout');
    const completeResponsePromise = page.waitForResponse(
      (resp) =>
        resp.url().includes('/v1/checkouts/') &&
        resp.url().endsWith('/complete') &&
        resp.request().method() === 'POST',
    );

    await page.getByRole('button', { name: 'Pay', exact: true }).click();

    const result = await Promise.race([
      completeResponsePromise.then((resp) => ({
        type: 'success' as const,
        resp,
      })),
      errorPromise.then((err) => ({ type: 'error' as const, err })),
    ]);

    if (result.type === 'error') {
      throw new Error(
        `Checkout failed before /complete was called: ${result.err}`,
      );
    }

    const completeResponse = result.resp;
    const body = await completeResponse.json();

    expect(completeResponse.status()).toBe(201);
    expect(body.data.id).toMatch(/^chc_/);
    expect(['succeeded', 'pending']).toContain(body.data.payment_status);
    expect(body.data.payment_response.data.amount).toBe(1799);
  });

  test('should complete checkout with credit card', async ({ page }) => {
    await page.goto('/checkout');
    await waitForComponent(page, 'justifi-checkout');

    await page.getByRole('radio', { name: 'New credit or debit card' }).click();
    await waitForCardForm(page);

    await fillIframeInput(page, 'cardNumber', TEST_DATA.card.number);
    await fillIframeInput(
      page,
      'expirationMonth',
      TEST_DATA.card.expirationMonth,
    );
    await fillIframeInput(
      page,
      'expirationYear',
      TEST_DATA.card.expirationYear,
    );
    await fillIframeInput(page, 'CVV', TEST_DATA.card.cvv);

    await page
      .getByRole('textbox', { name: 'Postal Code' })
      .fill(TEST_DATA.postalCodes.minneapolis);

    await waitForCardFieldsSynced(page);

    const errorPromise = listenForErrorEvent(page, 'justifi-checkout');
    const completeResponsePromise = page.waitForResponse(
      (resp) =>
        resp.url().includes('/v1/checkouts/') &&
        resp.url().endsWith('/complete') &&
        resp.request().method() === 'POST',
    );

    await page.getByRole('button', { name: 'Pay', exact: true }).click();

    const result = await Promise.race([
      completeResponsePromise.then((resp) => ({
        type: 'success' as const,
        resp,
      })),
      errorPromise.then((err) => ({ type: 'error' as const, err })),
    ]);

    if (result.type === 'error') {
      throw new Error(
        `Checkout failed before /complete was called: ${result.err}`,
      );
    }

    const completeResponse = result.resp;
    const body = await completeResponse.json();

    expect(completeResponse.status()).toBe(201);
    expect(body.data.id).toMatch(/^chc_/);
    expect(body.data.payment_status).toBe('succeeded');
    expect(body.data.payment_response.data.amount).toBe(1799);
  });

  // Requires PAYMENT_METHOD_GROUP_ID env with saved payment methods
  test('should complete checkout with saved payment method', async ({
    page,
  }) => {
    await page.goto('/checkout');
    await waitForComponent(page, 'justifi-checkout');

    const savedMethodLocator = page
      .getByRole('radio')
      .filter({ hasText: /\*\d{4}/ });
    if ((await savedMethodLocator.count()) === 0) {
      test.skip(true, 'No saved payment methods - set PAYMENT_METHOD_GROUP_ID');
    }

    await savedMethodLocator.first().click();
    await expect(
      page.getByRole('button', { name: 'Pay', exact: true }),
    ).toBeEnabled();

    const errorPromise = listenForErrorEvent(page, 'justifi-checkout');
    const completeResponsePromise = page.waitForResponse(
      (resp) =>
        resp.url().includes('/v1/checkouts/') &&
        resp.url().endsWith('/complete') &&
        resp.request().method() === 'POST',
    );

    await page.getByRole('button', { name: 'Pay', exact: true }).click();

    const result = await Promise.race([
      completeResponsePromise.then((resp) => ({
        type: 'success' as const,
        resp,
      })),
      errorPromise.then((err) => ({ type: 'error' as const, err })),
    ]);

    if (result.type === 'error') {
      throw new Error(
        `Checkout failed before /complete was called: ${result.err}`,
      );
    }

    const completeResponse = result.resp;
    const body = await completeResponse.json();

    expect(completeResponse.status()).toBe(201);
    expect(body.data.id).toMatch(/^chc_/);
    expect(body.data.payment_status).toBe('succeeded');
  });

  // Documents expected behavior; may fail until isSubmitting fully blocks rapid clicks
  test.fixme(
    'should prevent double-submit on rapid Pay clicks',
    async ({ page }) => {
      await page.goto('/checkout');
      await waitForComponent(page, 'justifi-checkout');

      await page
        .getByRole('radio', { name: 'New credit or debit card' })
        .click();
      await fillIframeInput(page, 'cardNumber', TEST_DATA.card.number);
      await fillIframeInput(
        page,
        'expirationMonth',
        TEST_DATA.card.expirationMonth,
      );
      await fillIframeInput(
        page,
        'expirationYear',
        TEST_DATA.card.expirationYear,
      );
      await fillIframeInput(page, 'CVV', TEST_DATA.card.cvv);
      await page
        .getByRole('textbox', { name: 'Postal Code' })
        .fill(TEST_DATA.postalCodes.minneapolis);
      await page.waitForTimeout(2000);

      const completeRequests: string[] = [];
      page.on('request', (req) => {
        if (
          req.url().includes('/v1/checkouts/') &&
          req.url().endsWith('/complete') &&
          req.method() === 'POST'
        ) {
          completeRequests.push(req.url());
        }
      });

      const payButton = page.getByRole('button', { name: 'Pay', exact: true });
      await payButton.click();
      await payButton.click();
      await payButton.click();

      await page.waitForTimeout(5000);

      expect(completeRequests.length).toBe(1);
    },
  );

  test('should surface error and re-enable Pay button on API failure', async ({
    page,
  }) => {
    await page.route('**/v1/checkouts/*/complete', async (route) =>
      route.abort('failed'),
    );

    await page.goto('/checkout');
    await waitForComponent(page, 'justifi-checkout');

    await page.getByRole('radio', { name: 'New credit or debit card' }).click();
    await waitForCardForm(page);
    await fillIframeInput(page, 'cardNumber', TEST_DATA.card.number);
    await fillIframeInput(
      page,
      'expirationMonth',
      TEST_DATA.card.expirationMonth,
    );
    await fillIframeInput(
      page,
      'expirationYear',
      TEST_DATA.card.expirationYear,
    );
    await fillIframeInput(page, 'CVV', TEST_DATA.card.cvv);
    await page
      .getByRole('textbox', { name: 'Postal Code' })
      .fill(TEST_DATA.postalCodes.minneapolis);
    await waitForCardFieldsSynced(page);

    const payButton = page.getByRole('button', { name: 'Pay', exact: true });
    await payButton.click();

    const outputPane = page.locator('#output-pane');
    await expect(outputPane).toContainText(/error|fail/i);
    await expect(payButton).toBeEnabled();
  });

  test('validate() works after toggling payment methods', async ({ page }) => {
    await page.goto('/checkout');
    await waitForComponent(page, 'justifi-checkout');

    await page.getByRole('radio', { name: 'New bank account' }).click();
    await waitForBankAccountForm(page);

    await page.getByRole('radio', { name: 'New credit or debit card' }).click();
    await waitForCardForm(page);

    const result = await page.evaluate(async () => {
      const el = document.querySelector('justifi-checkout');
      return el ? await (el as any).validate() : null;
    });

    expect(result).not.toBeNull();
    expect(result).toHaveProperty('isValid');
    expect(typeof result.isValid).toBe('boolean');
  });

  test('calls fillBillingForm on justifi-checkout, toggles payment method, and verifies billing data persists in the new form fields', async ({
    page,
  }) => {
    await page.goto('/checkout');
    await waitForComponent(page, 'justifi-checkout');
    await waitForCardForm(page);

    // Click Fill Billing Form button to populate billing data
    await page.getByTestId('fill-billing-form-button').click();

    // Verify postal code is filled (card form visible by default)
    const postalCodeInput = page.getByRole('textbox', {
      name: 'Postal Code',
    });
    await expect(postalCodeInput).toHaveValue('90210');

    // Toggle to bank account payment method
    await page.getByRole('radio', { name: 'New bank account' }).click();

    await waitForBankAccountForm(page);

    // Verify billing data persists: name field should show filled value
    const nameInput = page.getByRole('textbox', { name: 'Full Name' });
    await expect(nameInput).toHaveValue('John Doe');

    // Toggle back to card
    await page.getByRole('radio', { name: 'New credit or debit card' }).click();

    await waitForCardForm(page);

    // Verify postal code still persists
    await expect(postalCodeInput).toHaveValue('90210');
  });
});

/**
 * Safari and iOS below 15.4 have no BroadcastChannel. The hosted fields must
 * then reach each other through `window.parent.frames`, which only works
 * because `iframe-input` slots its iframe into the light DOM of the shadow
 * host. Deleting the constructor in every frame simulates those browsers.
 */
const removeBroadcastChannel = () => {
  delete (window as any).BroadcastChannel;
};

/** Top document only: record every message it receives, to prove card data never transits the host. */
const recordHostMessages = () => {
  if (window !== window.top) return;
  const log: string[] = [];
  (window as any).__hostMessages = log;
  window.addEventListener('message', (event: MessageEvent) => {
    try {
      log.push(JSON.stringify(event.data));
    } catch {
      log.push(String(event.data));
    }
  });
};

async function expectHostNeverSaw(page: Page, secrets: readonly string[]) {
  const messages: string[] = await page.evaluate(
    () => (window as any).__hostMessages ?? [],
  );
  // The SDK's own validate/tokenize replies do arrive here; they carry a
  // token, never the data.
  expect(messages.length).toBeGreaterThan(0);
  for (const message of messages) {
    expect(message).not.toContain('justifi.broadcast');
    // Compare digits only, so a formatted "4242 4242 …" cannot slip past.
    const digits = message.replace(/\D/g, '');
    for (const secret of secrets) {
      expect(digits).not.toContain(secret.replace(/\D/g, ''));
    }
  }
}

async function payAndExpectComplete(page: Page) {
  const errorPromise = listenForErrorEvent(page, 'justifi-checkout');
  const completeResponsePromise = page.waitForResponse(
    (resp) =>
      resp.url().includes('/v1/checkouts/') &&
      resp.url().endsWith('/complete') &&
      resp.request().method() === 'POST',
  );

  await page.getByRole('button', { name: 'Pay', exact: true }).click();

  const result = await Promise.race([
    completeResponsePromise.then((resp) => ({
      type: 'success' as const,
      resp,
    })),
    errorPromise.then((err) => ({ type: 'error' as const, err })),
  ]);

  if (result.type === 'error') {
    throw new Error(
      `Checkout failed before /complete was called: ${result.err}`,
    );
  }

  const body = await result.resp.json();
  expect(result.resp.status()).toBe(201);
  expect(body.data.id).toMatch(/^chc_/);
  expect(body.data.payment_response.data.amount).toBe(1799);
  return body;
}

test.describe('Hosted fields without BroadcastChannel', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(removeBroadcastChannel);
    await page.addInitScript(recordHostMessages);
  });

  test('card fields are document-tree frames inside an intact shadow host', async ({
    page,
  }) => {
    await page.goto('/checkout');
    await waitForComponent(page, 'justifi-checkout');
    await page.getByRole('radio', { name: 'New credit or debit card' }).click();
    await waitForCardForm(page);

    const frames = await page.evaluate(() => ({
      broadcastChannel: typeof (window as any).BroadcastChannel,
      named: ['cardNumber', 'expirationMonth', 'expirationYear', 'CVV'].map(
        (name) => !!(window as any).frames[name],
      ),
      slotted: Array.from(document.querySelectorAll('iframe')).filter(
        (iframe) => iframe.assignedSlot,
      ).length,
      shadowRoot: !!document.querySelector('justifi-tokenize-payment-method')
        ?.shadowRoot,
    }));

    expect(frames.broadcastChannel).toBe('undefined');
    expect(frames.named).toEqual([true, true, true, true]);
    expect(frames.slotted).toBe(4);
    expect(frames.shadowRoot).toBe(true);
  });

  test('should complete checkout with credit card', async ({ page }) => {
    await page.goto('/checkout');
    await waitForComponent(page, 'justifi-checkout');

    await page.getByRole('radio', { name: 'New credit or debit card' }).click();
    await waitForCardForm(page);

    await fillIframeInput(page, 'cardNumber', TEST_DATA.card.number);
    await fillIframeInput(
      page,
      'expirationMonth',
      TEST_DATA.card.expirationMonth,
    );
    await fillIframeInput(
      page,
      'expirationYear',
      TEST_DATA.card.expirationYear,
    );
    await fillIframeInput(page, 'CVV', TEST_DATA.card.cvv);
    await page
      .getByRole('textbox', { name: 'Postal Code' })
      .fill(TEST_DATA.postalCodes.minneapolis);
    await waitForCardFieldsSynced(page);

    const body = await payAndExpectComplete(page);
    expect(body.data.payment_status).toBe('succeeded');

    await expectHostNeverSaw(page, [TEST_DATA.card.number]);
  });

  test('should complete checkout with bank account', async ({ page }) => {
    await page.goto('/checkout');
    await waitForComponent(page, 'justifi-checkout');

    await page.getByRole('radio', { name: 'New bank account' }).click();
    await waitForBankAccountForm(page);

    await page.getByTestId('fill-billing-form-button').click();
    await expect(page.getByRole('textbox', { name: 'Full Name' })).toHaveValue(
      'John Doe',
    );

    await fillIframeInput(
      page,
      'routingNumber',
      TEST_DATA.bankAccount.routingNumber,
    );
    await fillIframeInput(
      page,
      'accountNumber',
      TEST_DATA.bankAccount.accountNumber,
    );
    await waitForBankAccountFieldsSynced(page);

    const body = await payAndExpectComplete(page);
    expect(['succeeded', 'pending']).toContain(body.data.payment_status);

    await expectHostNeverSaw(page, [
      TEST_DATA.bankAccount.routingNumber,
      TEST_DATA.bankAccount.accountNumber,
    ]);
  });
});
