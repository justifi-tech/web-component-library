import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import path from 'path';

/** Path to minimal image fixture for bank account document upload */
export const VOIDED_CHECK_FIXTURE = path.join(
  __dirname,
  'fixtures',
  'voided-check.png',
);

/** Test data for USA payment provisioning flow */
export const TEST_BUSINESS_DATA = {
  usa: {
    coreInfo: {
      legal_name: `Acme Test Corp ${Date.now()}`,
      doing_business_as: 'Acme',
      classification: 'limited',
      date_of_incorporation: '2020-01-01',
      industry: 'Software',
      tax_id: '941074845',
      website_url: 'https://acme-test.com',
      email: 'test@acme-test.com',
      phone: '6125551234',
    },
    legalAddress: {
      line1: '123 Main St',
      city: 'Minneapolis',
      state: 'MN',
      postal_code: '55114',
    },
    additionalQuestions: {
      business_revenue: '100000',
      business_payment_volume: '50000',
      business_average_transaction_amount: '100',
      business_when_service_received: 'Within 7 days',
    },
    representative: {
      name: 'Jane Doe',
      title: 'CEO',
      email: 'jane@acme-test.com',
      phone: '6125551234',
      dob_full: '1980-01-15',
      identification_number: '078051120',
      address: {
        line1: '456 Rep St',
        city: 'Minneapolis',
        state: 'MN',
        postal_code: '55114',
      },
    },
    owner: {
      name: 'Jane Doe',
      email: 'jane@acme-test.com',
    },
    bankAccount: {
      bank_name: 'Test Bank',
      nickname: 'Main Account',
      account_owner_name: 'Acme Test Corp',
      account_type: 'checking',
      routing_number: '110000000',
      account_number: '000123456789',
    },
  },
};

export type CoreInfoData = (typeof TEST_BUSINESS_DATA.usa)['coreInfo'];
export type LegalAddressData = (typeof TEST_BUSINESS_DATA.usa)['legalAddress'];
export type AdditionalQuestionsData =
  (typeof TEST_BUSINESS_DATA.usa)['additionalQuestions'];
export type RepresentativeData = (typeof TEST_BUSINESS_DATA.usa)['representative'];
export type OwnerData = (typeof TEST_BUSINESS_DATA.usa)['owner'];
export type BankAccountData = (typeof TEST_BUSINESS_DATA.usa)['bankAccount'];

export async function fillBusinessCoreInfo(
  page: Page,
  data: CoreInfoData,
): Promise<void> {
  await page.getByLabel('Business Name').waitFor({ state: 'visible', timeout: 15000 });
  await page.getByLabel('Business Name').fill(data.legal_name);
  await page.getByLabel('Doing Business As (DBA)').fill(data.doing_business_as);
  await page.getByLabel('Business Classification').selectOption(data.classification);
  await page.getByLabel('Date of Registration').fill(data.date_of_incorporation);
  await page.getByLabel('Industry').fill(data.industry);
  const comp = page.locator('justifi-payment-provisioning');
  await comp.locator('input[name="tax_id"]').fill(data.tax_id);
  await comp.locator('input[name="tax_id"]').dispatchEvent('input');
  await page.getByLabel('Business Website URL').fill(data.website_url);
  await page.getByLabel('Business Email Address').fill(data.email);
  await comp.locator('input[name="phone"]').first().fill(data.phone);
  await comp.locator('input[name="phone"]').first().dispatchEvent('input');
}

export async function fillLegalAddress(
  page: Page,
  data: LegalAddressData,
): Promise<void> {
  await page.getByLabel('Street Address').fill(data.line1);
  await page.getByLabel('City').fill(data.city);
  await page.getByLabel('State').selectOption(data.state);
  await page.getByLabel('Zip Code').fill(data.postal_code);
}

export async function fillAdditionalQuestions(
  page: Page,
  data: AdditionalQuestionsData,
): Promise<void> {
  await page
    .getByLabel(
      /What is your business' estimated annual revenue from its primary business activities/,
    )
    .fill(data.business_revenue);
  await page
    .getByLabel(
      /What is your business' annual credit card & ACH volume anticipated to process/,
    )
    .fill(data.business_payment_volume);
  await page
    .getByLabel('What is your average transaction size?')
    .fill(data.business_average_transaction_amount);
  await page
    .getByLabel(
      /On average, how long after paying will your customers typically receive their goods or services/,
    )
    .selectOption(data.business_when_service_received);
}

