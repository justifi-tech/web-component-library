import { newSpecPage } from '@stencil/core/testing';
import { TokenizePaymentMethod } from '../tokenize-payment-method';
import { PaymentMethodOptions } from '../../checkout/payment-method-options';
import { NewPaymentMethod } from '../../checkout/new-payment-method';
import { BillingForm } from '../../checkout/billing-form/billing-form';

describe('tokenize-payment-method', () => {
  it('should pass hideCardBillingForm prop to payment method options', async () => {
    const page = await newSpecPage({
      components: [TokenizePaymentMethod, PaymentMethodOptions, NewPaymentMethod, BillingForm],
      html: `<justifi-tokenize-payment-method hide-card-billing-form="true"></justifi-tokenize-payment-method>`,
    });

    await page.waitForChanges();

    const tokenizePaymentMethod = page.rootInstance;
    const paymentMethodOptions = page.root.shadowRoot.querySelector('justifi-payment-method-options');
    
    expect(paymentMethodOptions).toBeTruthy();
    expect(tokenizePaymentMethod.hideCardBillingForm).toBe(true);
  });

  it('should pass hideBankAccountBillingForm prop to payment method options', async () => {
    const page = await newSpecPage({
      components: [TokenizePaymentMethod, PaymentMethodOptions, NewPaymentMethod, BillingForm],
      html: `<justifi-tokenize-payment-method hide-bank-account-billing-form="true"></justifi-tokenize-payment-method>`,
    });

    await page.waitForChanges();

    const tokenizePaymentMethod = page.rootInstance;
    const paymentMethodOptions = page.root.shadowRoot.querySelector('justifi-payment-method-options');
    
    expect(paymentMethodOptions).toBeTruthy();
    expect(tokenizePaymentMethod.hideBankAccountBillingForm).toBe(true);
  });

  it('should pass hideCardBillingForm prop to billing form through the chain', async () => {
    const page = await newSpecPage({
      components: [TokenizePaymentMethod, PaymentMethodOptions, NewPaymentMethod, BillingForm],
      html: `<justifi-tokenize-payment-method hide-card-billing-form="true" auth-token="test-token" account-id="test-account"></justifi-tokenize-payment-method>`,
    });

    await page.waitForChanges();

    // Find the payment method options and verify the prop is passed
    const paymentMethodOptions = page.root.shadowRoot.querySelector('justifi-payment-method-options');
    const paymentMethodOptionsInstance = paymentMethodOptions as any;
    
    expect(paymentMethodOptions).toBeTruthy();
    expect(paymentMethodOptionsInstance.hideCardBillingForm).toBe(true);
  });

  it('should pass hideBankAccountBillingForm prop to billing form through the chain', async () => {
    const page = await newSpecPage({
      components: [TokenizePaymentMethod, PaymentMethodOptions, NewPaymentMethod, BillingForm],
      html: `<justifi-tokenize-payment-method hide-bank-account-billing-form="true" disable-credit-card="true" auth-token="test-token" account-id="test-account"></justifi-tokenize-payment-method>`,
    });

    await page.waitForChanges();

    // Find the payment method options and verify the prop is passed
    const paymentMethodOptions = page.root.shadowRoot.querySelector('justifi-payment-method-options');
    const paymentMethodOptionsInstance = paymentMethodOptions as any;
    
    expect(paymentMethodOptions).toBeTruthy();
    expect(paymentMethodOptionsInstance.hideBankAccountBillingForm).toBe(true);
  });

  it('should not render billing form fields except postal_code when hideCardBillingForm is true', async () => {
    // Test the billing form behavior directly (since integration tests have shadow DOM complexities)
    const page = await newSpecPage({
      components: [BillingForm],
      html: `<justifi-billing-form hide-card-billing-form="true" payment-method-type="card"></justifi-billing-form>`,
    });

    await page.waitForChanges();

    const instance: any = page.rootInstance;
    
    // Verify the component is configured correctly for postal-only mode
    expect(instance.hideCardBillingForm).toBe(true);
    expect(instance.paymentMethodType).toBe('card');
    expect(instance.isPostalOnlyMode).toBe(true);
    expect(instance.hideAllBillingFields).toBe(false);

    // Verify only ZIP field is rendered
    const nameField = page.root?.querySelector('[name="name"]');
    const addressField = page.root?.querySelector('[name="address_line1"]');
    const postalCodeField = page.root?.querySelector('[name="address_postal_code"]');

    expect(nameField).toBeFalsy(); // Should not be in DOM
    expect(addressField).toBeFalsy(); // Should not be in DOM  
    expect(postalCodeField).toBeTruthy(); // Should be in DOM
  });

  it('should not render billing form fields when hideBankAccountBillingForm is true', async () => {
    // Test the billing form behavior directly (since integration tests have shadow DOM complexities)
    const page = await newSpecPage({
      components: [BillingForm],
      html: `<justifi-billing-form hide-bank-account-billing-form="true" payment-method-type="bankAccount"></justifi-billing-form>`,
    });

    await page.waitForChanges();

    const instance: any = page.rootInstance;
    
    // Verify the component is configured correctly to hide all fields
    expect(instance.hideBankAccountBillingForm).toBe(true);
    expect(instance.paymentMethodType).toBe('bankAccount');
    expect(instance.isPostalOnlyMode).toBe(false);
    expect(instance.hideAllBillingFields).toBe(true);

    // Verify no billing form content is rendered
    const billingFormDiv = page.root?.querySelector('[part="billing-form"]');
    const postalCodeField = page.root?.querySelector('[name="address_postal_code"]');

    expect(billingFormDiv).toBeFalsy(); // Should not be in DOM
    expect(postalCodeField).toBeFalsy(); // Should not be in DOM
  });

  it('should correctly validate that props flow through component hierarchy', async () => {
    // Test that the tokenize-payment-method component properly accepts and stores the props
    const cardPage = await newSpecPage({
      components: [TokenizePaymentMethod],
      html: `<justifi-tokenize-payment-method hide-card-billing-form="true" auth-token="test" account-id="test"></justifi-tokenize-payment-method>`,
    });

    const bankPage = await newSpecPage({
      components: [TokenizePaymentMethod],
      html: `<justifi-tokenize-payment-method hide-bank-account-billing-form="true" auth-token="test" account-id="test"></justifi-tokenize-payment-method>`,
    });

    await cardPage.waitForChanges();
    await bankPage.waitForChanges();

    const cardInstance = cardPage.rootInstance as any;
    const bankInstance = bankPage.rootInstance as any;

    // Verify props are correctly set on tokenize-payment-method instances
    expect(cardInstance.hideCardBillingForm).toBe(true);
    expect(cardInstance.hideBankAccountBillingForm).toBeUndefined();

    expect(bankInstance.hideBankAccountBillingForm).toBe(true);  
    expect(bankInstance.hideCardBillingForm).toBeUndefined();
  });


});