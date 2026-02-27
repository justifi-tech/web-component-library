import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { JustifiBusinessBankAccountFormStep } from '../business-bank-account-form-step';
import { CountryCode } from '../../../../../utils/country-codes';

const mockBusinessResponse = (overrides: {
  bank_accounts?: any[];
  bank_account_verification?: boolean;
  platform_account_id?: string | null;
  documents?: any[];
} = {}) => ({
  data: {
    bank_accounts: overrides.bank_accounts ?? [],
    documents: overrides.documents ?? [],
    settings: {
      bank_account_verification: overrides.bank_account_verification ?? false,
    },
    platform_account_id: 'platform_account_id' in overrides ? overrides.platform_account_id : 'pa_123',
  },
});

const existingBankAccount = {
  id: 'ba_123',
  account_owner_name: 'Test Business',
  account_type: 'checking',
  account_number: '123456789',
  routing_number: '021000021',
  bank_name: 'Test Bank',
  business_id: 'biz_123',
};

async function setupComponent(businessResponse: any) {
  const mockGetBusiness = jest.fn();
  mockGetBusiness.mockImplementation(({ onSuccess, final }) => {
    onSuccess(businessResponse);
    final?.();
  });

  const page = await newSpecPage({
    components: [JustifiBusinessBankAccountFormStep],
    template: () => (
      <justifi-business-bank-account-form-step
        authToken="test-token"
        businessId="biz_123"
        country={CountryCode.USA}
      />
    ),
  });

  page.rootInstance.getBusiness = mockGetBusiness;
  // @ts-ignore
  page.rootInstance.getData();
  await page.waitForChanges();

  return { page, mockGetBusiness };
}

