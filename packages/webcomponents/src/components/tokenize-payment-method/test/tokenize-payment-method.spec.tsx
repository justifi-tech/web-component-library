import { newSpecPage } from '@stencil/core/testing';
import { JustifiTokenizePaymentMethod } from '../tokenize-payment-method';
import { BillingForm } from '../../checkout/billing-form/billing-form-inner';
import { BillingFormFull } from '../../checkout/billing-form/billing-form-full';
import { CardBillingFormSimple } from '../../checkout/billing-form/card-billing-form-simple';
import { BankAccountBillingFormSimple } from '../../checkout/billing-form/bank-account-billing-form-simple';
import { SaveNewPaymentMethod } from '../../checkout/save-new-payment-method/save-new-payment-method';
import { RadioListItem } from '../../../ui-components/radio-list-item';
import { InternalButton } from '../../../ui-components/internal-button';
import { CardForm } from '../../checkout/card-form/card-form';
import { BankAccountForm } from '../../checkout/bank-account-form/bank-account-form';
import { checkoutStore } from '../../../store/checkout.store';
import { PAYMENT_METHODS } from '../../modular-checkout/ModularCheckout';

const tokenizeComponents = [
  JustifiTokenizePaymentMethod,
  SaveNewPaymentMethod,
  BillingForm,
  BillingFormFull,
  CardBillingFormSimple,
  BankAccountBillingFormSimple,
  RadioListItem,
  InternalButton,
  CardForm,
  BankAccountForm,
];

