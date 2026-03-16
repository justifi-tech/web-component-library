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
  fillAdditionalQuestions,
  fillRepresentative,
  fillOwners,
  fillBankAccountManual,
  acceptTerms,
  clickNext,
  clickSubmit,
  waitForStep,
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
