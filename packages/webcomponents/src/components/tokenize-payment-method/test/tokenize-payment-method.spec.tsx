jest.mock('../../../ui-components/styled-host/styled-host.css', () => '');

import { newSpecPage } from '@stencil/core/testing';
import { TokenizePaymentMethod } from '../tokenize-payment-method';
import { StyledHost } from '../../../ui-components/styled-host/styled-host';
import { Button } from '../../../ui-components/button';
import { JustifiRadioListItem } from '../../../ui-components/shadow-dom-components/justifi-radio-list-item';
import { PaymentMethodTypes } from '../../../api/Payment';
import { ComponentErrorCodes } from '../../../api';
import { checkoutStore } from '../../../store/checkout.store';
import JustifiAnalytics from '../../../api/Analytics';

// Mock dependencies
jest.mock('../../../utils/check-pkg-version', () => ({
  checkPkgVersion: jest.fn(),
}));

jest.mock('../../../api/Analytics');
jest.mock('../../../store/checkout.store', () => ({
  checkoutStore: {
    authToken: null,
    accountId: null,
    paymentMethodGroupId: null,
    savePaymentMethod: false,
  },
}));

beforeEach(() => {
  // Reset mocks
  jest.clearAllMocks();

  // Reset store state
  checkoutStore.authToken = null;
  checkoutStore.accountId = null;
  checkoutStore.paymentMethodGroupId = null;
  checkoutStore.savePaymentMethod = false;

  // Mock Analytics to avoid DOM event listener issues
  // @ts-ignore
  JustifiAnalytics.prototype.trackCustomEvents = jest.fn();
  // @ts-ignore
  JustifiAnalytics.prototype.cleanup = jest.fn();
});

