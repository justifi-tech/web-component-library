import { newSpecPage } from '@stencil/core/testing';
import * as checkoutActions from '../../../actions/checkout/checkout-actions';
import { JustifiModularCheckout } from '../justifi-modular-checkout';
import { checkoutStore, getCheckoutState } from '../../../store/checkout.store';
import { JustifiSavedPaymentMethods } from '../sub-components/justifi-saved-payment-methods';
import { JustifiCardForm } from '../sub-components/justifi-card-form';
import { JustifiBankAccountForm } from '../sub-components/justifi-bank-account-form';
import { PAYMENT_METHODS, SavedPaymentMethod } from '../ModularCheckout';
import {
  ComponentErrorCodes,
  ComponentErrorMessages,
  ComponentErrorSeverity,
  ICheckoutStatus,
} from '../../../api';
import { insuranceValues } from '../../insurance/insurance-state';

function mockFormRefs(instance: any, overrides?: Partial<Record<string, any>>) {
  instance.paymentMethodFormRef = {
    validate: jest.fn().mockResolvedValue(true),
    tokenize: jest.fn().mockResolvedValue({ id: 'tok_mock' }),
    tagName: 'JUSTIFI-CARD-FORM',
    ...overrides?.paymentMethodFormRef,
  };
  instance.billingFormRef = {
    validate: jest.fn().mockResolvedValue(true),
    getValues: jest.fn().mockResolvedValue({}),
    ...overrides?.billingFormRef,
  };
}

const mockCheckoutForFetch = {
  account_id: 'acc_1',
  payment_methods: [],
  payment_method_group_id: undefined,
  payment_description: 'desc',
  total_amount: 1000,
  payment_amount: 1000,
  payment_settings: {
    ach_payments: true,
    bnpl_payments: false,
    insurance_payments: false,
    bank_account_verification: false,
    apple_payments: false,
    google_payments: false,
  },
};