describe('tokenize-payment-method', () => {
  it('should pass hideCardBillingForm prop to payment method options', async () => {
    const page = await newSpecPage({
      components: tokenizeComponents,
      html: `<justifi-tokenize-payment-method hide-card-billing-form="true" auth-token="test-token" account-id="test-account"></justifi-tokenize-payment-method>`,
    });

    await page.waitForChanges();

    const tokenizePaymentMethod = page.rootInstance;
    expect(tokenizePaymentMethod.hideCardBillingForm).toBe(true);
  });

  it('should pass hideBankAccountBillingForm prop to payment method options', async () => {
    const page = await newSpecPage({
      components: tokenizeComponents,
      html: `<justifi-tokenize-payment-method hide-bank-account-billing-form="true" auth-token="test-token" account-id="test-account"></justifi-tokenize-payment-method>`,
    });

    await page.waitForChanges();

    const tokenizePaymentMethod = page.rootInstance;
    expect(tokenizePaymentMethod.hideBankAccountBillingForm).toBe(true);
  });

  it('should pass hideCardBillingForm prop to billing form through the chain', async () => {
    const page = await newSpecPage({
      components: tokenizeComponents,
      html: `<justifi-tokenize-payment-method hide-card-billing-form="true" auth-token="test-token" account-id="test-account"></justifi-tokenize-payment-method>`,
    });

    await page.waitForChanges();

    const tokenizePaymentMethod = page.rootInstance;
    expect(tokenizePaymentMethod.hideCardBillingForm).toBe(true);
  });

  it('should pass hideBankAccountBillingForm prop to billing form through the chain', async () => {
    const page = await newSpecPage({
      components: tokenizeComponents,
      html: `<justifi-tokenize-payment-method hide-bank-account-billing-form="true" disable-credit-card="true" auth-token="test-token" account-id="test-account"></justifi-tokenize-payment-method>`,
    });

    await page.waitForChanges();

    const tokenizePaymentMethod = page.rootInstance;
    expect(tokenizePaymentMethod.hideBankAccountBillingForm).toBe(true);
  });

  it('should not render billing form fields except postal_code when hideCardBillingForm is true', async () => {
    const page = await newSpecPage({
      components: [BillingForm, BillingFormFull, CardBillingFormSimple, BankAccountBillingFormSimple],
      html: `<billing-form hide-card-billing-form="true" payment-method-type="new_card"></billing-form>`,
    });

    await page.waitForChanges();

    const instance: any = page.rootInstance;

    expect(instance.hideCardBillingForm).toBe(true);
    expect(instance.paymentMethodType).toBe('new_card');
    expect(instance.showSimpleCardBillingForm).toBe(true);
    expect(instance.showSimpleBankAccountBillingForm).toBe(false);

    const cardBillingFormSimpleElement = page.root?.querySelector('card-billing-form-simple');
    const nameField = cardBillingFormSimpleElement?.querySelector('[name="name"]');
    const addressField = cardBillingFormSimpleElement?.querySelector('[name="address_line1"]');
    const postalCodeField = cardBillingFormSimpleElement?.querySelector('[name="address_postal_code"]');

    expect(nameField).toBeFalsy();
    expect(addressField).toBeFalsy();
    expect(postalCodeField).toBeTruthy();
  });

  it('should render only name field when hideBankAccountBillingForm is true', async () => {
    const page = await newSpecPage({
      components: [BillingForm, BillingFormFull, CardBillingFormSimple, BankAccountBillingFormSimple],
      html: `<billing-form hide-bank-account-billing-form="true" payment-method-type="new_bank_account"></billing-form>`,
    });

    await page.waitForChanges();

    const instance: any = page.rootInstance;

    expect(instance.hideBankAccountBillingForm).toBe(true);
    expect(instance.paymentMethodType).toBe('new_bank_account');
    expect(instance.showSimpleCardBillingForm).toBe(false);
    expect(instance.showSimpleBankAccountBillingForm).toBe(true);

    const bankAccountBillingFormSimpleElement = page.root?.querySelector('bank-account-billing-form-simple');
    const nameField = bankAccountBillingFormSimpleElement?.querySelector('[name="name"]');
    const addressField = bankAccountBillingFormSimpleElement?.querySelector('[name="address_line1"]');
    const postalCodeField = bankAccountBillingFormSimpleElement?.querySelector('[name="address_postal_code"]');

    expect(nameField).toBeTruthy();
    expect(addressField).toBeFalsy();
    expect(postalCodeField).toBeFalsy();
  });

  it('forwards savePaymentMethodLabel to save-new-payment-method', async () => {
    const page = await newSpecPage({
      components: tokenizeComponents,
      html: `<justifi-tokenize-payment-method auth-token="test-token" account-id="test-account" payment-method-group-id="pmg_123" save-payment-method-label="Keep this on file"></justifi-tokenize-payment-method>`,
    });

    await page.waitForChanges();

    const checkbox = page.root?.shadowRoot?.querySelector('save-new-payment-method') as any;
    expect(checkbox).toBeTruthy();
    expect((checkbox as any).label).toBe('Keep this on file');
  });

  it('uses default save checkbox label when savePaymentMethodLabel is not provided', async () => {
    const page = await newSpecPage({
      components: tokenizeComponents,
      html: `<justifi-tokenize-payment-method auth-token="test-token" account-id="test-account" payment-method-group-id="pmg_123"></justifi-tokenize-payment-method>`,
    });

    await page.waitForChanges();

    const checkbox = page.root?.shadowRoot?.querySelector('save-new-payment-method') as any;
    expect(checkbox).toBeTruthy();
    expect((checkbox as any).label).toBe('Save New Payment Method');
  });

  describe('fillBillingForm', () => {
    beforeEach(() => {
      checkoutStore.billingFormFields = { address_postal_code: '' };
    });

    it('writes fields to checkoutStore.billingFormFields', async () => {
      const page = await newSpecPage({
        components: tokenizeComponents,
        html: `<justifi-tokenize-payment-method auth-token="test-token" account-id="test-account"></justifi-tokenize-payment-method>`,
      });

      await page.waitForChanges();

      const fields = { name: 'Jane Doe', address_postal_code: '90210' };
      await (page.root as any).fillBillingForm(fields);

      expect(checkoutStore.billingFormFields).toEqual(fields);
    });

    it('billing data persists when payment method type is toggled', async () => {
      const page = await newSpecPage({
        components: tokenizeComponents,
        html: `<justifi-tokenize-payment-method auth-token="test-token" account-id="test-account" disable-bank-account="false" disable-credit-card="false"></justifi-tokenize-payment-method>`,
      });

      await page.waitForChanges();

      const fields = { name: 'Jane Doe', address_postal_code: '90210' };
      await (page.root as any).fillBillingForm(fields);

      expect(checkoutStore.billingFormFields).toEqual(fields);

      // Simulate toggle: dispatch radio-click to switch from card to bank account
      const internalEl = page.root?.shadowRoot?.querySelector('justifi-tokenize-payment-method') ?? page.root?.querySelector('justifi-tokenize-payment-method');
      internalEl?.dispatchEvent(new CustomEvent('radio-click', { detail: PAYMENT_METHODS.NEW_BANK_ACCOUNT }));
      await page.waitForChanges();

      // Store retains data; sub-components read from store on mount (billing-form-store-sync.spec)
      expect(checkoutStore.billingFormFields).toEqual(fields);
    });
  });
});