describe('justifi-tokenize-payment-method', () => {
  const testComponents = [TokenizePaymentMethod, StyledHost, Button, JustifiRadioListItem];

  const mockBillingForm = {
    fill: jest.fn(),
    validate: jest.fn().mockResolvedValue({ isValid: true, errors: {} }),
    getValues: jest.fn().mockResolvedValue({
      name: 'John Doe',
      address_line1: '123 Main St',
      address_city: 'Anytown',
      address_state: 'NY',
      address_postal_code: '12345',
    }),
  };

  const mockCardForm = {
    validate: jest.fn().mockResolvedValue({ isValid: true, errors: {} }),
    tokenize: jest.fn().mockResolvedValue({
      data: {
        card: {
          token: 'card_token_123',
        },
      },
    }),
  };

  const mockBankAccountForm = {
    validate: jest.fn().mockResolvedValue({ isValid: true, errors: {} }),
    tokenize: jest.fn().mockResolvedValue({
      data: {
        bank_account: {
          token: 'bank_token_123',
        },
      },
    }),
  };

  it('renders with default props', async () => {
    const page = await newSpecPage({
      components: testComponents,
      html: `<justifi-tokenize-payment-method auth-token="test-token" account-id="test-account"></justifi-tokenize-payment-method>`,
    });

    await page.waitForChanges();
    expect(page.root).toBeTruthy();
    expect(page.rootInstance.selectedPaymentMethodId).toBe(PaymentMethodTypes.card);
  });

  it('selects bank account when credit card is disabled', async () => {
    const page = await newSpecPage({
      components: testComponents,
      html: `<justifi-tokenize-payment-method auth-token="test-token" account-id="test-account" disable-credit-card="true"></justifi-tokenize-payment-method>`,
    });

    await page.waitForChanges();
    expect(page.rootInstance.selectedPaymentMethodId).toBe(PaymentMethodTypes.bankAccount);
  });

  it('emits error when auth token is missing', async () => {
    const page = await newSpecPage({
      components: testComponents,
      html: `<justifi-tokenize-payment-method account-id="test-account"></justifi-tokenize-payment-method>`,
    });

    const errorSpy = jest.fn();
    page.root?.addEventListener('error-event', errorSpy);

    // Force the component to load and validate
    const instance = page.rootInstance;
    instance.componentWillLoad();

    await page.waitForChanges();

    expect(errorSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: expect.objectContaining({
          errorCode: ComponentErrorCodes.TOKENIZE_ERROR,
          message: 'Auth token is required when using the tokenize-payment-method component not slotted in justifi-modular-checkout',
        }),
      })
    );
  });

  it('emits error when account ID is missing', async () => {
    const page = await newSpecPage({
      components: testComponents,
      html: `<justifi-tokenize-payment-method auth-token="test-token"></justifi-tokenize-payment-method>`,
    });

    const errorSpy = jest.fn();
    page.root?.addEventListener('error-event', errorSpy);

    // Force the component to load and validate
    const instance = page.rootInstance;
    instance.componentWillLoad();

    await page.waitForChanges();

    expect(errorSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: expect.objectContaining({
          errorCode: ComponentErrorCodes.TOKENIZE_ERROR,
          message: 'Account ID is required when using the tokenize-payment-method component not slotted in justifi-modular-checkout',
        }),
      })
    );
  });

  it('uses checkout store values when props are not provided', async () => {
    checkoutStore.authToken = 'store-token';
    checkoutStore.accountId = 'store-account';

    const page = await newSpecPage({
      components: testComponents,
      html: `<justifi-tokenize-payment-method></justifi-tokenize-payment-method>`,
    });

    const errorSpy = jest.fn();
    page.root?.addEventListener('error-event', errorSpy);

    await page.waitForChanges();

    // Should not emit errors since store values are available
    expect(errorSpy).not.toHaveBeenCalled();
  });

  it('handles radio click events', async () => {
    const page = await newSpecPage({
      components: testComponents,
      html: `<justifi-tokenize-payment-method auth-token="test-token" account-id="test-account"></justifi-tokenize-payment-method>`,
    });

    await page.waitForChanges();

    // Simulate radio click event
    const radioClickEvent = new CustomEvent('radio-click', {
      detail: PaymentMethodTypes.bankAccount,
    });

    page.root?.dispatchEvent(radioClickEvent);
    await page.waitForChanges();

    expect(page.rootInstance.selectedPaymentMethodId).toBe(PaymentMethodTypes.bankAccount);
  });

  it('fills billing form successfully', async () => {
    const page = await newSpecPage({
      components: testComponents,
      html: `<justifi-tokenize-payment-method auth-token="test-token" account-id="test-account"></justifi-tokenize-payment-method>`,
    });

    const instance = page.rootInstance;
    instance.billingFormRef = mockBillingForm;

    const fields = {
      name: 'John Doe',
      address_line1: '123 Main St',
    };

    await instance.fillBillingForm(fields);

    expect(mockBillingForm.fill).toHaveBeenCalledWith(fields);
  });

  it('validates forms successfully', async () => {
    const page = await newSpecPage({
      components: testComponents,
      html: `<justifi-tokenize-payment-method auth-token="test-token" account-id="test-account"></justifi-tokenize-payment-method>`,
    });

    const instance = page.rootInstance;
    instance.billingFormRef = mockBillingForm;
    instance.paymentMethodFormRef = mockCardForm;

    const result = await instance.validate();

    expect(result.isValid).toBe(true);
    expect(mockBillingForm.validate).toHaveBeenCalled();
    expect(mockCardForm.validate).toHaveBeenCalled();
  });

  it('handles validation failure', async () => {
    const page = await newSpecPage({
      components: testComponents,
      html: `<justifi-tokenize-payment-method auth-token="test-token" account-id="test-account"></justifi-tokenize-payment-method>`,
    });

    const instance = page.rootInstance;
    instance.billingFormRef = {
      ...mockBillingForm,
      validate: jest.fn().mockResolvedValue({ isValid: false, errors: { name: 'Name is required' } }),
    };
    instance.paymentMethodFormRef = mockCardForm;

    const result = await instance.validate();

    expect(result.isValid).toBe(false);
    expect(result.errors).toEqual({ name: 'Name is required' });
  });

  it('tokenizes payment method successfully with card', async () => {
    const page = await newSpecPage({
      components: testComponents,
      html: `<justifi-tokenize-payment-method auth-token="test-token" account-id="test-account"></justifi-tokenize-payment-method>`,
    });

    const instance = page.rootInstance;
    instance.billingFormRef = mockBillingForm;
    instance.paymentMethodFormRef = mockCardForm;

    const submitSpy = jest.fn();
    page.root?.addEventListener('submit-event', submitSpy);

    const result = await instance.tokenizePaymentMethod();

    expect(result.token).toBe('card_token_123');
    expect(result.data).toBeDefined();
    expect(submitSpy).toHaveBeenCalled();
  });

  it('tokenizes payment method successfully with bank account', async () => {
    const page = await newSpecPage({
      components: testComponents,
      html: `<justifi-tokenize-payment-method auth-token="test-token" account-id="test-account"></justifi-tokenize-payment-method>`,
    });

    const instance = page.rootInstance;
    instance.selectedPaymentMethodId = PaymentMethodTypes.bankAccount;
    instance.billingFormRef = mockBillingForm;
    instance.paymentMethodFormRef = mockBankAccountForm;

    const result = await instance.tokenizePaymentMethod();

    expect(result.token).toBe('bank_token_123');
    expect(result.data).toBeDefined();
  });

  it('handles tokenization error', async () => {
    const page = await newSpecPage({
      components: testComponents,
      html: `<justifi-tokenize-payment-method auth-token="test-token" account-id="test-account"></justifi-tokenize-payment-method>`,
    });

    const instance = page.rootInstance;
    instance.billingFormRef = mockBillingForm;
    instance.paymentMethodFormRef = {
      ...mockCardForm,
      tokenize: jest.fn().mockResolvedValue({
        error: {
          code: 'tokenization_failed',
          message: 'Tokenization failed',
        },
      }),
    };

    const errorSpy = jest.fn();
    const submitSpy = jest.fn();
    page.root?.addEventListener('error-event', errorSpy);
    page.root?.addEventListener('submit-event', submitSpy);

    const result = await instance.tokenizePaymentMethod();

    expect(result.error).toBeDefined();
    expect(errorSpy).toHaveBeenCalled();
    expect(submitSpy).toHaveBeenCalled();
  });

  it('handles forms not ready error', async () => {
    const page = await newSpecPage({
      components: testComponents,
      html: `<justifi-tokenize-payment-method auth-token="test-token" account-id="test-account"></justifi-tokenize-payment-method>`,
    });

    const instance = page.rootInstance;
    // Explicitly set form refs to undefined - simulating forms not ready
    instance.billingFormRef = undefined;
    instance.paymentMethodFormRef = undefined;

    const result = await instance.validate();

    expect(result.isValid).toBe(false);
    expect(result.errors?.general).toBe('Payment form not ready');
  });

  it('detects when slotted within modular checkout', async () => {
    // Create a mock parent element structure
    const modularCheckout = document.createElement('justifi-modular-checkout');
    const container = document.createElement('div');

    const page = await newSpecPage({
      components: testComponents,
      html: `<justifi-tokenize-payment-method auth-token="test-token" account-id="test-account"></justifi-tokenize-payment-method>`,
    });

    // Manually set up the DOM structure
    container.appendChild(page.root!);
    modularCheckout.appendChild(container);

    // Mock the parentElement chain
    Object.defineProperty(page.root, 'parentElement', {
      value: container,
      configurable: true
    });
    Object.defineProperty(container, 'parentElement', {
      value: modularCheckout,
      configurable: true
    });
    Object.defineProperty(modularCheckout, 'tagName', {
      value: 'JUSTIFI-MODULAR-CHECKOUT',
      configurable: true
    });

    const instance = page.rootInstance;

    // Trigger the private method that checks for modular checkout
    const isSlotted = instance.isSlottedWithinModularCheckout();

    expect(isSlotted).toBe(true);
  });

  it('shows submit button when not slotted within modular checkout', async () => {
    const page = await newSpecPage({
      components: testComponents,
      html: `<justifi-tokenize-payment-method auth-token="test-token" account-id="test-account"></justifi-tokenize-payment-method>`,
    });

    await page.waitForChanges();

    const submitButton = page.root?.querySelector('[data-testid="submit-button"]');
    expect(submitButton).toBeTruthy();
    expect(page.rootInstance.computedHideSubmitButton).toBe(false);
  });

  it('respects hideSubmitButton prop when explicitly set', async () => {
    const page = await newSpecPage({
      components: testComponents,
      html: `<justifi-tokenize-payment-method auth-token="test-token" account-id="test-account" hide-submit-button="true"></justifi-tokenize-payment-method>`,
    });

    await page.waitForChanges();

    expect(page.rootInstance.computedHideSubmitButton).toBe(true);
  });

  it('builds payment method metadata with payment method group ID', async () => {
    const page = await newSpecPage({
      components: testComponents,
      html: `<justifi-tokenize-payment-method auth-token="test-token" account-id="test-account" payment-method-group-id="group-123"></justifi-tokenize-payment-method>`,
    });

    const instance = page.rootInstance;
    instance.billingFormRef = mockBillingForm;
    instance.paymentMethodFormRef = mockCardForm;

    await instance.tokenizePaymentMethod();

    // Verify that tokenize was called with the correct config including payment method group ID
    expect(mockCardForm.tokenize).toHaveBeenCalledWith(
      expect.objectContaining({
        paymentMethodMetadata: expect.objectContaining({
          payment_method_group_id: 'group-123',
        }),
      })
    );
  });

  it('gets available payment methods correctly', async () => {
    const page = await newSpecPage({
      components: testComponents,
      html: `<justifi-tokenize-payment-method auth-token="test-token" account-id="test-account"></justifi-tokenize-payment-method>`,
    });

    const instance = page.rootInstance;

    // Test default case (both enabled)
    let availableMethods = instance.availablePaymentMethods;
    expect(availableMethods).toEqual([PaymentMethodTypes.card, PaymentMethodTypes.bankAccount]);

    // Test with credit card disabled
    instance.disableCreditCard = true;
    availableMethods = instance.availablePaymentMethods;
    expect(availableMethods).toEqual([PaymentMethodTypes.bankAccount]);

    // Test with bank account disabled
    instance.disableCreditCard = false;
    instance.disableBankAccount = true;
    availableMethods = instance.availablePaymentMethods;
    expect(availableMethods).toEqual([PaymentMethodTypes.card]);
  });

  it('handles exception during tokenization', async () => {
    const page = await newSpecPage({
      components: testComponents,
      html: `<justifi-tokenize-payment-method auth-token="test-token" account-id="test-account"></justifi-tokenize-payment-method>`,
    });

    const instance = page.rootInstance;
    instance.billingFormRef = mockBillingForm;

    // Mock tokenize to return undefined, which will cause the error when accessing .data.card.token
    instance.paymentMethodFormRef = {
      ...mockCardForm,
      tokenize: jest.fn().mockResolvedValue(undefined),
    };

    const errorSpy = jest.fn();
    const submitSpy = jest.fn();
    page.root?.addEventListener('error-event', errorSpy);
    page.root?.addEventListener('submit-event', submitSpy);

    const result = await instance.tokenizePaymentMethod();

    expect(result.error).toBeDefined();
    expect(errorSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: expect.objectContaining({
          errorCode: undefined, // The error code is undefined when exception occurs during tokenization
          message: expect.stringContaining('Cannot read properties of undefined'),
          severity: 'error',
        }),
      })
    );
  });

  it('cleans up analytics on disconnection', async () => {
    const page = await newSpecPage({
      components: testComponents,
      html: `<justifi-tokenize-payment-method auth-token="test-token" account-id="test-account"></justifi-tokenize-payment-method>`,
    });

    const instance = page.rootInstance;
    const cleanupSpy = jest.spyOn(instance.analytics, 'cleanup');

    instance.disconnectedCallback();

    expect(cleanupSpy).toHaveBeenCalled();
  });
}); 
