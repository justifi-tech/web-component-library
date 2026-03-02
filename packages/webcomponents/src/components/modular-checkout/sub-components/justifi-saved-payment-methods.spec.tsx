import { newSpecPage } from '@stencil/core/testing';
import { JustifiSavedPaymentMethods } from './justifi-saved-payment-methods';
import { checkoutStore } from '../../../store/checkout.store';
import { PAYMENT_METHODS } from '../ModularCheckout';

describe('justifi-saved-payment-methods', () => {
  beforeEach(() => {
    checkoutStore.disablePaymentMethodGroup = false;
    checkoutStore.disableCreditCard = false;
    checkoutStore.disableBankAccount = false;
    checkoutStore.paymentMethods = [] as any;
    checkoutStore.paymentToken = undefined;
    checkoutStore.selectedPaymentMethod = undefined;
  });

  it('renders list items for allowed saved methods and sets selection on click', async () => {
    checkoutStore.paymentMethods = [
      { id: 'pm_card', type: PAYMENT_METHODS.SAVED_CARD, brand: 'visa', acct_last_four: '4242' } as any,
      { id: 'pm_bank', type: PAYMENT_METHODS.SAVED_BANK_ACCOUNT, brand: 'ach', acct_last_four: '0000' } as any,
    ];

    const page = await newSpecPage({
      components: [JustifiSavedPaymentMethods],
      html: `<justifi-saved-payment-methods></justifi-saved-payment-methods>`,
    });

    const listItems = Array.from(page.root?.shadowRoot?.querySelectorAll('.radio-list-item') || []);
    expect(listItems.length).toBe(2);

    // Click first item
    (listItems[0] as HTMLElement).click();
    await page.waitForChanges();

    expect(checkoutStore.paymentToken).toBe('pm_card');
    expect(checkoutStore.selectedPaymentMethod).toEqual({ id: 'pm_card', type: PAYMENT_METHODS.SAVED_CARD });
  });

  it('does not render when payment method group is disabled', async () => {
    checkoutStore.disablePaymentMethodGroup = true;
    checkoutStore.paymentMethods = [
      { id: 'pm_card', type: PAYMENT_METHODS.SAVED_CARD, brand: 'visa', acct_last_four: '4242' } as any,
    ];

    const page = await newSpecPage({
      components: [JustifiSavedPaymentMethods],
      html: `<justifi-saved-payment-methods></justifi-saved-payment-methods>`,
    });

    // component returns null
    expect(page.root?.shadowRoot?.innerHTML).toBe('');
  });

  it('filters out disabled types', async () => {
    checkoutStore.disableCreditCard = true;
    checkoutStore.paymentMethods = [
      { id: 'pm_card', type: PAYMENT_METHODS.SAVED_CARD, brand: 'visa', acct_last_four: '4242' } as any,
      { id: 'pm_bank', type: PAYMENT_METHODS.SAVED_BANK_ACCOUNT, brand: 'ach', acct_last_four: '0000' } as any,
    ];

    const page = await newSpecPage({
      components: [JustifiSavedPaymentMethods],
      html: `<justifi-saved-payment-methods></justifi-saved-payment-methods>`,
    });

    const listItems = Array.from(page.root?.shadowRoot?.querySelectorAll('.radio-list-item') || []);
    expect(listItems.length).toBe(1);
    const radio = page.root?.shadowRoot?.querySelector('form-control-radio') as HTMLElement | null;
    expect(radio?.getAttribute('value')).toBe('pm_bank');
  });
});


