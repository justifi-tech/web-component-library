import { newSpecPage } from '@stencil/core/testing';
import { BillingForm } from '../billing-form';
import { BillingFormFull } from '../billing-form-full';
import { CardBillingFormSimple } from '../card-billing-form-simple';
import { BankAccountBillingFormSimple } from '../bank-account-billing-form-simple';

describe('billing-form', () => {
  it('fills the form', async () => {
    const page = await newSpecPage({
      components: [BillingForm, BillingFormFull, CardBillingFormSimple, BankAccountBillingFormSimple],
      html: `<justifi-billing-form></justifi-billing-form>`,
    });

    const instance: any = page.rootInstance;
    await page.waitForChanges();

    // Wait for component to be fully rendered
    await page.waitForChanges();

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
      components: [BillingForm, BillingFormFull, CardBillingFormSimple, BankAccountBillingFormSimple],
      html: `<justifi-billing-form></justifi-billing-form>`,
    });

    const instance: any = page.rootInstance;
    await page.waitForChanges();

    // Wait for component to be fully rendered
    await page.waitForChanges();

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
      components: [BillingForm, BillingFormFull, CardBillingFormSimple, BankAccountBillingFormSimple],
      html: `<justifi-billing-form></justifi-billing-form>`,
    });

    const instance: any = page.rootInstance;
    await page.waitForChanges();

    // Wait for component to be fully rendered
    await page.waitForChanges();

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

  it('should show simple card billing form when hideCardBillingForm is true and paymentMethodType is card', async () => {
    const page = await newSpecPage({
      components: [BillingForm, BillingFormFull, CardBillingFormSimple, BankAccountBillingFormSimple],
      html: `<justifi-billing-form hide-card-billing-form="true" payment-method-type="card"></justifi-billing-form>`,
    });

    const instance: any = page.rootInstance;
    await page.waitForChanges();

    expect(instance.hideCardBillingForm).toBe(true);
    expect(instance.paymentMethodType).toBe('card');
    expect(instance.showSimpleCardBillingForm).toBe(true);
    expect(instance.showSimpleBankAccountBillingForm).toBe(false);
  });

  it('should show simple bank account billing form when hideBankAccountBillingForm is true and paymentMethodType is bankAccount', async () => {
    const page = await newSpecPage({
      components: [BillingForm, BillingFormFull, CardBillingFormSimple, BankAccountBillingFormSimple],
      html: `<justifi-billing-form hide-bank-account-billing-form="true" payment-method-type="bankAccount"></justifi-billing-form>`,
    });

    const instance: any = page.rootInstance;
    await page.waitForChanges();

    expect(instance.hideBankAccountBillingForm).toBe(true);
    expect(instance.paymentMethodType).toBe('bankAccount');
    expect(instance.showSimpleCardBillingForm).toBe(false);
    expect(instance.showSimpleBankAccountBillingForm).toBe(true);
  });

  it('should render only ZIP field when hideCardBillingForm is true (postal-only mode)', async () => {
    const page = await newSpecPage({
      components: [BillingForm, BillingFormFull, CardBillingFormSimple, BankAccountBillingFormSimple],
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

  it('should render only name field when hideBankAccountBillingForm is true', async () => {
    const page = await newSpecPage({
      components: [BillingForm, BillingFormFull, CardBillingFormSimple, BankAccountBillingFormSimple],
      html: `<justifi-billing-form hide-bank-account-billing-form="true" payment-method-type="bankAccount"></justifi-billing-form>`,
    });

    await page.waitForChanges();

    // When hideBankAccountBillingForm is true, only name field should be rendered
    const nameField = page.root?.querySelector('[name="name"]');
    const addressField = page.root?.querySelector('[name="address_line1"]');
    const zipField = page.root?.querySelector('[name="address_postal_code"]');

    expect(nameField).toBeTruthy(); // Should be rendered
    expect(addressField).toBeFalsy(); // Should not be rendered at all
    expect(zipField).toBeFalsy(); // Should not be rendered at all
  });

  it('should render all fields by default when no hide props are set', async () => {
    const page = await newSpecPage({
      components: [BillingForm, BillingFormFull, CardBillingFormSimple, BankAccountBillingFormSimple],
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
      components: [BillingForm, BillingFormFull, CardBillingFormSimple, BankAccountBillingFormSimple],
      html: `<justifi-billing-form hide-card-billing-form="true" payment-method-type="card"></justifi-billing-form>`,
    });

    await page.waitForChanges();

    // Header should be hidden in postal-only mode
    const header = page.root?.querySelector('h3');
    expect(header).toBeFalsy();
  });

  it('should not render billing address header in name-only mode', async () => {
    const page = await newSpecPage({
      components: [BillingForm, BillingFormFull, CardBillingFormSimple, BankAccountBillingFormSimple],
      html: `<justifi-billing-form hide-bank-account-billing-form="true" payment-method-type="bankAccount"></justifi-billing-form>`,
    });

    await page.waitForChanges();

    // Header should be hidden in name-only mode
    const header = page.root?.querySelector('h3');
    expect(header).toBeFalsy();
  });

  it('should handle form methods correctly in postal-only mode', async () => {
    const page = await newSpecPage({
      components: [BillingForm, BillingFormFull, CardBillingFormSimple, BankAccountBillingFormSimple],
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

  it('should handle form methods correctly in name-only mode', async () => {
    const page = await newSpecPage({
      components: [BillingForm, BillingFormFull, CardBillingFormSimple, BankAccountBillingFormSimple],
      html: `<justifi-billing-form hide-bank-account-billing-form="true" payment-method-type="bankAccount"></justifi-billing-form>`,
    });

    const instance: any = page.rootInstance;
    await page.waitForChanges();

    // Form methods should still work in name-only mode
    const testData = { name: 'John Doe' };
    await instance.fill(testData);

    const values = await instance.getValues();
    expect(values.name).toBe('John Doe');

    const validation = await instance.validate();
    expect(validation).toHaveProperty('isValid');
    expect(validation).toHaveProperty('errors');
  });

  it('should use fullBillingSchema for bank account when hide-bank-account-billing-form is false', async () => {
    const page = await newSpecPage({
      components: [BillingForm, BillingFormFull, CardBillingFormSimple, BankAccountBillingFormSimple],
      html: `<justifi-billing-form hide-bank-account-billing-form="false" payment-method-type="bankAccount"></justifi-billing-form>`,
    });

    const instance: any = page.rootInstance;
    await page.waitForChanges();

    // Should require all billing fields when bank account form is not hidden
    const validation = await instance.validate();
    expect(validation.isValid).toBe(false);
    expect(validation.errors).toHaveProperty('name');
    expect(validation.errors).toHaveProperty('address_line1');
    expect(validation.errors).toHaveProperty('address_city');
    expect(validation.errors).toHaveProperty('address_state');
    expect(validation.errors).toHaveProperty('address_postal_code');
  });

  it('should use fullBillingSchema for bank account when hide prop is not set', async () => {
    const page = await newSpecPage({
      components: [BillingForm, BillingFormFull, CardBillingFormSimple, BankAccountBillingFormSimple],
      html: `<justifi-billing-form payment-method-type="bankAccount"></justifi-billing-form>`,
    });

    const instance: any = page.rootInstance;
    await page.waitForChanges();

    // Should require all billing fields when bank account form is not hidden
    const validation = await instance.validate();
    expect(validation.isValid).toBe(false);
    expect(validation.errors).toHaveProperty('name');
    expect(validation.errors).toHaveProperty('address_line1');
    expect(validation.errors).toHaveProperty('address_city');
    expect(validation.errors).toHaveProperty('address_state');
    expect(validation.errors).toHaveProperty('address_postal_code');
  });

  it('should require only name field in name-only mode', async () => {
    const page = await newSpecPage({
      components: [BillingForm, BillingFormFull, CardBillingFormSimple, BankAccountBillingFormSimple],
      html: `<justifi-billing-form hide-bank-account-billing-form="true" payment-method-type="bankAccount"></justifi-billing-form>`,
    });

    const instance: any = page.rootInstance;
    await page.waitForChanges();

    // Should only require name field in name-only mode
    const validation = await instance.validate();
    expect(validation.isValid).toBe(false);
    expect(validation.errors).toHaveProperty('name');
    expect(validation.errors).not.toHaveProperty('address_line1');
    expect(validation.errors).not.toHaveProperty('address_city');
    expect(validation.errors).not.toHaveProperty('address_state');
    expect(validation.errors).not.toHaveProperty('address_postal_code');
  });
});