export async function fillRepresentative(
  page: Page,
  data: RepresentativeData,
): Promise<void> {
  await page.getByLabel('Full Name').fill(data.name);
  await page.getByLabel('Title').fill(data.title);
  await page.getByLabel('Email Address').fill(data.email);
  await page.getByLabel('Phone Number').fill(data.phone);
  await page.getByLabel('Birth Date').fill(data.dob_full);
  await page.getByLabel('SSN').fill(data.identification_number);
  const addr = data.address;
  await page.getByLabel('Street Address').fill(addr.line1);
  await page.getByLabel('City').fill(addr.city);
  await page.getByLabel('State').selectOption(addr.state);
  await page.getByLabel('Zip Code').fill(addr.postal_code);
}

export async function fillOwners(
  page: Page,
  data: OwnerData,
  options?: { representativeIsOwner?: boolean },
): Promise<void> {
  const repIsOwnerBanner = page.getByText(
    'Is the representative of this business also an owner?',
  );
  if ((await repIsOwnerBanner.isVisible()) && options?.representativeIsOwner) {
    await page.getByRole('button', { name: 'Yes' }).click();
    await page.waitForTimeout(2000);
    return;
  }
  if ((await repIsOwnerBanner.isVisible()) && options?.representativeIsOwner === false) {
    await page.getByRole('button', { name: 'No' }).click();
    await page.waitForTimeout(500);
  }
  const nameInput = page.getByLabel('Full Name').first();
  if (await nameInput.isVisible()) {
    await nameInput.fill(data.name);
    await page.getByLabel('Email Address').first().fill(data.email);
  }
}

export async function fillBankAccountManual(
  page: Page,
  data: BankAccountData,
  voidedCheckPath: string = VOIDED_CHECK_FIXTURE,
): Promise<void> {
  const manualButton = page.getByRole('button', {
    name: 'Enter bank details manually (document upload required)',
  });
  if (await manualButton.isVisible()) {
    await manualButton.click();
    await page.waitForTimeout(500);
  }
  await page.getByLabel('Bank Name').fill(data.bank_name);
  await page.getByLabel('Nickname').fill(data.nickname);
  await page.getByLabel('Account Owner Name').fill(data.account_owner_name);
  await page.getByLabel('Account Type').selectOption(data.account_type);
  await page.getByLabel('Account Number').fill(data.account_number);
  await page.getByLabel('Routing Number').fill(data.routing_number);
  const comp = page.locator('justifi-payment-provisioning');
  const fileInput = comp.locator('input[name="voided_check"]');
  await fileInput.setInputFiles(voidedCheckPath);
}

export async function acceptTerms(page: Page): Promise<void> {
  await page.getByLabel('I agree to the terms and conditions').check();
}

export async function clickNext(page: Page): Promise<void> {
  await page.waitForTimeout(300);
  await page.getByRole('button', { name: 'Next' }).click();
}

export async function clickPrevious(page: Page): Promise<void> {
  await page.getByRole('button', { name: 'Previous' }).click();
}

export async function clickSubmit(page: Page): Promise<void> {
  await page.getByRole('button', { name: 'Submit' }).click();
}

export async function waitForStep(
  page: Page,
  stepNumber: number,
  timeout = 15000,
): Promise<void> {
  const stepSelectors: Record<number, string | string[]> = {
    1: 'Business Name',
    2: 'Street Address',
    3: 'What is your business\' estimated annual revenue',
    4: 'Full Name',
    5: 'Is the representative of this business also an owner',
    6: ['Bank Name', 'Enter bank details manually', 'Bank Account Info'],
    7: 'I agree to the terms and conditions',
  };
  const selector = stepSelectors[stepNumber];
  if (selector) {
    const selectors = Array.isArray(selector) ? selector : [selector];
    await expect(async () => {
      for (const sel of selectors) {
        if (await page.getByText(sel).isVisible()) return;
      }
      throw new Error(`None of steps selectors found: ${selectors.join(', ')}`);
    }).toPass({ timeout });
  }
}

export async function getStepCounter(page: Page): Promise<string> {
  return page.evaluate(() => {
    const el = document.querySelector('justifi-payment-provisioning');
    const host = el?.shadowRoot;
    if (!host) return '';
    const walker = document.createTreeWalker(host, NodeFilter.SHOW_TEXT);
    let node: Node | null;
    while ((node = walker.nextNode())) {
      const text = node.textContent?.trim() ?? '';
      if (text.match(/Step \d+ of \d+/)) return text;
    }
    return '';
  });
}

export async function expectValidationError(
  page: Page,
  message: string | RegExp,
): Promise<void> {
  await expect(page.getByText(message)).toBeVisible();
}
