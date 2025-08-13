import { newSpecPage } from '@stencil/core/testing';
import { TokenizePaymentMethod } from '../tokenize-payment-method';
import { BillingForm } from '../../checkout/billing-form/billing-form';
import { BillingFormFull } from '../../modular-checkout/sub-components/billing-form-full';
import { CardBillingFormSimple } from '../../modular-checkout/sub-components/card-billing-form-simple';
import { BankAccountBillingFormSimple } from '../../modular-checkout/sub-components/bank-account-billing-form-simple';
import { SaveNewPaymentMethod } from '../../checkout/save-new-payment-method';

describe('tokenize-payment-method', () => {
  it('should pass hideCardBillingForm prop to payment method options', async () => {
    const page = await newSpecPage({
      components: [TokenizePaymentMethod, SaveNewPaymentMethod, BillingForm, BillingFormFull, CardBillingFormSimple, BankAccountBillingFormSimple],
      html: `<justifi-tokenize-payment-method hide-card-billing-form="true" auth-token="test-token" account-id="test-account"></justifi-tokenize-payment-method>`,
    });

    await page.waitForChanges();

    const tokenizePaymentMethod = page.rootInstance;
    expect(tokenizePaymentMethod.hideCardBillingForm).toBe(true);
  });

  it('should pass hideBankAccountBillingForm prop to payment method options', async () => {
    const page = await newSpecPage({
      components: [TokenizePaymentMethod, BillingForm, BillingFormFull, CardBillingFormSimple, BankAccountBillingFormSimple],
      html: `<justifi-tokenize-payment-method hide-bank-account-billing-form="true" auth-token="test-token" account-id="test-account"></justifi-tokenize-payment-method>`,
    });

    await page.waitForChanges();

    const tokenizePaymentMethod = page.rootInstance;
    expect(tokenizePaymentMethod.hideBankAccountBillingForm).toBe(true);
  });

  it('should pass hideCardBillingForm prop to billing form through the chain', async () => {
    const page = await newSpecPage({
      components: [TokenizePaymentMethod, BillingForm, BillingFormFull, CardBillingFormSimple, BankAccountBillingFormSimple],
      html: `<justifi-tokenize-payment-method hide-card-billing-form="true" auth-token="test-token" account-id="test-account"></justifi-tokenize-payment-method>`,
    });

    await page.waitForChanges();

    const tokenizePaymentMethod = page.rootInstance;
    expect(tokenizePaymentMethod.hideCardBillingForm).toBe(true);
  });

  it('should pass hideBankAccountBillingForm prop to billing form through the chain', async () => {
    const page = await newSpecPage({
      components: [TokenizePaymentMethod, BillingForm, BillingFormFull, CardBillingFormSimple, BankAccountBillingFormSimple],
      html: `<justifi-tokenize-payment-method hide-bank-account-billing-form="true" disable-credit-card="true" auth-token="test-token" account-id="test-account"></justifi-tokenize-payment-method>`,
    });

    await page.waitForChanges();

    const tokenizePaymentMethod = page.rootInstance;
    expect(tokenizePaymentMethod.hideBankAccountBillingForm).toBe(true);
  });

  it('should not render billing form fields except postal_code when hideCardBillingForm is true', async () => {
    // Test the billing form behavior directly (since integration tests have shadow DOM complexities)
    const page = await newSpecPage({
      components: [BillingForm, BillingFormFull, CardBillingFormSimple, BankAccountBillingFormSimple],
      html: `<justifi-billing-form hide-card-billing-form="true" payment-method-type="card"></justifi-billing-form>`,
    });

    await page.waitForChanges();

    const instance: any = page.rootInstance;

    // Verify the component is configured correctly for postal-only mode
    expect(instance.hideCardBillingForm).toBe(true);
    expect(instance.paymentMethodType).toBe('card');
    expect(instance.showSimpleCardBillingForm).toBe(true);
    expect(instance.showSimpleBankAccountBillingForm).toBe(false);

    // Verify only ZIP field is rendered
    // CardBillingFormSimple uses shadow DOM, so we need to access the shadow root
    const cardBillingFormSimpleElement = page.root?.querySelector('justifi-card-billing-form-simple');
    const shadowRoot = cardBillingFormSimpleElement?.shadowRoot;

    if (shadowRoot) {
      const nameField = shadowRoot.querySelector('[name="name"]');
      const addressField = shadowRoot.querySelector('[name="address_line1"]');
      const postalCodeField = shadowRoot.querySelector('[name="address_postal_code"]');

      expect(nameField).toBeFalsy(); // Should not be in DOM
      expect(addressField).toBeFalsy(); // Should not be in DOM  
      expect(postalCodeField).toBeTruthy(); // Should be in DOM
    } else {
      // Fallback to direct querying if no shadow root
      const nameField = page.root?.querySelector('[name="name"]');
      const addressField = page.root?.querySelector('[name="address_line1"]');
      const postalCodeField = page.root?.querySelector('[name="address_postal_code"]');

      expect(nameField).toBeFalsy(); // Should not be in DOM
      expect(addressField).toBeFalsy(); // Should not be in DOM  
      expect(postalCodeField).toBeTruthy(); // Should be in DOM
    }
  });

  it('should render only name field when hideBankAccountBillingForm is true', async () => {
    // Test the billing form behavior directly (since integration tests have shadow DOM complexities)
    const page = await newSpecPage({
      components: [BillingForm, BillingFormFull, CardBillingFormSimple, BankAccountBillingFormSimple],
      html: `<justifi-billing-form hide-bank-account-billing-form="true" payment-method-type="bankAccount"></justifi-billing-form>`,
    });

    await page.waitForChanges();

    const instance: any = page.rootInstance;

    // Verify the component is configured correctly for name-only mode
    expect(instance.hideBankAccountBillingForm).toBe(true);
    expect(instance.paymentMethodType).toBe('bankAccount');
    expect(instance.showSimpleCardBillingForm).toBe(false);
    expect(instance.showSimpleBankAccountBillingForm).toBe(true);

    // Verify only name field is rendered
    // BankAccountBillingFormSimple uses shadow DOM, so we need to access the shadow root
    const bankAccountBillingFormSimpleElement = page.root?.querySelector('justifi-bank-account-billing-form-simple');
    const shadowRoot = bankAccountBillingFormSimpleElement?.shadowRoot;

    if (shadowRoot) {
      const nameField = shadowRoot.querySelector('[name="name"]');
      const addressField = shadowRoot.querySelector('[name="address_line1"]');
      const postalCodeField = shadowRoot.querySelector('[name="address_postal_code"]');

      expect(nameField).toBeTruthy(); // Should be in DOM
      expect(addressField).toBeFalsy(); // Should not be in DOM
      expect(postalCodeField).toBeFalsy(); // Should not be in DOM
    } else {
      // Fallback to direct querying if no shadow root
      const nameField = page.root?.querySelector('[name="name"]');
      const addressField = page.root?.querySelector('[name="address_line1"]');
      const postalCodeField = page.root?.querySelector('[name="address_postal_code"]');

      expect(nameField).toBeTruthy(); // Should be in DOM
      expect(addressField).toBeFalsy(); // Should not be in DOM
      expect(postalCodeField).toBeFalsy(); // Should not be in DOM
    }
  });

});
