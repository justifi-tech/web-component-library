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
  fillDocumentUpload,
  acceptTerms,
  clickNext,
  clickSubmit,
  waitForStep,
} from './payment-provisioning-helpers';

test.describe('payment-provisioning happy path - USA', () => {
  test('completes full 8-step flow', async ({ page }) => {
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

    // Step 5: Bank Account
    await waitForStep(page, 6, 20000);
    await fillBankAccountManual(page, TEST_BUSINESS_DATA.usa.bankAccount);
    await clickNext(page);
    await waitForStep(page, 7);

    // Step 6: Document Upload
    await fillDocumentUpload(page);
    await clickNext(page);
    await waitForStep(page, 8);

    // Step 7: Terms
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

test.describe('payment-provisioning happy path - CAN', () => {
  test('completes full 8-step flow', async ({ page }, _testInfo) => {
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

    // Step 6: Document Upload
    await fillDocumentUpload(page);
    await clickNext(page);
    await waitForStep(page, 8);

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

test.describe('payment-provisioning USA — rep not owner', () => {
  test('completes full 8-step flow when owner is not the representative', async ({
    page,
  }) => {
    const pageErrors: Error[] = [];
    page.on('pageerror', (err) => pageErrors.push(err));

    await page.goto('/payment-provisioning');
    await waitForComponent(page, 'justifi-payment-provisioning');

    await fillBusinessCoreInfo(page, TEST_BUSINESS_DATA.usa.coreInfo);
    await clickNext(page);
    await waitForStep(page, 2);

    await fillLegalAddress(page, TEST_BUSINESS_DATA.usa.legalAddress);
    await clickNext(page);
    await waitForStep(page, 3);

    await fillAdditionalQuestions(
      page,
      TEST_BUSINESS_DATA.usa.additionalQuestions,
    );
    await clickNext(page);
    await waitForStep(page, 4);

    await fillRepresentative(page, TEST_BUSINESS_DATA.usa.representative);
    await clickNext(page);
    await waitForStep(page, 5);

    await fillOwners(page, TEST_BUSINESS_DATA.usa.owner, {
      representativeIsOwner: false,
    });
    await clickNext(page);
    await waitForStep(page, 6);

    await waitForStep(page, 6, 20000);
    await fillBankAccountManual(page, TEST_BUSINESS_DATA.usa.bankAccount);
    await clickNext(page);
    await waitForStep(page, 7);

    // Step 6: Document Upload
    await fillDocumentUpload(page);
    await clickNext(page);
    await waitForStep(page, 8);

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
      (e) => !e.message.includes('Failed to find script'),
    );
    expect(criticalErrors).toHaveLength(0);
  });
});
