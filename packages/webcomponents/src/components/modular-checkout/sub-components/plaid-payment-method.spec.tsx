import { newSpecPage } from '@stencil/core/testing';
import { PlaidPaymentMethod } from './plaid-payment-method';
import { checkoutStore } from '../../../store/checkout.store';

describe('justifi-plaid-payment-method', () => {
  beforeEach(() => {
    // Reset store flag before each test
    checkoutStore.bankAccountVerification = undefined;
    jest.spyOn(console, 'warn').mockImplementation(() => { });
  });

  afterEach(() => {
    (console.warn as jest.Mock).mockRestore();
  });

  it('does not render and warns when bankAccountVerification is false', async () => {
    checkoutStore.bankAccountVerification = false;

    const page = await newSpecPage({
      components: [PlaidPaymentMethod],
      html: `<justifi-plaid-payment-method></justifi-plaid-payment-method>`,
    });

    expect(console.warn).toHaveBeenCalledWith(
      '[PlaidPaymentMethod] bank_account_verification is disabled. Component will not render.'
    );
    expect(page.root).toBeTruthy();
    expect(page.root?.shadowRoot?.innerHTML).toBe('');
  });

  it('renders normally when bankAccountVerification is true', async () => {
    checkoutStore.bankAccountVerification = true;

    const page = await newSpecPage({
      components: [PlaidPaymentMethod],
      html: `<justifi-plaid-payment-method></justifi-plaid-payment-method>`,
    });

    // Should include the Plaid script tag in shadow DOM
    expect(page.root).toBeTruthy();
    const script = page.root?.shadowRoot?.querySelector('script[src="https://cdn.plaid.com/link/v2/stable/link-initialize.js"]');
    expect(script).not.toBeNull();
  });
});


