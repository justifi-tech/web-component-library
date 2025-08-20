import { newSpecPage } from '@stencil/core/testing';

// Mock the store before importing the component
const mockCheckoutStore: any = {
  selectedPaymentMethod: '',
  paymentToken: undefined,
  authToken: 'test-token',
  accountId: 'test-account',
};

jest.mock('../../../store/checkout.store', () => ({
  checkoutStore: mockCheckoutStore,
  onChange: jest.fn().mockReturnValue(jest.fn()),
}));

import { TokenizePaymentMethod } from '../tokenize-payment-method';

describe('tokenize-payment-method (plaid path)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'warn').mockImplementation(() => { });
    mockCheckoutStore.selectedPaymentMethod = '';
    mockCheckoutStore.paymentToken = undefined;
  });

  afterEach(() => {
    (console.warn as jest.Mock)?.mockRestore?.();
  });

  it('returns stored paymentToken and skips validation/tokenization when selectedPaymentMethod is plaid', async () => {
    const page = await newSpecPage({
      components: [TokenizePaymentMethod],
      html: `<justifi-tokenize-payment-method></justifi-tokenize-payment-method>`,
    });

    // Set after component is created to ensure the component reads from the mocked store
    mockCheckoutStore.selectedPaymentMethod = 'plaid';
    mockCheckoutStore.paymentToken = 'tok_plaid_123';
    await page.waitForChanges();

    const instance: any = page.rootInstance as TokenizePaymentMethod;

    const validateSpy = jest.spyOn(instance, 'validate');
    const tokenizeSpy = jest.spyOn(instance as any, 'tokenize');

    const submitSpy = jest.fn();
    page.root?.addEventListener('submit-event', submitSpy);

    const response = await instance.tokenizePaymentMethod();

    expect(response).toBeDefined();
    expect(response?.token).toBe('tok_plaid_123');
    expect(validateSpy).not.toHaveBeenCalled();
    expect(tokenizeSpy).not.toHaveBeenCalled();

    // Ensure submit-event emitted with response
    expect(submitSpy).toHaveBeenCalled();
    const eventDetail = (submitSpy.mock.calls[0][0] as CustomEvent).detail;
    expect(eventDetail?.response?.token).toBe('tok_plaid_123');
  });

  it('emits error and returns error payload when plaid selected but paymentToken missing', async () => {
    const page = await newSpecPage({
      components: [TokenizePaymentMethod],
      html: `<justifi-tokenize-payment-method></justifi-tokenize-payment-method>`,
    });

    mockCheckoutStore.selectedPaymentMethod = 'plaid';
    mockCheckoutStore.paymentToken = undefined;
    await page.waitForChanges();

    const instance: any = page.rootInstance as TokenizePaymentMethod;

    const errorSpy = jest.fn();
    const submitSpy = jest.fn();
    page.root?.addEventListener('error-event', errorSpy);
    page.root?.addEventListener('submit-event', submitSpy);

    const response = await instance.tokenizePaymentMethod();

    expect(response).toBeDefined();
    expect(response?.token).toBeUndefined();
    expect(response?.error).toBeDefined();

    expect(errorSpy).toHaveBeenCalled();
    expect(submitSpy).toHaveBeenCalled();

    const errorEventDetail = (errorSpy.mock.calls[0][0] as CustomEvent).detail;
    expect(errorEventDetail?.errorCode).toBe('tokenize-error');
  });
});
