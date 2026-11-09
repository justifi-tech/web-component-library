import { test, expect } from '@playwright/test';
import {
  fillBillingFormViaButton,
  fillIframeInput,
  waitForComponent,
  waitForHostedFieldsSynced,
  waitForIframeInput,
  TEST_DATA,
} from './helpers';

/**
 * The confirm field only exists on the flagged route, so it is deliberately
 * NOT in `BANK_ACCOUNT_IFRAMES` -- `waitForBankAccountForm()` and
 * `waitForBankAccountFieldsSynced()` derive from that list and every other
 * bank test would hang waiting for an iframe its page never renders.
 */
const CONFIRM_BANK_IFRAMES = [
  'accountNumber',
  'accountNumberConfirmation',
  'routingNumber',
] as const;

const CONFIRM_ROUTE = '/tokenize-payment-method?confirmAccountNumber=1';

async function openBankFormWithConfirmation(page: any) {
  await page.goto(CONFIRM_ROUTE);
  await waitForComponent(page, 'justifi-tokenize-payment-method');

  await page.getByRole('radio', { name: 'New bank account' }).click();

  await Promise.all(
    CONFIRM_BANK_IFRAMES.map((name) => waitForIframeInput(page, name)),
  );
  // Same reason as settleHostedFields(): a late init wipes what was typed.
  await page.waitForTimeout(3000);
}

async function fillBankForm(page: any, confirmationValue: string) {
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
  await fillIframeInput(page, 'accountNumberConfirmation', confirmationValue);
  await fillBillingFormViaButton(page);
  await waitForHostedFieldsSynced(page, CONFIRM_BANK_IFRAMES);
}

/** The confirm field's own error line. Matching by text alone also hits the
 *  "Confirm Account Number" label, which is a case-insensitive substring. */
const confirmFieldError = (page: any) =>
  page.locator('#form-error-text-accountNumberConfirmation');

const validateForm = (page: any) =>
  page.evaluate(async () => {
    const el = document.querySelector('justifi-tokenize-payment-method');
    return el ? await (el as any).validate() : null;
  });

test.describe('account number confirmation', () => {
  test('renders the confirm field between account and routing number', async ({
    page,
  }) => {
    await openBankFormWithConfirmation(page);

    const labels = await page
      .locator('bank-account-form iframe-input label.form-label')
      .allTextContents();

    expect(labels).toEqual([
      'Account Number',
      'Confirm Account Number',
      'Routing Number',
    ]);

    // The iframe is slot-projected into the shadow HOST's light DOM, so it is
    // not a descendant of iframe-input -- match by name like helpers.ts does.
    // Field order is already asserted by the labels above; this checks only
    // that all three hosted fields exist, so sort both sides.
    const iframeNames = await page
      .locator(
        'iframe[name="accountNumber"], iframe[name="accountNumberConfirmation"], iframe[name="routingNumber"]',
      )
      .evaluateAll((nodes: Element[]) =>
        nodes.map((node) => node.getAttribute('name')).sort(),
      );

    expect(iframeNames).toEqual([
      'accountNumber',
      'accountNumberConfirmation',
      'routingNumber',
    ]);
  });

  test('validate() fails and shows the mismatch error when the values differ', async ({
    page,
  }) => {
    await openBankFormWithConfirmation(page);
    await fillBankForm(page, '999999999999');

    const result = await validateForm(page);

    expect(result).not.toBeNull();
    expect(result.isValid).toBe(false);

    await expect(confirmFieldError(page)).toHaveText(
      'The entered value does not match the account number',
    );
  });

  test('overlapping validate() calls keep the mismatch error on the confirm field', async ({
    page,
  }) => {
    await openBankFormWithConfirmation(page);
    await fillBankForm(page, '999999999999');

    // What a double-clicked Submit does: two validates in flight at once, so
    // every hosted field gets two requests and sends two replies.
    const results = await page.evaluate(async () => {
      const el = document.querySelector('justifi-tokenize-payment-method') as any;
      return Promise.all([el.validate(), el.validate()]);
    });

    expect(results.map((result) => result.isValid)).toEqual([false, false]);
    await expect(confirmFieldError(page)).toHaveText(
      'The entered value does not match the account number',
    );
    await expect(
      page.locator('#form-error-text-routingNumber'),
    ).toHaveCount(0);
  });

  test('validate() passes when the values match', async ({ page }) => {
    await openBankFormWithConfirmation(page);
    await fillBankForm(page, TEST_DATA.bankAccount.accountNumber);

    const result = await validateForm(page);

    expect(result).not.toBeNull();
    expect(result.isValid).toBe(true);
  });

  test('validate() fails with a required error when the confirm field is empty', async ({
    page,
  }) => {
    await openBankFormWithConfirmation(page);

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
    await fillBillingFormViaButton(page);

    const result = await validateForm(page);

    expect(result).not.toBeNull();
    expect(result.isValid).toBe(false);

    await expect(confirmFieldError(page)).toHaveText('Confirm account number');
  });

  test('the confirm field is absent without the query param', async ({
    page,
  }) => {
    await page.goto('/tokenize-payment-method');
    await waitForComponent(page, 'justifi-tokenize-payment-method');

    await page.getByRole('radio', { name: 'New bank account' }).click();
    await waitForIframeInput(page, 'accountNumber');

    await expect(
      page.locator('iframe[name="accountNumberConfirmation"]'),
    ).toHaveCount(0);
  });
});
