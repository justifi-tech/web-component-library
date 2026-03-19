import { test, expect } from '@playwright/test';
import {
  waitForComponent,
  listenForErrorEvent,
  listenForSubmitEvent,
} from './helpers';
import {
  TEST_BUSINESS_DATA,
  fillBusinessCoreInfo,
  fillLegalAddress,
  fillLegalAddressCAN,
  fillAdditionalQuestions,
  fillRepresentative,
  fillRepresentativeCAN,
  fillOwners,
  fillBankAccountManual,
  fillBankAccountManualCAN,
  acceptTerms,
  clickNext,
  clickSubmit,
  waitForStep,
  expectValidationError,
} from './payment-provisioning-helpers';

test.describe('payment-provisioning happy path - USA', () => {
  test('completes full 7-step flow', async ({ page }) => {
    const pageErrors: Error[] = [];
    page.on('pageerror', (err) => pageErrors.push(err));

    await page.goto('/payment-provisioning');
    await waitForComponent(page, 'justifi-payment-provisioning');

    // Step 0: Core Info
    await fillBusinessCoreInfo(page, TEST_BUSINESS_DATA.usa.coreInfo);
    await clickNext(page);
    await waitForStep(page, 2);

    // Step 1: Legal Address
    await fillLegalAddress(page, TEST_BUSINESS_DATA.usa.legalAddress);
    await clickNext(page);
    await waitForStep(page, 3);

    // Step 2: Additional Questions
    await fillAdditionalQuestions(
      page,
      TEST_BUSINESS_DATA.usa.additionalQuestions,
    );
    await clickNext(page);
    await waitForStep(page, 4);

    // Step 3: Representative
    await fillRepresentative(page, TEST_BUSINESS_DATA.usa.representative);
    await clickNext(page);
    await waitForStep(page, 5);

    // Step 4: Owners (rep is owner, so Yes)
    await fillOwners(page, TEST_BUSINESS_DATA.usa.owner, {
      representativeIsOwner: true,
    });
    await clickNext(page);
    await waitForStep(page, 6);

    // Step 5: Bank Account (step 6 in 1-based UI)
    await waitForStep(page, 6, 20000);
    await fillBankAccountManual(page, TEST_BUSINESS_DATA.usa.bankAccount);
    await clickNext(page);
    await waitForStep(page, 7);

    // Step 6: Terms
    await acceptTerms(page);
    const submitPromise = listenForSubmitEvent(page);
    const errorPromise = listenForErrorEvent(
      page,
      'justifi-payment-provisioning',
    );
    await clickSubmit(page);

    const result = await Promise.race([
      submitPromise.then((text) => ({ type: 'submit' as const, text })),
      errorPromise.then((err) => ({ type: 'error' as const, err })),
    ]);

    if (result.type === 'error') {
      throw new Error(`Provisioning failed: ${result.err}`);
    }

    await expect(page.getByText(/You're all set for now/i)).toBeVisible();
    const criticalErrors = pageErrors.filter(
      (e) => !e.message.includes('Failed to find script'), // Plaid CDN in test env, non blocking error, will be fixed later
    );
    expect(criticalErrors).toHaveLength(0);
  });
});

test.describe('payment-provisioning validation', () => {
  test('shows all required field errors when submitting empty step 0', async ({
    page,
  }) => {
    await page.goto('/payment-provisioning');
    await waitForComponent(page, 'justifi-payment-provisioning');

    // Clear pre-populated fields so validation fails on all required fields
    await page
      .getByLabel('Business Name')
      .waitFor({ state: 'visible', timeout: 15000 });
    await page.getByLabel('Business Name').clear();
    await page.getByLabel('Business Website URL').clear();
    await page.getByLabel('Business Email Address').clear();
    const comp = page.locator('justifi-payment-provisioning');
    await comp.locator('input[name="phone"]').first().clear();
    await comp.locator('input[name="tax_id"]').clear();

    await clickNext(page);

    await expectValidationError(page, 'Enter legal name');
    await expectValidationError(page, 'Enter business website url');
    await expectValidationError(page, 'Enter business email');
    await expectValidationError(page, 'Enter phone number');
    await expectValidationError(page, 'Select business classification');
    await expectValidationError(page, 'Enter a business industry');
    await expectValidationError(page, 'Enter date of registration');
    await expectValidationError(
      page,
      'Enter valid Tax ID (EIN or SSN) without dashes',
    );
  });

  test.fixme(
    'advances step when allowOptionalFields=true with only legal_name filled',
    async ({ page }) => {
      await page.goto('/payment-provisioning?allow_optional_fields=true');
      await waitForComponent(page, 'justifi-payment-provisioning');

      await page
        .getByLabel('Business Name')
        .waitFor({ state: 'visible', timeout: 15000 });
      await page.getByLabel('Business Name').fill('Acme Test Corp');
      await clickNext(page);

      await waitForStep(page, 2, 25000);
    },
  );

  test('shows field-level errors for invalid email, URL, and phone', async ({
    page,
  }) => {
    await page.goto('/payment-provisioning');
    await waitForComponent(page, 'justifi-payment-provisioning');

    await page
      .getByLabel('Business Name')
      .waitFor({ state: 'visible', timeout: 15000 });
    await page.getByLabel('Business Name').fill('Acme Test Corp');
    await page.getByLabel('Business Website URL').fill('not-a-url');
    await page.getByLabel('Business Email Address').fill('notanemail');
    const comp = page.locator('justifi-payment-provisioning');
    await comp.locator('input[name="phone"]').first().fill('123');
    await comp.locator('input[name="phone"]').first().dispatchEvent('input');

    await clickNext(page);

    await expectValidationError(page, 'Enter valid email');
    await expectValidationError(page, 'Enter valid website url');
    await expectValidationError(page, 'Enter valid phone number');
  });

  test('rejects repeated digits in tax ID field', async ({ page }) => {
    await page.goto('/payment-provisioning');
    await waitForComponent(page, 'justifi-payment-provisioning');

    const comp = page.locator('justifi-payment-provisioning');
    await comp.locator('input[name="tax_id"]').fill('111111111');
    await comp.locator('input[name="tax_id"]').dispatchEvent('input');

    await clickNext(page);

    await expectValidationError(page, 'Enter valid tax id, SSN, or EIN');
  });
});

test.describe('payment-provisioning happy path - CAN', () => {
  test('completes full 7-step flow', async ({ page }, _testInfo) => {
    const pageErrors: Error[] = [];
    page.on('pageerror', (err) => pageErrors.push(err));

    await page.goto('/payment-provisioning?country=CAN');
    await waitForComponent(page, 'justifi-payment-provisioning');

    await fillBusinessCoreInfo(page, TEST_BUSINESS_DATA.can.coreInfo);
    await clickNext(page);
    await waitForStep(page, 2);

    await fillLegalAddressCAN(page, TEST_BUSINESS_DATA.can.legalAddress);
    await clickNext(page);
    await waitForStep(page, 3);

    await fillAdditionalQuestions(
      page,
      TEST_BUSINESS_DATA.can.additionalQuestions,
    );
    await clickNext(page);
    await waitForStep(page, 4);

    await fillRepresentativeCAN(page, TEST_BUSINESS_DATA.can.representative);
    await clickNext(page);
    await waitForStep(page, 5);

    await fillOwners(page, TEST_BUSINESS_DATA.can.owner, {
      representativeIsOwner: true,
    });
    await clickNext(page);
    await waitForStep(page, 6);

    await waitForStep(page, 6, 20000);
    await fillBankAccountManualCAN(page, TEST_BUSINESS_DATA.can.bankAccount);
    await clickNext(page);
    await waitForStep(page, 7);

    await acceptTerms(page);
    const submitPromise = listenForSubmitEvent(page);
    const errorPromise = listenForErrorEvent(
      page,
      'justifi-payment-provisioning',
    );
    await clickSubmit(page);

    const result = await Promise.race([
      submitPromise.then((text) => ({ type: 'submit' as const, text })),
      errorPromise.then((err) => ({ type: 'error' as const, err })),
    ]);

    if (result.type === 'error') {
      throw new Error(`Provisioning failed: ${result.err}`);
    }

    await expect(page.getByText(/You're all set for now/i)).toBeVisible();
    const criticalErrors = pageErrors.filter(
      (e) => !e.message.includes('Failed to find script'), // Plaid CDN in test env, non blocking error, will be fixed later
    );
    expect(criticalErrors).toHaveLength(0);
  });
});