describe('justifi-business-bank-account-form-step', () => {
  describe('render modes via determineViewMode', () => {
    it('renders manual mode when bank_account_verification is false and no existing account', async () => {
      const { page } = await setupComponent(
        mockBusinessResponse({ bank_account_verification: false })
      );

      expect(page.rootInstance.viewMode).toBe('manual');
      expect(page.root.querySelector('bank-account-form-inputs')).toBeTruthy();
      expect(page.root.querySelector('plaid-verification')).toBeNull();

      const buttons = Array.from(page.root.querySelectorAll('button'));
      const saveBtn = buttons.find(b => b.textContent.includes('Save Bank Account'));
      expect(saveBtn).toBeTruthy();

      const cancelBtn = buttons.find(b => b.textContent.includes('Cancel'));
      expect(cancelBtn).toBeFalsy();
    });

    it('renders plaid mode when bank_account_verification is true with platform_account_id and no existing account', async () => {
      const { page } = await setupComponent(
        mockBusinessResponse({
          bank_account_verification: true,
          platform_account_id: 'pa_123',
        })
      );

      expect(page.rootInstance.viewMode).toBe('plaid');
      expect(page.root.querySelector('plaid-verification')).toBeTruthy();
      expect(page.root.querySelector('bank-account-form-inputs')).toBeNull();

      const buttons = Array.from(page.root.querySelectorAll('button'));
      const manualLink = buttons.find(b =>
        b.textContent.includes('Enter bank details manually')
      );
      expect(manualLink).toBeTruthy();
    });

    it('renders readonly mode when an existing bank account is present', async () => {
      const { page } = await setupComponent(
        mockBusinessResponse({
          bank_accounts: [existingBankAccount],
          bank_account_verification: true,
          platform_account_id: 'pa_123',
        })
      );

      expect(page.rootInstance.viewMode).toBe('readonly');
      expect(page.root.querySelector('plaid-verification')).toBeNull();

      const formInputs = page.root.querySelector('bank-account-form-inputs');
      expect(formInputs).toBeTruthy();
      expect(formInputs.getAttribute('formdisabled')).not.toBeNull();

      const buttons = Array.from(page.root.querySelectorAll('button'));
      const changeBtn = buttons.find(b => b.textContent.includes('Change Bank Account'));
      expect(changeBtn).toBeTruthy();
    });

    it('renders manual mode (not plaid) when bank_account_verification is false even with platform_account_id', async () => {
      const { page } = await setupComponent(
        mockBusinessResponse({
          bank_account_verification: false,
          platform_account_id: 'pa_123',
        })
      );

      expect(page.rootInstance.viewMode).toBe('manual');
      expect(page.rootInstance.plaidAvailable).toBe(false);
      expect(page.root.querySelector('plaid-verification')).toBeNull();
      expect(page.root.querySelector('bank-account-form-inputs')).toBeTruthy();
    });
  });

  describe('view mode transitions via handlers', () => {
    it('handleToggleToManualEntry switches from plaid to manual', async () => {
      const { page } = await setupComponent(
        mockBusinessResponse({
          bank_account_verification: true,
          platform_account_id: 'pa_123',
        })
      );

      expect(page.rootInstance.viewMode).toBe('plaid');

      page.rootInstance.handleToggleToManualEntry();
      await page.waitForChanges();

      expect(page.rootInstance.viewMode).toBe('manual');
      expect(page.root.querySelector('bank-account-form-inputs')).toBeTruthy();
      expect(page.root.querySelector('plaid-verification')).toBeNull();
    });

    it('handleToggleToPlaidVerification switches from manual to plaid', async () => {
      const { page } = await setupComponent(
        mockBusinessResponse({
          bank_account_verification: true,
          platform_account_id: 'pa_123',
        })
      );

      page.rootInstance.handleToggleToManualEntry();
      await page.waitForChanges();
      expect(page.rootInstance.viewMode).toBe('manual');

      page.rootInstance.handleToggleToPlaidVerification();
      await page.waitForChanges();

      expect(page.rootInstance.viewMode).toBe('plaid');
      expect(page.root.querySelector('plaid-verification')).toBeTruthy();
    });

    it('handleChangeBankAccount goes to plaid when plaidAvailable', async () => {
      const { page } = await setupComponent(
        mockBusinessResponse({
          bank_accounts: [existingBankAccount],
          bank_account_verification: true,
          platform_account_id: 'pa_123',
        })
      );

      expect(page.rootInstance.viewMode).toBe('readonly');

      page.rootInstance.handleChangeBankAccount();
      await page.waitForChanges();

      expect(page.rootInstance.viewMode).toBe('plaid');
      expect(page.root.querySelector('plaid-verification')).toBeTruthy();
    });

    it('handleChangeBankAccount goes to manual when plaid not available', async () => {
      const { page } = await setupComponent(
        mockBusinessResponse({
          bank_accounts: [existingBankAccount],
          bank_account_verification: false,
        })
      );

      expect(page.rootInstance.viewMode).toBe('readonly');

      page.rootInstance.handleChangeBankAccount();
      await page.waitForChanges();

      expect(page.rootInstance.viewMode).toBe('manual');
      expect(page.root.querySelector('bank-account-form-inputs')).toBeTruthy();
      expect(page.root.querySelector('plaid-verification')).toBeNull();
    });

    it('handleCancel goes to readonly when existingBankAccount', async () => {
      const { page } = await setupComponent(
        mockBusinessResponse({
          bank_accounts: [existingBankAccount],
          bank_account_verification: true,
          platform_account_id: 'pa_123',
        })
      );

      page.rootInstance.handleChangeBankAccount();
      await page.waitForChanges();
      expect(page.rootInstance.viewMode).toBe('plaid');

      page.rootInstance.handleToggleToManualEntry();
      await page.waitForChanges();
      expect(page.rootInstance.viewMode).toBe('manual');

      page.rootInstance.handleCancel();
      await page.waitForChanges();

      expect(page.rootInstance.viewMode).toBe('readonly');
    });

    it('handleCancel goes to plaid when no existing account but verification enabled', async () => {
      const { page } = await setupComponent(
        mockBusinessResponse({
          bank_account_verification: true,
          platform_account_id: 'pa_123',
        })
      );

      page.rootInstance.handleToggleToManualEntry();
      await page.waitForChanges();
      expect(page.rootInstance.viewMode).toBe('manual');

      page.rootInstance.handleCancel();
      await page.waitForChanges();

      expect(page.rootInstance.viewMode).toBe('plaid');
      expect(page.root.querySelector('plaid-verification')).toBeTruthy();
    });
  });

  describe('document uploads visibility', () => {
    it('renders document uploads in manual mode', async () => {
      const { page } = await setupComponent(
        mockBusinessResponse({ bank_account_verification: false })
      );

      expect(page.rootInstance.viewMode).toBe('manual');
      expect(page.root.querySelector('bank-account-document-form-inputs')).toBeTruthy();
    });

    it('renders document uploads in readonly mode', async () => {
      const { page } = await setupComponent(
        mockBusinessResponse({
          bank_accounts: [existingBankAccount],
          bank_account_verification: true,
          platform_account_id: 'pa_123',
        })
      );

      expect(page.rootInstance.viewMode).toBe('readonly');
      expect(page.root.querySelector('bank-account-document-form-inputs')).toBeTruthy();
    });

    it('does not render document uploads in plaid mode', async () => {
      const { page } = await setupComponent(
        mockBusinessResponse({
          bank_account_verification: true,
          platform_account_id: 'pa_123',
        })
      );

      expect(page.rootInstance.viewMode).toBe('plaid');
      expect(page.root.querySelector('bank-account-document-form-inputs')).toBeNull();
    });
  });

  describe('computed properties', () => {
    it('plaidAvailable is false when bankAccountVerification is false', async () => {
      const { page } = await setupComponent(
        mockBusinessResponse({ bank_account_verification: false })
      );

      expect(page.rootInstance.plaidAvailable).toBe(false);
    });

    it('plaidAvailable is true when bankAccountVerification is true and platformAccountId exists', async () => {
      const { page } = await setupComponent(
        mockBusinessResponse({
          bank_account_verification: true,
          platform_account_id: 'pa_123',
        })
      );

      expect(page.rootInstance.plaidAvailable).toBe(true);
    });

    it('plaidAvailable is false when platformAccountId is null', async () => {
      const { page } = await setupComponent(
        mockBusinessResponse({
          bank_account_verification: true,
          platform_account_id: null,
        })
      );

      expect(page.rootInstance.plaidAvailable).toBe(false);
    });

    it('showCancel is false when no verification and no existing account (bug fix)', async () => {
      const { page } = await setupComponent(
        mockBusinessResponse({ bank_account_verification: false })
      );

      expect(page.rootInstance.showCancel).toBe(false);
      expect(page.rootInstance.existingBankAccount).toBe(false);
      expect(page.rootInstance.bankAccountVerification).toBe(false);
    });

    it('showCancel is true when verification enabled even without existing account', async () => {
      const { page } = await setupComponent(
        mockBusinessResponse({
          bank_account_verification: true,
          platform_account_id: 'pa_123',
        })
      );

      page.rootInstance.handleToggleToManualEntry();
      await page.waitForChanges();

      expect(page.rootInstance.showCancel).toBe(true);
    });

    it('showCancel is true when existing account even without verification', async () => {
      const { page } = await setupComponent(
        mockBusinessResponse({
          bank_accounts: [existingBankAccount],
          bank_account_verification: false,
        })
      );

      expect(page.rootInstance.showCancel).toBe(true);
    });
  });
});
