import { newSpecPage } from '@stencil/core/testing';
import { BillingForm } from '../billing-form';

describe('billing-form', () => {
  it('fills the form', async () => {
    const page = await newSpecPage({
      components: [BillingForm],
      html: `<justifi-billing-form></justifi-billing-form>`,
    });

    const instance: any = page.rootInstance;

    const fields = {
      name: 'John Doe',
      address_line1: 'Street Address',
      address_line2: 'Apartment Address',
      address_city: 'New York',
      address_state: 'NY',
      address_postal_code: '10000',
    };

    await instance.fill(fields);
    const values = await instance.getValues();

    expect(values).toEqual(fields);
  });

  it('validates the form', async () => {
    const page = await newSpecPage({
      components: [BillingForm],
      html: `<justifi-billing-form></justifi-billing-form>`,
    });

    const instance: any = page.rootInstance;

    const fields = {
      name: 'John Doe',
      address_line1: 'Street Address',
      address_line2: 'Apartment Address',
      address_city: 'New York',
      address_state: 'NY',
      address_postal_code: '10000',
    };

    await instance.fill(fields);
    const { isValid } = await instance.validate();

    expect(isValid).toBe(true); // Assuming provided fields pass the validation
  });

  it('gets values of the form', async () => {
    const page = await newSpecPage({
      components: [BillingForm],
      html: `<justifi-billing-form></justifi-billing-form>`,
    });

    const instance: any = page.rootInstance;

    const fields = {
      name: 'John Doe',
      address_line1: 'Street Address',
      address_line2: 'Apartment Address',
      address_city: 'New York',
      address_state: 'NY',
      address_postal_code: '10000',
    };

    await instance.fill(fields);
    const values = await instance.getValues();

    expect(values).toEqual(fields);
  });

  it('should be in postal-only mode when hideCardBillingForm is true and paymentMethodType is card', async () => {
    const page = await newSpecPage({
      components: [BillingForm],
      html: `<justifi-billing-form hide-card-billing-form="true" payment-method-type="card"></justifi-billing-form>`,
    });

    const instance: any = page.rootInstance;

    await page.waitForChanges();

    expect(instance.hideCardBillingForm).toBe(true);
    expect(instance.paymentMethodType).toBe('card');
    expect(instance.isPostalOnlyMode).toBe(true);
    expect(instance.hideAllBillingFields).toBe(false);
  });

  it('should hide all billing fields when hideBankAccountBillingForm is true and paymentMethodType is bankAccount', async () => {
    const page = await newSpecPage({
      components: [BillingForm],
      html: `<justifi-billing-form hide-bank-account-billing-form="true" payment-method-type="bankAccount"></justifi-billing-form>`,
    });

    const instance: any = page.rootInstance;

    await page.waitForChanges();

    expect(instance.hideBankAccountBillingForm).toBe(true);
    expect(instance.paymentMethodType).toBe('bankAccount');
    expect(instance.isPostalOnlyMode).toBe(false);
    expect(instance.hideAllBillingFields).toBe(true);
  });

  it('should render only ZIP field when hideCardBillingForm is true (postal-only mode)', async () => {
    const page = await newSpecPage({
      components: [BillingForm],
      html: `<justifi-billing-form hide-card-billing-form="true" payment-method-type="card"></justifi-billing-form>`,
    });

    await page.waitForChanges();

    // In postal-only mode, only ZIP field should be rendered
    const nameField = page.root?.querySelector('[name="name"]');
    const addressField = page.root?.querySelector('[name="address_line1"]'); 
    const zipField = page.root?.querySelector('[name="address_postal_code"]');

    expect(nameField).toBeFalsy(); // Should not be rendered at all
    expect(addressField).toBeFalsy(); // Should not be rendered at all
    expect(zipField).toBeTruthy(); // Should be rendered
  });

  it('should render nothing when hideBankAccountBillingForm is true', async () => {
    const page = await newSpecPage({
      components: [BillingForm],
      html: `<justifi-billing-form hide-bank-account-billing-form="true" payment-method-type="bankAccount"></justifi-billing-form>`,
    });

    await page.waitForChanges();

    // When hideBankAccountBillingForm is true, nothing should be rendered inside Host
    const billingFormDiv = page.root?.querySelector('[part="billing-form"]');
    const zipField = page.root?.querySelector('[name="address_postal_code"]');
    
    expect(billingFormDiv).toBeFalsy(); // Should not be rendered at all
    expect(zipField).toBeFalsy(); // Should not be rendered at all
  });

  it('should render all fields by default when no hide props are set', async () => {
    const page = await newSpecPage({
      components: [BillingForm],
      html: `<justifi-billing-form payment-method-type="card"></justifi-billing-form>`,
    });

    await page.waitForChanges();

    // All fields should be present when no hide props are set
    const nameField = page.root?.querySelector('[name="name"]');
    const addressField = page.root?.querySelector('[name="address_line1"]');
    const address2Field = page.root?.querySelector('[name="address_line2"]');
    const cityField = page.root?.querySelector('[name="address_city"]');
    const stateField = page.root?.querySelector('[name="address_state"]');
    const zipField = page.root?.querySelector('[name="address_postal_code"]');
    const billingFormDiv = page.root?.querySelector('[part="billing-form"]');
    const header = page.root?.querySelector('h3');

    expect(billingFormDiv).toBeTruthy();
    expect(header).toBeTruthy(); // Header should be visible
    expect(nameField).toBeTruthy();
    expect(addressField).toBeTruthy();
    expect(address2Field).toBeTruthy();
    expect(cityField).toBeTruthy();
    expect(stateField).toBeTruthy();
    expect(zipField).toBeTruthy();
  });

  it('should not render billing address header in postal-only mode', async () => {
    const page = await newSpecPage({
      components: [BillingForm],
      html: `<justifi-billing-form hide-card-billing-form="true" payment-method-type="card"></justifi-billing-form>`,
    });

    await page.waitForChanges();

    // Header should be hidden in postal-only mode
    const header = page.root?.querySelector('h3');
    expect(header).toBeFalsy();
  });

  it('should handle form methods correctly even when fields are hidden', async () => {
    const page = await newSpecPage({
      components: [BillingForm],
      html: `<justifi-billing-form hide-card-billing-form="true" payment-method-type="card"></justifi-billing-form>`,
    });

    const instance: any = page.rootInstance;
    await page.waitForChanges();

    // Form methods should still work even in postal-only mode
    const testData = { address_postal_code: '12345' };
    await instance.fill(testData);
    
    const values = await instance.getValues();
    expect(values.address_postal_code).toBe('12345');

    const validation = await instance.validate();
    expect(validation).toHaveProperty('isValid');
    expect(validation).toHaveProperty('errors');
  });

  it('should handle form methods correctly when all fields are hidden', async () => {
    const page = await newSpecPage({
      components: [BillingForm],  
      html: `<justifi-billing-form hide-bank-account-billing-form="true" payment-method-type="bankAccount"></justifi-billing-form>`,
    });

    const instance: any = page.rootInstance;
    await page.waitForChanges();

    // Form methods should still work even when no fields are rendered
    const values = await instance.getValues();
    expect(values).toBeDefined();

    const validation = await instance.validate();
    expect(validation).toHaveProperty('isValid');
    expect(validation).toHaveProperty('errors');
  });
});