describe('justifi-modular-checkout', () => {
  beforeAll(() => {
    (global as any).MutationObserver = class {
      constructor(_cb: any) { }
      observe() { }
      disconnect() { }
    };
    jest.spyOn(checkoutActions, 'makeGetCheckout').mockImplementation(() => {
      return jest.fn(async ({ onSuccess }: any) => {
        onSuccess({
          checkout: { ...mockCheckoutForFetch, status: ICheckoutStatus.created },
        });
      });
    });
  });

  beforeEach(() => {
    checkoutStore.isSubmitting = false;
    checkoutStore.isWalletProcessing = false;
    checkoutStore.checkoutMode = null;
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('uses saved payment method without billing validation or tokenization', async () => {
    const page = await newSpecPage({
      components: [JustifiModularCheckout, JustifiSavedPaymentMethods],
      html: `<justifi-modular-checkout auth-token="test" checkout-id="chk_123">
        <justifi-saved-payment-methods></justifi-saved-payment-methods>
      </justifi-modular-checkout>`,
    });

    const instance: any = page.rootInstance;

    // Provide saved payment methods in store
    checkoutStore.paymentMethods = [
      { id: 'pm_123', type: PAYMENT_METHODS.SAVED_CARD, acct_last_four: '4242', brand: 'visa' } as SavedPaymentMethod,
    ];

    await page.waitForChanges();

    // Click one of the saved payment methods to set selectedPaymentMethod and paymentToken
    const savedEl: any = page.root?.querySelector('justifi-saved-payment-methods');
    const listItem: HTMLElement | null = savedEl?.shadowRoot?.querySelector('.radio-list-item');
    listItem?.click();

    await page.waitForChanges();

    // Prevent real network/action calls
    instance.completeCheckout = jest.fn();

    instance.tokenizePaymentMethod = jest.fn();

    await instance.submitCheckout();

    // Should not attempt tokenization
    expect(instance.tokenizePaymentMethod).not.toHaveBeenCalled();

    // Should submit using the saved payment method id as payment_token
    expect(instance.completeCheckout).toHaveBeenCalledTimes(1);
    const arg = (instance.completeCheckout as jest.Mock).mock.calls[0][0];
    expect(arg.payment.payment_mode).toBe('ecom');
    expect(arg.payment.payment_token).toBe('pm_123');
  });

  describe('fetchCheckout', () => {
    const mockCheckout = {
      account_id: 'acc_1',
      payment_methods: [],
      payment_method_group_id: undefined,
      payment_description: 'desc',
      total_amount: 1000,
      payment_amount: 1000,
      mode: 'test',
      payment_settings: {
        ach_payments: true,
        bnpl_payments: false,
        insurance_payments: false,
        bank_account_verification: false,
        apple_payments: false,
        google_payments: false,
      },
    };

    it('fetches checkout data on load', async () => {
      const getCheckoutSpy = jest.fn(({ onSuccess }: any) => {
        onSuccess({ checkout: { ...mockCheckout, status: ICheckoutStatus.created } });
      });
      (checkoutActions.makeGetCheckout as jest.Mock).mockReturnValue(getCheckoutSpy);

      const page = await newSpecPage({
        components: [JustifiModularCheckout],
        html: `<justifi-modular-checkout auth-token="tok" checkout-id="chk_1"></justifi-modular-checkout>`,
      });

      await page.waitForChanges();

      expect(getCheckoutSpy).toHaveBeenCalledTimes(1);
      expect(checkoutStore.checkoutLoaded).toBe(true);
      expect(checkoutStore.checkoutMode).toBe('test');
    });

    it('maps checkout.mode live to checkoutStore.checkoutMode', async () => {
      const getCheckoutSpy = jest.fn(({ onSuccess }: any) => {
        onSuccess({
          checkout: { ...mockCheckout, mode: 'live', status: ICheckoutStatus.created },
        });
      });
      (checkoutActions.makeGetCheckout as jest.Mock).mockReturnValue(getCheckoutSpy);

      const page = await newSpecPage({
        components: [JustifiModularCheckout],
        html: `<justifi-modular-checkout auth-token="tok" checkout-id="chk_1"></justifi-modular-checkout>`,
      });

      await page.waitForChanges();

      expect(checkoutStore.checkoutMode).toBe('live');
    });

    it('sets checkoutStore.checkoutMode null when mode is absent or unknown', async () => {
      const getCheckoutSpy = jest.fn(({ onSuccess }: any) => {
        onSuccess({
          checkout: { ...mockCheckout, mode: undefined, status: ICheckoutStatus.created },
        });
      });
      (checkoutActions.makeGetCheckout as jest.Mock).mockReturnValue(getCheckoutSpy);

      const page = await newSpecPage({
        components: [JustifiModularCheckout],
        html: `<justifi-modular-checkout auth-token="tok" checkout-id="chk_1"></justifi-modular-checkout>`,
      });

      await page.waitForChanges();

      expect(checkoutStore.checkoutMode).toBeNull();
    });

    // Skip: insurance store subscription (insuranceValuesOn) does not trigger reliably in test env
    it.skip('re-fetches checkout when insurance values change', async () => {
      const getCheckoutSpy = jest.fn(({ onSuccess }: any) => {
        onSuccess({ checkout: { ...mockCheckout, status: ICheckoutStatus.created } });
      });
      (checkoutActions.makeGetCheckout as jest.Mock).mockReturnValue(getCheckoutSpy);

      const page = await newSpecPage({
        components: [JustifiModularCheckout],
        html: `<justifi-modular-checkout auth-token="tok" checkout-id="chk_1"></justifi-modular-checkout>`,
      });

      const instance: any = page.rootInstance;
      instance.getCheckout = getCheckoutSpy;

      await page.waitForChanges();
      expect(getCheckoutSpy).toHaveBeenCalledTimes(1);

      insuranceValues['season_interruption'] = true;
      insuranceValues['set'] = 'season_interruption';
      await page.waitForChanges();

      insuranceValues['season_interruption'] = false;
      insuranceValues['set'] = 'other';
      insuranceValues['set'] = 'season_interruption';
      await page.waitForChanges();

      expect(getCheckoutSpy).toHaveBeenCalledTimes(2);
    });

    it('emits NOT_AUTHENTICATED when auth token or checkout ID is missing', async () => {
      const page = await newSpecPage({
        components: [JustifiModularCheckout],
        html: `<justifi-modular-checkout auth-token="" checkout-id="chk_1"></justifi-modular-checkout>`,
      });

      const root = page.root as HTMLElement;
      const handler = jest.fn();
      root.addEventListener('error-event', handler as any);

      const instance: any = page.rootInstance;
      instance['fetchCheckout']();

      expect(handler).toHaveBeenCalled();
      const event = handler.mock.calls[0][0];
      expect(event.detail).toMatchObject({
        errorCode: ComponentErrorCodes.NOT_AUTHENTICATED,
        message: ComponentErrorMessages.NOT_AUTHENTICATED,
        severity: ComponentErrorSeverity.ERROR,
      });
    });

    it('emits CHECKOUT_ALREADY_COMPLETED for completed checkouts', async () => {
      const page = await newSpecPage({
        components: [JustifiModularCheckout],
        html: `<justifi-modular-checkout auth-token="tok" checkout-id="chk_1"></justifi-modular-checkout>`,
      });

      const root = page.root as HTMLElement;
      const handler = jest.fn();
      root.addEventListener('error-event', handler as any);

      const instance: any = page.rootInstance;
      instance.getCheckout = jest.fn(({ onSuccess }: any) => {
        onSuccess({ checkout: { ...mockCheckout, status: ICheckoutStatus.completed } });
      });

      instance['fetchCheckout']();

      expect(handler).toHaveBeenCalled();
      const event = handler.mock.calls[0][0];
      expect(event.detail).toMatchObject({
        errorCode: ComponentErrorCodes.CHECKOUT_ALREADY_COMPLETED,
        message: ComponentErrorMessages.CHECKOUT_ALREADY_COMPLETED,
        severity: ComponentErrorSeverity.ERROR,
      });
    });

    it('emits CHECKOUT_EXPIRED for expired checkouts', async () => {
      const page = await newSpecPage({
        components: [JustifiModularCheckout],
        html: `<justifi-modular-checkout auth-token="tok" checkout-id="chk_1"></justifi-modular-checkout>`,
      });

      const root = page.root as HTMLElement;
      const handler = jest.fn();
      root.addEventListener('error-event', handler as any);

      const instance: any = page.rootInstance;
      instance.getCheckout = jest.fn(({ onSuccess }: any) => {
        onSuccess({ checkout: { ...mockCheckout, status: ICheckoutStatus.expired } });
      });

      instance['fetchCheckout']();

      expect(handler).toHaveBeenCalled();
      const event = handler.mock.calls[0][0];
      expect(event.detail).toMatchObject({
        errorCode: ComponentErrorCodes.CHECKOUT_EXPIRED,
        message: ComponentErrorMessages.CHECKOUT_EXPIRED,
        severity: ComponentErrorSeverity.ERROR,
      });
    });

    it('emits error when fetch fails', async () => {
      const page = await newSpecPage({
        components: [JustifiModularCheckout],
        html: `<justifi-modular-checkout auth-token="tok" checkout-id="chk_1"></justifi-modular-checkout>`,
      });

      const root = page.root as HTMLElement;
      const handler = jest.fn();
      root.addEventListener('error-event', handler as any);

      const instance: any = page.rootInstance;
      instance.getCheckout = jest.fn(({ onError }: any) => {
        onError({ message: 'Network error', code: 'fetch-error', severity: ComponentErrorSeverity.ERROR });
      });

      instance['fetchCheckout']();

      expect(handler).toHaveBeenCalled();
      const event = handler.mock.calls[0][0];
      expect(event.detail).toMatchObject({
        message: 'Network error',
        severity: ComponentErrorSeverity.ERROR,
      });
    });
  });

  it('sets bankAccountVerification from checkout.payment_settings', async () => {
    const page = await newSpecPage({
      components: [JustifiModularCheckout],
      html: `<justifi-modular-checkout auth-token="test" checkout-id="chk_123"></justifi-modular-checkout>`,
    });

    const instance: any = page.rootInstance;

    // Simulate checkout payload
    const checkout: any = {
      account_id: 'acc_123',
      payment_methods: [],
      payment_method_group_id: 'pmg_123',
      payment_description: 'desc',
      total_amount: 100,
      payment_amount: 100,
      payment_settings: {
        ach_payments: true,
        bnpl_payments: false,
        bank_account_verification: false,
        apple_payments: true,
      },
    };

    // Call private method directly for unit test purposes
    instance['updateStore'](checkout);

    expect(checkoutStore.bankAccountVerification).toBe(false);
    expect(checkoutStore.applePayEnabled).toBe(true);
    expect(checkoutStore.achPaymentsEnabled).toBe(true);
  });

  it('excludes saved bank payment methods from store when ach_payments is false', async () => {
    const page = await newSpecPage({
      components: [JustifiModularCheckout],
      html: `<justifi-modular-checkout auth-token="test" checkout-id="chk_123"></justifi-modular-checkout>`,
    });

    const instance: any = page.rootInstance;

    const basePm = {
      status: 'valid',
      invalid_reason: null,
      name: 'Test',
      month: '12',
      year: '2030',
      address_line1_check: 'pass',
      address_postal_code_check: 'pass',
      bin_details: null,
    };

    const checkout: any = {
      account_id: 'acc_123',
      payment_methods: [
        {
          ...basePm,
          id: 'pm_card',
          type: 'card',
          brand: 'visa',
          acct_last_four: '4242',
          account_type: 'checking',
        },
        {
          ...basePm,
          id: 'pm_bank',
          type: 'bank_account',
          brand: 'ach',
          acct_last_four: '0000',
          account_type: 'checking',
        },
      ],
      payment_method_group_id: 'pmg_123',
      payment_description: 'desc',
      total_amount: 100,
      payment_amount: 100,
      payment_settings: {
        ach_payments: false,
        bnpl_payments: false,
        bank_account_verification: false,
        apple_payments: false,
        google_payments: false,
        insurance_payments: false,
      },
    };

    instance['updateStore'](checkout);

    expect(checkoutStore.achPaymentsEnabled).toBe(false);
    expect(checkoutStore.paymentMethods.map((pm) => pm.id)).toEqual(['pm_card']);
  });

  describe('checkout-changed event', () => {
    beforeEach(() => {
      checkoutStore.disableCreditCard = false;
      checkoutStore.disableBankAccount = false;
      checkoutStore.disablePaymentMethodGroup = false;
      checkoutStore.bnplEnabled = false;
      checkoutStore.bankAccountVerification = undefined;
      checkoutStore.paymentMethods = [] as any;
      checkoutStore.checkoutLoaded = false;
      checkoutStore.achPaymentsEnabled = true;
    });

    it('emits checkout-changed with availablePaymentMethodTypes on store updates', async () => {
      const page = await newSpecPage({
        components: [JustifiModularCheckout],
        html: `<justifi-modular-checkout auth-token="test" checkout-id="chk_123"></justifi-modular-checkout>`,
      });

      const root = page.root as HTMLElement;

      // Listen for event
      const handler = jest.fn();
      root.addEventListener('checkout-changed', handler as any);

      // Trigger store changes that affect availablePaymentMethods
      checkoutStore.bnplEnabled = true;
      await page.waitForChanges();
      checkoutStore.applePayEnabled = true;
      await page.waitForChanges();
      checkoutStore.paymentMethods = [
        { id: 'pm1', type: PAYMENT_METHODS.SAVED_CARD } as any,
        { id: 'pm2', type: PAYMENT_METHODS.SAVED_BANK_ACCOUNT } as any,
      ];
      await page.waitForChanges();

      expect(handler).toHaveBeenCalled();
      const lastCall = handler.mock.calls[handler.mock.calls.length - 1][0];
      const detail = (lastCall as CustomEvent).detail as any;
      expect(detail.availablePaymentMethodTypes).toEqual(
        expect.arrayContaining(['saved_card', 'saved_bank_account', 'new_card', 'new_bank_account', 'sezzle', 'apple_pay'])
      );
    });
  });

  describe('queryFormRefs auto-selects payment method from DOM', () => {
    beforeEach(() => {
      checkoutStore.selectedPaymentMethod = undefined;
    });

    afterEach(() => {
      (checkoutActions.makeGetCheckout as jest.Mock).mockImplementation(() => {
        return jest.fn(async ({ onSuccess }: any) => {
          onSuccess({
            checkout: { ...mockCheckoutForFetch, status: ICheckoutStatus.created },
          });
        });
      });
    });

    it('sets selectedPaymentMethod to NEW_CARD when justifi-card-form is present', async () => {
      const page = await newSpecPage({
        components: [JustifiModularCheckout, JustifiCardForm],
        html: `<justifi-modular-checkout auth-token="test" checkout-id="chk_123">
          <justifi-card-form></justifi-card-form>
        </justifi-modular-checkout>`,
      });

      await page.waitForChanges();

      expect(checkoutStore.selectedPaymentMethod).toEqual({ type: PAYMENT_METHODS.NEW_CARD });
    });

    it('sets selectedPaymentMethod to NEW_BANK_ACCOUNT when justifi-bank-account-form is present', async () => {
      const page = await newSpecPage({
        components: [JustifiModularCheckout, JustifiBankAccountForm],
        html: `<justifi-modular-checkout auth-token="test" checkout-id="chk_123">
          <justifi-bank-account-form></justifi-bank-account-form>
        </justifi-modular-checkout>`,
      });

      await page.waitForChanges();

      expect(checkoutStore.selectedPaymentMethod).toEqual({ type: PAYMENT_METHODS.NEW_BANK_ACCOUNT });
    });

    it('does not set NEW_BANK_ACCOUNT when ach_payments is false after checkout loads', async () => {
      const getCheckoutSpy = jest.fn(({ onSuccess }: any) => {
        onSuccess({
          checkout: {
            ...mockCheckoutForFetch,
            status: ICheckoutStatus.created,
            payment_settings: {
              ...mockCheckoutForFetch.payment_settings,
              ach_payments: false,
            },
          },
        });
      });
      (checkoutActions.makeGetCheckout as jest.Mock).mockReturnValue(getCheckoutSpy);

      checkoutStore.selectedPaymentMethod = undefined;

      const page = await newSpecPage({
        components: [JustifiModularCheckout, JustifiBankAccountForm],
        html: `<justifi-modular-checkout auth-token="test" checkout-id="chk_123">
          <justifi-bank-account-form></justifi-bank-account-form>
        </justifi-modular-checkout>`,
      });

      await page.waitForChanges();

      expect(checkoutStore.achPaymentsEnabled).toBe(false);
      expect(checkoutStore.selectedPaymentMethod).toBeUndefined();
    });

    it('does not override already-set selectedPaymentMethod', async () => {
      checkoutStore.selectedPaymentMethod = { type: PAYMENT_METHODS.SAVED_CARD, id: 'pm_123' };

      const page = await newSpecPage({
        components: [JustifiModularCheckout, JustifiCardForm],
        html: `<justifi-modular-checkout auth-token="test" checkout-id="chk_123">
          <justifi-card-form></justifi-card-form>
        </justifi-modular-checkout>`,
      });

      await page.waitForChanges();

      expect(checkoutStore.selectedPaymentMethod).toEqual({ type: PAYMENT_METHODS.SAVED_CARD, id: 'pm_123' });
    });
  });

  describe('submitCheckout behavior and Apple Pay event handling', () => {
    beforeEach(() => {
      checkoutStore.checkoutLoaded = true;
      checkoutStore.authToken = 'auth';
      checkoutStore.accountId = 'acc_1';
      checkoutStore.paymentAmount = 1000;
      checkoutStore.paymentCurrency = 'USD';
      checkoutStore.selectedPaymentMethod = undefined;
      checkoutStore.paymentToken = undefined;
      checkoutStore.bnplEnabled = false;
      checkoutStore.isSubmitting = false;
      checkoutStore.isWalletProcessing = false;
    });

    it('emits error when submit called without selected payment method', async () => {
      const page = await newSpecPage({
        components: [JustifiModularCheckout],
        html: `<justifi-modular-checkout auth-token="t" checkout-id="chk_1"></justifi-modular-checkout>`,
      });

      const root = page.root as HTMLElement;
      const handler = jest.fn();
      root.addEventListener('error-event', handler as any);

      const instance: any = page.rootInstance;
      instance.completeCheckout = jest.fn();

      await instance.submitCheckout();

      expect(handler).toHaveBeenCalled();
      expect((instance.completeCheckout as jest.Mock)).not.toHaveBeenCalled();
    });

    it('blocks submission if validation fails', async () => {
      checkoutStore.selectedPaymentMethod = { type: PAYMENT_METHODS.SAVED_CARD, id: 'pm_123' };
      checkoutStore.paymentToken = 'pm_123';

      const page = await newSpecPage({
        components: [JustifiModularCheckout],
        html: `<justifi-modular-checkout auth-token="t" checkout-id="chk_1"></justifi-modular-checkout>`,
      });

      const root = page.root as HTMLElement;
      const handler = jest.fn();
      root.addEventListener('error-event', handler as any);

      const instance: any = page.rootInstance;
      instance.completeCheckout = jest.fn();
      instance.validate = jest.fn().mockResolvedValue(false);

      await instance.submitCheckout();

      expect(instance.completeCheckout).not.toHaveBeenCalled();
      expect(handler).toHaveBeenCalled();
      const event = handler.mock.calls[0][0];
      expect(event.detail.errorCode).toBe(ComponentErrorCodes.VALIDATION_ERROR);
    });

    it('blocks submission if no payment token is available after all steps', async () => {
      checkoutStore.selectedPaymentMethod = { type: PAYMENT_METHODS.SAVED_CARD, id: 'pm_123' };
      checkoutStore.paymentToken = undefined;

      const page = await newSpecPage({
        components: [JustifiModularCheckout],
        html: `<justifi-modular-checkout auth-token="t" checkout-id="chk_1"></justifi-modular-checkout>`,
      });

      const root = page.root as HTMLElement;
      const handler = jest.fn();
      root.addEventListener('error-event', handler as any);

      const instance: any = page.rootInstance;
      instance.completeCheckout = jest.fn();

      await instance.submitCheckout();

      expect(instance.completeCheckout).not.toHaveBeenCalled();
      expect(handler).toHaveBeenCalled();
      const event = handler.mock.calls[0][0];
      expect(event.detail.errorCode).toBe(ComponentErrorCodes.TOKENIZE_ERROR);
    });

    it('maps payment mode correctly for different payment methods', async () => {
      const page = await newSpecPage({
        components: [JustifiModularCheckout],
        html: `<justifi-modular-checkout auth-token="t" checkout-id="chk_1"></justifi-modular-checkout>`,
      });

      const instance: any = page.rootInstance;
      instance.completeCheckout = jest.fn(({ onSuccess }: any) => {
        onSuccess({ checkout: { id: 'chk_1', status: 'completed' } });
      });
      // Avoid hitting real tokenize path for new card/bank account
      instance.tokenizePaymentMethod = jest.fn().mockResolvedValue('tok_123');

      const assertPaymentMode = async (type: PAYMENT_METHODS, expectedMode: string) => {
        checkoutStore.selectedPaymentMethod = { type } as any;
        checkoutStore.paymentToken = 'tok_123';
        await instance.submitCheckout();
        const call = (instance.completeCheckout as jest.Mock).mock.calls.pop();
        expect(call[0].payment.payment_mode).toBe(expectedMode);
      };

      await assertPaymentMode(PAYMENT_METHODS.NEW_CARD, 'ecom');
      await assertPaymentMode(PAYMENT_METHODS.SAVED_CARD, 'ecom');
      await assertPaymentMode(PAYMENT_METHODS.NEW_BANK_ACCOUNT, 'ecom');
      await assertPaymentMode(PAYMENT_METHODS.SAVED_BANK_ACCOUNT, 'ecom');
      await assertPaymentMode(PAYMENT_METHODS.SEZZLE, 'bnpl');
      await assertPaymentMode(PAYMENT_METHODS.APPLE_PAY, 'apple_pay');
      await assertPaymentMode(PAYMENT_METHODS.GOOGLE_PAY, 'google_pay');
    });

    it('handles Apple Pay completed event success by setting token and submitting', async () => {
      const page = await newSpecPage({
        components: [JustifiModularCheckout],
        html: `<justifi-modular-checkout auth-token="t" checkout-id="chk_1"></justifi-modular-checkout>`,
      });

      const instance: any = page.rootInstance;
      instance.completeCheckout = jest.fn();

      const event = new CustomEvent('applePayCompleted', {
        detail: { success: true, token: { id: 'pm_apple' }, paymentMethodId: 'pm_apple' },
      } as any);

      // Call the handler directly to simulate event
      (instance as any).handleApplePayCompleted(event);

      await page.waitForChanges();

      expect(checkoutStore.paymentToken).toBe('pm_apple');
      expect((instance.completeCheckout as jest.Mock)).toHaveBeenCalledTimes(1);
    });

    it('handles Apple Pay error by emitting error-event', async () => {
      const page = await newSpecPage({
        components: [JustifiModularCheckout],
        html: `<justifi-modular-checkout auth-token="t" checkout-id="chk_1"></justifi-modular-checkout>`,
      });

      const root = page.root as HTMLElement;
      const handler = jest.fn();
      root.addEventListener('error-event', handler as any);

      const instance: any = page.rootInstance;
      const event = new CustomEvent('applePayError', { detail: { error: 'boom', code: 'X' } } as any);
      (instance as any).handleApplePayError(event);

      expect(handler).toHaveBeenCalled();
    });

    it('clears selection on Apple Pay cancellation', async () => {
      checkoutStore.paymentToken = 'pm_123';
      checkoutStore.selectedPaymentMethod = { type: PAYMENT_METHODS.APPLE_PAY };

      const page = await newSpecPage({
        components: [JustifiModularCheckout],
        html: `<justifi-modular-checkout auth-token="t" checkout-id="chk_1"></justifi-modular-checkout>`,
      });

      const instance: any = page.rootInstance;
      (instance as any).handleApplePayCancelled();

      expect(checkoutStore.paymentToken).toBeUndefined();
      expect(checkoutStore.selectedPaymentMethod).toBeUndefined();
    });

    it('handles Google Pay completed event success by setting token and submitting', async () => {
      const page = await newSpecPage({
        components: [JustifiModularCheckout],
        html: `<justifi-modular-checkout auth-token="t" checkout-id="chk_1"></justifi-modular-checkout>`,
      });

      const instance: any = page.rootInstance;
      instance.completeCheckout = jest.fn();

      const event = new CustomEvent('googlePayCompleted', {
        detail: { success: true, paymentMethodId: 'pm_google_123' },
      } as any);

      (instance as any).handleGooglePayCompleted(event);

      await page.waitForChanges();

      expect(checkoutStore.paymentToken).toBe('pm_google_123');
      expect(checkoutStore.selectedPaymentMethod).toEqual({ type: PAYMENT_METHODS.GOOGLE_PAY });
      expect((instance.completeCheckout as jest.Mock)).toHaveBeenCalledTimes(1);
    });

    it('handles Google Pay error by emitting error-event', async () => {
      const page = await newSpecPage({
        components: [JustifiModularCheckout],
        html: `<justifi-modular-checkout auth-token="t" checkout-id="chk_1"></justifi-modular-checkout>`,
      });

      const root = page.root as HTMLElement;
      const handler = jest.fn();
      root.addEventListener('error-event', handler as any);

      const instance: any = page.rootInstance;
      const event = new CustomEvent('googlePayCompleted', {
        detail: { success: false, error: { code: 'ERR', message: 'Payment failed' } },
      } as any);

      (instance as any).handleGooglePayCompleted(event);

      expect(handler).toHaveBeenCalled();
      const detail = handler.mock.calls[0][0].detail;
      expect(detail.message).toBe('Payment failed');
    });

    it('handles Google Pay cancelled by clearing paymentToken and selectedPaymentMethod', async () => {
      checkoutStore.paymentToken = 'pm_123';
      checkoutStore.selectedPaymentMethod = { type: PAYMENT_METHODS.GOOGLE_PAY };

      const page = await newSpecPage({
        components: [JustifiModularCheckout],
        html: `<justifi-modular-checkout auth-token="t" checkout-id="chk_1"></justifi-modular-checkout>`,
      });

      const instance: any = page.rootInstance;
      (instance as any).handleGooglePayCancelled();

      expect(checkoutStore.paymentToken).toBeUndefined();
      expect(checkoutStore.selectedPaymentMethod).toBeUndefined();
    });
  });

  describe('submitCheckout isSubmitting guard and lifecycle', () => {
    beforeEach(() => {
      checkoutStore.checkoutLoaded = true;
      checkoutStore.authToken = 'auth';
      checkoutStore.accountId = 'acc_1';
      checkoutStore.paymentAmount = 1000;
      checkoutStore.paymentCurrency = 'USD';
      checkoutStore.selectedPaymentMethod = { type: PAYMENT_METHODS.SAVED_CARD, id: 'pm_123' };
      checkoutStore.paymentToken = 'pm_123';
      checkoutStore.isSubmitting = false;
      checkoutStore.isWalletProcessing = false;
    });

    it('submitCheckout sets isSubmitting = true synchronously at start', async () => {
      const page = await newSpecPage({
        components: [JustifiModularCheckout],
        html: `<justifi-modular-checkout auth-token="t" checkout-id="chk_1"></justifi-modular-checkout>`,
      });

      const instance: any = page.rootInstance;
      instance.completeCheckout = jest.fn(({ onSuccess }: any) => {
        onSuccess({ checkout: { id: 'chk_1', status: 'completed' } });
      });

      const submitPromise = instance.submitCheckout();
      expect(checkoutStore.isSubmitting).toBe(true);
      await submitPromise;
    });

    it('second call while isSubmitting returns without calling completeCheckout', async () => {
      const page = await newSpecPage({
        components: [JustifiModularCheckout],
        html: `<justifi-modular-checkout auth-token="t" checkout-id="chk_1"></justifi-modular-checkout>`,
      });

      const instance: any = page.rootInstance;
      let resolveComplete: () => void;
      const completePromise = new Promise<void>((r) => { resolveComplete = r; });
      instance.completeCheckout = jest.fn(({ onSuccess }: any) => {
        setTimeout(() => {
          onSuccess({ checkout: { id: 'chk_1', status: 'completed' } });
          resolveComplete();
        }, 10);
      });

      const p1 = instance.submitCheckout();
      const p2 = instance.submitCheckout();
      await completePromise;
      await p1;
      await p2;

      expect(instance.completeCheckout).toHaveBeenCalledTimes(1);
    });

    it('isSubmitting reset to false after completeCheckout onSuccess', async () => {
      const page = await newSpecPage({
        components: [JustifiModularCheckout],
        html: `<justifi-modular-checkout auth-token="t" checkout-id="chk_1"></justifi-modular-checkout>`,
      });

      const instance: any = page.rootInstance;
      instance.completeCheckout = jest.fn(({ onSuccess }: any) => {
        onSuccess({ checkout: { id: 'chk_1', status: 'completed' } });
      });

      await instance.submitCheckout();

      expect(checkoutStore.isSubmitting).toBe(false);
    });

    it('isSubmitting reset to false after completeCheckout onError', async () => {
      const page = await newSpecPage({
        components: [JustifiModularCheckout],
        html: `<justifi-modular-checkout auth-token="t" checkout-id="chk_1"></justifi-modular-checkout>`,
      });

      const root = page.root as HTMLElement;
      const handler = jest.fn();
      root.addEventListener('error-event', handler as any);

      const instance: any = page.rootInstance;
      instance.completeCheckout = jest.fn(({ onError }: any) => {
        onError({ message: 'Completion failed', code: 'complete-error', severity: ComponentErrorSeverity.ERROR });
      });

      await instance.submitCheckout();

      expect(checkoutStore.isSubmitting).toBe(false);
    });

    it('isSubmitting reset to false on early-return path (validation fail)', async () => {
      checkoutStore.selectedPaymentMethod = { type: PAYMENT_METHODS.SAVED_CARD, id: 'pm_123' };
      checkoutStore.paymentToken = 'pm_123';

      const page = await newSpecPage({
        components: [JustifiModularCheckout],
        html: `<justifi-modular-checkout auth-token="t" checkout-id="chk_1"></justifi-modular-checkout>`,
      });

      const root = page.root as HTMLElement;
      const handler = jest.fn();
      root.addEventListener('error-event', handler as any);

      const instance: any = page.rootInstance;
      instance.completeCheckout = jest.fn();
      instance.validate = jest.fn().mockResolvedValue(false);

      await instance.submitCheckout();

      expect(checkoutStore.isSubmitting).toBe(false);
    });

    it('isSubmitting reset to false on early-return path (no token)', async () => {
      checkoutStore.selectedPaymentMethod = { type: PAYMENT_METHODS.SAVED_CARD, id: 'pm_123' };
      checkoutStore.paymentToken = undefined;

      const page = await newSpecPage({
        components: [JustifiModularCheckout],
        html: `<justifi-modular-checkout auth-token="t" checkout-id="chk_1"></justifi-modular-checkout>`,
      });

      const root = page.root as HTMLElement;
      const handler = jest.fn();
      root.addEventListener('error-event', handler as any);

      const instance: any = page.rootInstance;
      instance.completeCheckout = jest.fn();

      await instance.submitCheckout();

      expect(checkoutStore.isSubmitting).toBe(false);
    });

    it('isSubmitting reset to false on early-return path (tokenize error)', async () => {
      checkoutStore.selectedPaymentMethod = { type: PAYMENT_METHODS.NEW_CARD };

      const page = await newSpecPage({
        components: [JustifiModularCheckout],
        html: `<justifi-modular-checkout auth-token="t" checkout-id="chk_1"></justifi-modular-checkout>`,
      });

      const root = page.root as HTMLElement;
      const handler = jest.fn();
      root.addEventListener('error-event', handler as any);

      const instance: any = page.rootInstance;
      instance.completeCheckout = jest.fn();
      mockFormRefs(instance, {
        paymentMethodFormRef: {
          validate: jest.fn().mockResolvedValue(true),
          tokenize: jest.fn().mockResolvedValue({ error: { message: 'Tokenization failed' } }),
          tagName: 'JUSTIFI-CARD-FORM',
        },
        billingFormRef: {
          validate: jest.fn().mockResolvedValue(true),
          getValues: jest.fn().mockResolvedValue({}),
        },
      });

      await instance.submitCheckout();

      expect(checkoutStore.isSubmitting).toBe(false);
    });
  });

  describe('isWalletProcessing lifecycle in wallet handlers', () => {
    beforeEach(() => {
      checkoutStore.checkoutLoaded = true;
      checkoutStore.authToken = 'auth';
      checkoutStore.accountId = 'acc_1';
      checkoutStore.paymentAmount = 1000;
      checkoutStore.paymentCurrency = 'USD';
      checkoutStore.selectedPaymentMethod = undefined;
      checkoutStore.paymentToken = undefined;
      checkoutStore.isSubmitting = false;
      checkoutStore.isWalletProcessing = false;
    });

    it('handleApplePayStarted sets isWalletProcessing = true', async () => {
      const page = await newSpecPage({
        components: [JustifiModularCheckout],
        html: `<justifi-modular-checkout auth-token="t" checkout-id="chk_1"></justifi-modular-checkout>`,
      });

      const instance: any = page.rootInstance;
      (instance as any).handleApplePayStarted();

      expect(checkoutStore.isWalletProcessing).toBe(true);
    });

    it('handleGooglePayStarted sets isWalletProcessing = true', async () => {
      const page = await newSpecPage({
        components: [JustifiModularCheckout],
        html: `<justifi-modular-checkout auth-token="t" checkout-id="chk_1"></justifi-modular-checkout>`,
      });

      const instance: any = page.rootInstance;
      (instance as any).handleGooglePayStarted();

      expect(checkoutStore.isWalletProcessing).toBe(true);
    });

    it('handleApplePayCancelled resets isWalletProcessing = false', async () => {
      checkoutStore.isWalletProcessing = true;

      const page = await newSpecPage({
        components: [JustifiModularCheckout],
        html: `<justifi-modular-checkout auth-token="t" checkout-id="chk_1"></justifi-modular-checkout>`,
      });

      const instance: any = page.rootInstance;
      (instance as any).handleApplePayCancelled();

      expect(checkoutStore.isWalletProcessing).toBe(false);
    });

    it('handleApplePayError resets isWalletProcessing = false', async () => {
      checkoutStore.isWalletProcessing = true;

      const page = await newSpecPage({
        components: [JustifiModularCheckout],
        html: `<justifi-modular-checkout auth-token="t" checkout-id="chk_1"></justifi-modular-checkout>`,
      });

      const root = page.root as HTMLElement;
      const handler = jest.fn();
      root.addEventListener('error-event', handler as any);

      const instance: any = page.rootInstance;
      const event = new CustomEvent('applePayError', { detail: { error: 'boom', code: 'X' } } as any);
      (instance as any).handleApplePayError(event);

      expect(checkoutStore.isWalletProcessing).toBe(false);
    });

    it('handleApplePayCompleted (success) clears isWalletProcessing before completeCheckout', async () => {
      const page = await newSpecPage({
        components: [JustifiModularCheckout],
        html: `<justifi-modular-checkout auth-token="t" checkout-id="chk_1"></justifi-modular-checkout>`,
      });

      const instance: any = page.rootInstance;
      let isWalletProcessingWhenCompleteCalled = true;
      instance.completeCheckout = jest.fn(() => {
        isWalletProcessingWhenCompleteCalled = checkoutStore.isWalletProcessing;
      });

      const event = new CustomEvent('applePayCompleted', {
        detail: { success: true, token: { id: 'pm_apple' }, paymentMethodId: 'pm_apple' },
      } as any);

      checkoutStore.isWalletProcessing = true;
      (instance as any).handleApplePayCompleted(event);

      await page.waitForChanges();

      expect(isWalletProcessingWhenCompleteCalled).toBe(false);
    });

    it('handleGooglePayCancelled resets isWalletProcessing = false', async () => {
      checkoutStore.isWalletProcessing = true;

      const page = await newSpecPage({
        components: [JustifiModularCheckout],
        html: `<justifi-modular-checkout auth-token="t" checkout-id="chk_1"></justifi-modular-checkout>`,
      });

      const instance: any = page.rootInstance;
      (instance as any).handleGooglePayCancelled();

      expect(checkoutStore.isWalletProcessing).toBe(false);
    });

    it('handleGooglePayCompleted (success) clears isWalletProcessing before completeCheckout', async () => {
      const page = await newSpecPage({
        components: [JustifiModularCheckout],
        html: `<justifi-modular-checkout auth-token="t" checkout-id="chk_1"></justifi-modular-checkout>`,
      });

      const instance: any = page.rootInstance;
      let isWalletProcessingWhenCompleteCalled = true;
      instance.completeCheckout = jest.fn(() => {
        isWalletProcessingWhenCompleteCalled = checkoutStore.isWalletProcessing;
      });

      const event = new CustomEvent('googlePayCompleted', {
        detail: { success: true, paymentMethodId: 'pm_google_123' },
      } as any);

      checkoutStore.isWalletProcessing = true;
      (instance as any).handleGooglePayCompleted(event);

      await page.waitForChanges();

      expect(isWalletProcessingWhenCompleteCalled).toBe(false);
    });
  });

  describe('preCompleteHook', () => {
    beforeEach(() => {
      checkoutStore.checkoutLoaded = true;
      checkoutStore.authToken = 'auth';
      checkoutStore.accountId = 'acc_1';
      checkoutStore.paymentAmount = 1000;
      checkoutStore.totalAmount = 1050;
      checkoutStore.paymentCurrency = 'USD';
      checkoutStore.selectedPaymentMethod = { type: PAYMENT_METHODS.SAVED_CARD, id: 'pm_123' };
      checkoutStore.paymentToken = 'pm_123';
      checkoutStore.isSubmitting = false;
      checkoutStore.isWalletProcessing = false;
    });

    it('proceeds with submission when hook calls resolve()', async () => {
      const page = await newSpecPage({
        components: [JustifiModularCheckout],
        html: `<justifi-modular-checkout auth-token="t" checkout-id="chk_1"></justifi-modular-checkout>`,
      });

      const instance: any = page.rootInstance;
      instance.completeCheckout = jest.fn();

      const hookFn = jest.fn((state, resolve, _reject) => {
        resolve(state);
      });
      instance.preCompleteHook = hookFn;

      await instance.submitCheckout();

      expect(hookFn).toHaveBeenCalledTimes(1);
      expect(instance.completeCheckout).toHaveBeenCalledTimes(1);
    });

    it('cancels submission when hook calls reject()', async () => {
      const page = await newSpecPage({
        components: [JustifiModularCheckout],
        html: `<justifi-modular-checkout auth-token="t" checkout-id="chk_1"></justifi-modular-checkout>`,
      });

      const instance: any = page.rootInstance;
      instance.completeCheckout = jest.fn();

      const hookFn = jest.fn((_state, _resolve, reject) => {
        reject();
      });
      instance.preCompleteHook = hookFn;

      await instance.submitCheckout();

      expect(hookFn).toHaveBeenCalledTimes(1);
      expect(instance.completeCheckout).not.toHaveBeenCalled();
    });

    it('proceeds with submission when no hook is provided', async () => {
      const page = await newSpecPage({
        components: [JustifiModularCheckout],
        html: `<justifi-modular-checkout auth-token="t" checkout-id="chk_1"></justifi-modular-checkout>`,
      });

      const instance: any = page.rootInstance;
      instance.completeCheckout = jest.fn();

      await instance.submitCheckout();

      expect(instance.completeCheckout).toHaveBeenCalledTimes(1);
    });

    it('passes full CheckoutState (including paymentToken) to hook for saved method', async () => {
      const page = await newSpecPage({
        components: [JustifiModularCheckout],
        html: `<justifi-modular-checkout auth-token="t" checkout-id="chk_1"></justifi-modular-checkout>`,
      });

      const instance: any = page.rootInstance;
      instance.completeCheckout = jest.fn();

      // Populate store to cover CheckoutState fields
      checkoutStore.paymentAmount = 2500;
      checkoutStore.totalAmount = 2500;
      checkoutStore.paymentCurrency = 'USD';
      checkoutStore.paymentDescription = 'desc';
      checkoutStore.savePaymentMethod = true;
      checkoutStore.bnplEnabled = true;
      checkoutStore.applePayEnabled = true;
      checkoutStore.insuranceEnabled = false;
      checkoutStore.disableBankAccount = false;
      checkoutStore.disableCreditCard = false;
      checkoutStore.disablePaymentMethodGroup = false;
      checkoutStore.selectedPaymentMethod = { type: PAYMENT_METHODS.SAVED_CARD, id: 'pm_123' } as any;
      checkoutStore.paymentToken = 'pm_123';

      let capturedState: any;
      const hookFn = jest.fn((state, resolve, _reject) => {
        capturedState = state;
        resolve(state);
      });
      instance.preCompleteHook = hookFn;

      await instance.submitCheckout();

      expect(hookFn).toHaveBeenCalledTimes(1);
      expect(instance.completeCheckout).toHaveBeenCalledTimes(1);
      expect(capturedState).toMatchObject({
        selectedPaymentMethod: { type: PAYMENT_METHODS.SAVED_CARD, id: 'pm_123' },
        paymentAmount: 2500,
        totalAmount: 2500,
        paymentCurrency: 'USD',
        paymentDescription: 'desc',
        savePaymentMethod: true,
        bnplEnabled: true,
        applePayEnabled: true,
        insuranceEnabled: false,
        disableBankAccount: false,
        disableCreditCard: false,
        disablePaymentMethodGroup: false,
        paymentToken: 'pm_123',
      });
    });

    it('provides paymentToken in hook state after tokenization for new card', async () => {
      const page = await newSpecPage({
        components: [JustifiModularCheckout],
        html: `<justifi-modular-checkout auth-token="t" checkout-id="chk_1"></justifi-modular-checkout>`,
      });

      const instance: any = page.rootInstance;
      instance.completeCheckout = jest.fn();

      // Avoid real tokenize path; ensure tokenization sets the token before hook
      (instance as any).tokenizePaymentMethod = jest.fn().mockImplementation(async () => {
        checkoutStore.paymentToken = 'tok_999';
        return 'tok_999';
      });

      checkoutStore.selectedPaymentMethod = { type: PAYMENT_METHODS.NEW_CARD } as any;

      let capturedToken: string | undefined;
      const hookFn = jest.fn((state, resolve, _reject) => {
        capturedToken = state.paymentToken;
        resolve(state);
      });
      instance.preCompleteHook = hookFn;

      await instance.submitCheckout();

      expect(hookFn).toHaveBeenCalledTimes(1);
      expect(capturedToken).toBe('tok_999');
      expect(instance.completeCheckout).toHaveBeenCalledTimes(1);
    });
  });

  describe('validate()', () => {
    beforeEach(() => {
      checkoutStore.insuranceEnabled = false;
      checkoutStore.selectedPaymentMethod = undefined;
    });

    // Skip: Stencil instance ref assignment does not persist for validate() in test env
    it.skip('validates insurance form when insurance is enabled', async () => {
      checkoutStore.insuranceEnabled = true;
      checkoutStore.selectedPaymentMethod = undefined;

      const insuranceValidateSpy = jest.fn().mockResolvedValue({ isValid: true });

      const page = await newSpecPage({
        components: [JustifiModularCheckout],
        html: `<justifi-modular-checkout auth-token="t" checkout-id="chk_1"></justifi-modular-checkout>`,
      });

      const instance: any = page.rootInstance;
      (instance as any).insuranceFormRef = { validate: insuranceValidateSpy };

      const result = await instance.validate();

      expect(insuranceValidateSpy).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('validates payment method and billing forms for new card', async () => {
      checkoutStore.selectedPaymentMethod = { type: PAYMENT_METHODS.NEW_CARD };

      const page = await newSpecPage({
        components: [JustifiModularCheckout],
        html: `<justifi-modular-checkout auth-token="t" checkout-id="chk_1"></justifi-modular-checkout>`,
      });

      const instance: any = page.rootInstance;
      mockFormRefs(instance);

      const result = await instance.validate();

      expect(instance.paymentMethodFormRef.validate).toHaveBeenCalled();
      expect(instance.billingFormRef.validate).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('validates payment method and billing forms for new bank account', async () => {
      checkoutStore.selectedPaymentMethod = { type: PAYMENT_METHODS.NEW_BANK_ACCOUNT };

      const page = await newSpecPage({
        components: [JustifiModularCheckout],
        html: `<justifi-modular-checkout auth-token="t" checkout-id="chk_1"></justifi-modular-checkout>`,
      });

      const instance: any = page.rootInstance;
      mockFormRefs(instance, {
        paymentMethodFormRef: { tagName: 'JUSTIFI-BANK-ACCOUNT-FORM' },
      });

      const result = await instance.validate();

      expect(instance.paymentMethodFormRef.validate).toHaveBeenCalled();
      expect(instance.billingFormRef.validate).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('skips payment and billing validation for saved payment methods', async () => {
      checkoutStore.selectedPaymentMethod = { type: PAYMENT_METHODS.SAVED_CARD, id: 'pm_123' };

      const page = await newSpecPage({
        components: [JustifiModularCheckout],
        html: `<justifi-modular-checkout auth-token="t" checkout-id="chk_1"></justifi-modular-checkout>`,
      });

      const instance: any = page.rootInstance;
      mockFormRefs(instance);

      const result = await instance.validate();

      expect(instance.paymentMethodFormRef?.validate).not.toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('emits VALIDATION_ERROR when validation fails', async () => {
      checkoutStore.selectedPaymentMethod = { type: PAYMENT_METHODS.NEW_CARD };

      const page = await newSpecPage({
        components: [JustifiModularCheckout],
        html: `<justifi-modular-checkout auth-token="t" checkout-id="chk_1"></justifi-modular-checkout>`,
      });

      const root = page.root as HTMLElement;
      const handler = jest.fn();
      root.addEventListener('error-event', handler as any);

      const instance: any = page.rootInstance;
      mockFormRefs(instance, {
        paymentMethodFormRef: { validate: jest.fn().mockResolvedValue(false) },
      });

      const result = await instance.validate();

      expect(result).toBe(false);
      const event = handler.mock.calls[0][0];
      expect(event.detail.errorCode).toBe(ComponentErrorCodes.VALIDATION_ERROR);
    });
  });

  describe('setSelectedPaymentMethod', () => {
    it('allows selecting a payment method externally including saved ones', async () => {
      const page = await newSpecPage({
        components: [JustifiModularCheckout],
        html: `<justifi-modular-checkout auth-token="t" checkout-id="chk_1"></justifi-modular-checkout>`,
      });

      const instance: any = page.rootInstance;

      await instance.setSelectedPaymentMethod({ type: PAYMENT_METHODS.SAVED_CARD, id: 'pm_x' });

      expect(checkoutStore.selectedPaymentMethod).toEqual({ type: PAYMENT_METHODS.SAVED_CARD, id: 'pm_x' });
      expect(checkoutStore.paymentToken).toBe('pm_x');
    });
  });

  describe('tokenization — card/bank', () => {
    beforeEach(() => {
      checkoutStore.checkoutLoaded = true;
      checkoutStore.authToken = 'auth';
      checkoutStore.accountId = 'acc_1';
      checkoutStore.paymentAmount = 1000;
      checkoutStore.paymentCurrency = 'USD';
      checkoutStore.paymentToken = undefined;
      checkoutStore.savePaymentMethod = false;
      checkoutStore.paymentMethodGroupId = undefined;
      checkoutStore.isSubmitting = false;
      checkoutStore.isWalletProcessing = false;
    });

    it('tokenizes new card payments with billing info', async () => {
      checkoutStore.selectedPaymentMethod = { type: PAYMENT_METHODS.NEW_CARD };

      const page = await newSpecPage({
        components: [JustifiModularCheckout],
        html: `<justifi-modular-checkout auth-token="auth" checkout-id="chk_1"></justifi-modular-checkout>`,
      });

      const instance: any = page.rootInstance;
      instance.completeCheckout = jest.fn();
      mockFormRefs(instance, {
        paymentMethodFormRef: {
          validate: jest.fn().mockResolvedValue(true),
          tokenize: jest.fn().mockResolvedValue({ id: 'tok_1' }),
          tagName: 'JUSTIFI-CARD-FORM',
        },
        billingFormRef: {
          validate: jest.fn().mockResolvedValue(true),
          getValues: jest.fn().mockResolvedValue({ name: 'Test', address_postal_code: '12345' }),
        },
      });

      await instance.submitCheckout();

      expect(checkoutStore.paymentToken).toBe('tok_1');
      expect(instance.completeCheckout).toHaveBeenCalledTimes(1);
    });

    it('tokenizes new bank account payments with billing info', async () => {
      checkoutStore.selectedPaymentMethod = { type: PAYMENT_METHODS.NEW_BANK_ACCOUNT };

      const page = await newSpecPage({
        components: [JustifiModularCheckout],
        html: `<justifi-modular-checkout auth-token="auth" checkout-id="chk_1"></justifi-modular-checkout>`,
      });

      const instance: any = page.rootInstance;
      instance.completeCheckout = jest.fn();
      mockFormRefs(instance, {
        paymentMethodFormRef: {
          validate: jest.fn().mockResolvedValue(true),
          tokenize: jest.fn().mockResolvedValue({ id: 'tok_bank_1' }),
          tagName: 'JUSTIFI-BANK-ACCOUNT-FORM',
        },
        billingFormRef: {
          validate: jest.fn().mockResolvedValue(true),
          getValues: jest.fn().mockResolvedValue({}),
        },
      });

      await instance.submitCheckout();

      expect(checkoutStore.paymentToken).toBe('tok_bank_1');
      expect(instance.completeCheckout).toHaveBeenCalledTimes(1);
    });

    it('includes payment_method_group_id only when save payment method is on', async () => {
      const tokenizeSpy = jest.fn().mockResolvedValue({ id: 'tok_1' });

      const page = await newSpecPage({
        components: [JustifiModularCheckout],
        html: `<justifi-modular-checkout auth-token="auth" checkout-id="chk_1"></justifi-modular-checkout>`,
      });

      const instance: any = page.rootInstance;
      instance.completeCheckout = jest.fn(({ onSuccess }: any) => {
        onSuccess({ checkout: { id: 'chk_1', status: 'completed' } });
      });
      mockFormRefs(instance, {
        paymentMethodFormRef: {
          validate: jest.fn().mockResolvedValue(true),
          tokenize: tokenizeSpy,
          tagName: 'JUSTIFI-CARD-FORM',
        },
        billingFormRef: {
          validate: jest.fn().mockResolvedValue(true),
          getValues: jest.fn().mockResolvedValue({}),
        },
      });

      checkoutStore.selectedPaymentMethod = { type: PAYMENT_METHODS.NEW_CARD };
      checkoutStore.savePaymentMethod = true;
      checkoutStore.paymentMethodGroupId = 'pmg_123';

      await instance.submitCheckout();

      expect(tokenizeSpy).toHaveBeenCalled();
      const tokenizeCall = tokenizeSpy.mock.calls[0][0];
      expect(tokenizeCall.paymentMethodMetadata?.payment_method_group_id).toBe('pmg_123');

      checkoutStore.savePaymentMethod = false;
      checkoutStore.paymentMethodGroupId = undefined;
      tokenizeSpy.mockClear();

      await instance.submitCheckout();

      const tokenizeCall2 = tokenizeSpy.mock.calls[0]?.[0];
      expect(tokenizeCall2.paymentMethodMetadata?.payment_method_group_id).toBeUndefined();
    });

    it('emits TOKENIZE_ERROR on tokenization failure', async () => {
      checkoutStore.selectedPaymentMethod = { type: PAYMENT_METHODS.NEW_CARD };

      const page = await newSpecPage({
        components: [JustifiModularCheckout],
        html: `<justifi-modular-checkout auth-token="auth" checkout-id="chk_1"></justifi-modular-checkout>`,
      });

      const root = page.root as HTMLElement;
      const handler = jest.fn();
      root.addEventListener('error-event', handler as any);

      const instance: any = page.rootInstance;
      instance.completeCheckout = jest.fn();
      mockFormRefs(instance, {
        paymentMethodFormRef: {
          validate: jest.fn().mockResolvedValue(true),
          tokenize: jest.fn().mockResolvedValue({ error: { message: 'Tokenization failed' } }),
          tagName: 'JUSTIFI-CARD-FORM',
        },
        billingFormRef: {
          validate: jest.fn().mockResolvedValue(true),
          getValues: jest.fn().mockResolvedValue({}),
        },
      });

      await instance.submitCheckout();

      expect(instance.completeCheckout).not.toHaveBeenCalled();
      const event = handler.mock.calls[0][0];
      expect(event.detail.errorCode).toBe(ComponentErrorCodes.TOKENIZE_ERROR);
    });
  });

  describe('tokenization — Plaid', () => {
    beforeEach(() => {
      checkoutStore.checkoutLoaded = true;
      checkoutStore.authToken = 'auth';
      checkoutStore.accountId = 'acc_1';
      checkoutStore.paymentAmount = 1000;
      checkoutStore.paymentCurrency = 'USD';
      checkoutStore.paymentToken = undefined;
      checkoutStore.plaidPublicToken = undefined;
      checkoutStore.plaidLinkTokenId = undefined;
      checkoutStore.savePaymentMethod = false;
      checkoutStore.paymentMethodGroupId = undefined;
      checkoutStore.isSubmitting = false;
      checkoutStore.isWalletProcessing = false;
    });

    it('exchanges Plaid public token for payment token at submit time', async () => {
      checkoutStore.selectedPaymentMethod = { type: PAYMENT_METHODS.PLAID };
      checkoutStore.plaidPublicToken = 'pt_1';
      checkoutStore.plaidLinkTokenId = 'link_1';

      const page = await newSpecPage({
        components: [JustifiModularCheckout],
        html: `<justifi-modular-checkout auth-token="auth" checkout-id="chk_1"></justifi-modular-checkout>`,
      });

      const instance: any = page.rootInstance;
      instance.completeCheckout = jest.fn();
      instance.plaidService = {
        tokenizeBankAccount: jest.fn().mockResolvedValue({
          data: { bank_account: { token: 'pm_plaid_token' } },
        }),
      };

      await instance.submitCheckout();

      expect(checkoutStore.paymentToken).toBe('pm_plaid_token');
      expect(instance.completeCheckout).toHaveBeenCalledTimes(1);
    });

    it('emits error if Plaid public token is missing', async () => {
      checkoutStore.selectedPaymentMethod = { type: PAYMENT_METHODS.PLAID };
      checkoutStore.plaidPublicToken = undefined;

      const page = await newSpecPage({
        components: [JustifiModularCheckout],
        html: `<justifi-modular-checkout auth-token="auth" checkout-id="chk_1"></justifi-modular-checkout>`,
      });

      const root = page.root as HTMLElement;
      const handler = jest.fn();
      root.addEventListener('error-event', handler as any);

      const instance: any = page.rootInstance;
      instance.completeCheckout = jest.fn();

      await instance.submitCheckout();

      expect(instance.completeCheckout).not.toHaveBeenCalled();
      const event = handler.mock.calls[0][0];
      expect(event.detail.errorCode).toBe(ComponentErrorCodes.TOKENIZE_ERROR);
    });

    it('includes payment_method_group_id only when save payment method is on (Plaid)', async () => {
      const tokenizeSpy = jest.fn().mockResolvedValue({
        data: { bank_account: { token: 'pm_plaid' } },
      });

      const page = await newSpecPage({
        components: [JustifiModularCheckout],
        html: `<justifi-modular-checkout auth-token="auth" checkout-id="chk_1"></justifi-modular-checkout>`,
      });

      const instance: any = page.rootInstance;
      instance.completeCheckout = jest.fn();
      instance.plaidService = { tokenizeBankAccount: tokenizeSpy };

      checkoutStore.selectedPaymentMethod = { type: PAYMENT_METHODS.PLAID };
      checkoutStore.plaidPublicToken = 'pt_1';
      checkoutStore.plaidLinkTokenId = 'link_1';
      checkoutStore.savePaymentMethod = true;
      checkoutStore.paymentMethodGroupId = 'pmg_456';

      await instance.submitCheckout();

      expect(tokenizeSpy).toHaveBeenCalledWith(
        'auth',
        'acc_1',
        'pt_1',
        'link_1',
        'pmg_456'
      );
    });

    it('emits TOKENIZE_ERROR on Plaid exchange failure', async () => {
      checkoutStore.selectedPaymentMethod = { type: PAYMENT_METHODS.PLAID };
      checkoutStore.plaidPublicToken = 'pt_1';

      const page = await newSpecPage({
        components: [JustifiModularCheckout],
        html: `<justifi-modular-checkout auth-token="auth" checkout-id="chk_1"></justifi-modular-checkout>`,
      });

      const root = page.root as HTMLElement;
      const handler = jest.fn();
      root.addEventListener('error-event', handler as any);

      const instance: any = page.rootInstance;
      instance.completeCheckout = jest.fn();
      instance.plaidService = {
        tokenizeBankAccount: jest.fn().mockRejectedValue(new Error('Plaid exchange failed')),
      };

      await instance.submitCheckout();

      expect(instance.completeCheckout).not.toHaveBeenCalled();
      const event = handler.mock.calls[0][0];
      expect(event.detail.errorCode).toBe(ComponentErrorCodes.TOKENIZE_ERROR);
    });
  });

  describe('fillBillingForm', () => {
    beforeEach(() => {
      checkoutStore.billingFormFields = { address_postal_code: '' };
    });

    it('exists and writes to checkoutStore.billingFormFields', async () => {
      const page = await newSpecPage({
        components: [JustifiModularCheckout],
        html: `<justifi-modular-checkout auth-token="t" checkout-id="chk_1"></justifi-modular-checkout>`,
      });

      await page.waitForChanges();

      const instance: any = page.rootInstance;
      expect(typeof instance.fillBillingForm).toBe('function');

      const fields = { name: 'Test', address_postal_code: '12345' };
      await instance.fillBillingForm(fields);

      expect(checkoutStore.billingFormFields).toEqual(fields);
    });
  });

  describe('completeCheckout', () => {
    beforeEach(() => {
      checkoutStore.checkoutLoaded = true;
      checkoutStore.authToken = 'auth';
      checkoutStore.accountId = 'acc_1';
      checkoutStore.paymentAmount = 1000;
      checkoutStore.paymentCurrency = 'USD';
      checkoutStore.selectedPaymentMethod = { type: PAYMENT_METHODS.SAVED_CARD, id: 'pm_123' };
      checkoutStore.paymentToken = 'pm_123';
      checkoutStore.isSubmitting = false;
      checkoutStore.isWalletProcessing = false;
    });

    it('completes checkout with payment mode and token', async () => {
      const page = await newSpecPage({
        components: [JustifiModularCheckout],
        html: `<justifi-modular-checkout auth-token="auth" checkout-id="chk_1"></justifi-modular-checkout>`,
      });

      const instance: any = page.rootInstance;
      const completeSpy = jest.fn(({ onSuccess }: any) => {
        onSuccess({ checkout: { id: 'chk_1', status: 'completed' } });
      });
      instance.completeCheckout = completeSpy;

      await instance.submitCheckout();

      expect(completeSpy).toHaveBeenCalledTimes(1);
      const call = completeSpy.mock.calls[0][0];
      expect(call.payment.payment_mode).toBe('ecom');
      expect(call.payment.payment_token).toBe('pm_123');
    });

    it('emits submit-event with checkout data on success', async () => {
      const page = await newSpecPage({
        components: [JustifiModularCheckout],
        html: `<justifi-modular-checkout auth-token="auth" checkout-id="chk_1"></justifi-modular-checkout>`,
      });

      const root = page.root as HTMLElement;
      const handler = jest.fn();
      root.addEventListener('submit-event', handler as any);

      const instance: any = page.rootInstance;
      const mockCheckout = { id: 'chk_1', status: 'completed' };
      instance.completeCheckout = jest.fn(({ onSuccess }: any) => {
        onSuccess({ checkout: mockCheckout });
      });

      await instance.submitCheckout();

      expect(handler).toHaveBeenCalled();
      const event = handler.mock.calls[0][0];
      expect(event.detail.checkout).toEqual(mockCheckout);
      expect(event.detail.message).toBe('Checkout completed successfully');
    });

    it('emits COMPLETE_CHECKOUT_ERROR on failure', async () => {
      const page = await newSpecPage({
        components: [JustifiModularCheckout],
        html: `<justifi-modular-checkout auth-token="auth" checkout-id="chk_1"></justifi-modular-checkout>`,
      });

      const root = page.root as HTMLElement;
      const handler = jest.fn();
      root.addEventListener('error-event', handler as any);

      const instance: any = page.rootInstance;
      instance.completeCheckout = jest.fn(({ onError }: any) => {
        onError({ message: 'Completion failed', code: 'complete-error', severity: ComponentErrorSeverity.ERROR });
      });

      await instance.submitCheckout();

      expect(handler).toHaveBeenCalled();
      const event = handler.mock.calls[0][0];
      expect(event.detail.errorCode).toBe(ComponentErrorCodes.COMPLETE_CHECKOUT_ERROR);
    });
  });

  describe('getCheckoutState shape', () => {
    it('returns expected fields including optional paymentToken', () => {
      // Reset and populate store
      checkoutStore.selectedPaymentMethod = { type: PAYMENT_METHODS.NEW_BANK_ACCOUNT } as any;
      checkoutStore.paymentAmount = 1234;
      checkoutStore.totalAmount = 1500;
      checkoutStore.paymentCurrency = 'USD';
      checkoutStore.paymentDescription = 'Payment';
      checkoutStore.paymentMethods = [] as any;
      checkoutStore.savePaymentMethod = false;
      checkoutStore.bnplEnabled = false;
      checkoutStore.applePayEnabled = false;
      checkoutStore.insuranceEnabled = true;
      checkoutStore.disableBankAccount = false;
      checkoutStore.disableCreditCard = false;
      checkoutStore.disablePaymentMethodGroup = true;
      checkoutStore.paymentToken = undefined;

      const state = getCheckoutState();

      expect(state).toMatchObject({
        selectedPaymentMethod: { type: PAYMENT_METHODS.NEW_BANK_ACCOUNT },
        paymentAmount: 1234,
        totalAmount: 1500,
        paymentCurrency: 'USD',
        paymentDescription: 'Payment',
        savedPaymentMethods: [],
        savePaymentMethod: false,
        bnplEnabled: false,
        applePayEnabled: false,
        insuranceEnabled: true,
        disableBankAccount: false,
        disableCreditCard: false,
        disablePaymentMethodGroup: true,
      });

      // Optional field can be undefined
      expect(state.paymentToken).toBeUndefined();
    });
  });
});


