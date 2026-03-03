import { newSpecPage } from '@stencil/core/testing';
import { JustifiBillingForm } from '../justifi-billing-form';
import { BillingForm } from '../billing-form';
import { BillingFormFull } from '../billing-form-full';
import { CardBillingFormSimple } from '../card-billing-form-simple';
import { BankAccountBillingFormSimple } from '../bank-account-billing-form-simple';
import { checkoutStore } from '../../../../store/checkout.store';

const billingFormComponents = [JustifiBillingForm, BillingForm, BillingFormFull, CardBillingFormSimple, BankAccountBillingFormSimple];

const fullBillingFields = {
  name: 'John Doe',
  address_line1: 'Street Address',
  address_line2: 'Apartment Address',
  address_city: 'New York',
  address_state: 'NY',
  address_postal_code: '10000',
};

describe('billing-form', () => {
  beforeEach(() => {
    checkoutStore.billingFormFields = { address_postal_code: '' };
  });
  it('fills the form', async () => {
    checkoutStore.billingFormFields = fullBillingFields;

    const page = await newSpecPage({
      components: billingFormComponents,
      html: `<justifi-billing-form></justifi-billing-form>`,
    });

    const instance: any = page.rootInstance;
    await page.waitForChanges();

    const values = await instance.getValues();

    expect(values).toEqual(fullBillingFields);
  });

  it('validates the form', async () => {
    checkoutStore.billingFormFields = fullBillingFields;

    const page = await newSpecPage({
      components: billingFormComponents,
      html: `<justifi-billing-form></justifi-billing-form>`,
    });

    const instance: any = page.rootInstance;
    await page.waitForChanges();

    const { isValid } = await instance.validate();

    expect(isValid).toBe(true); // Assuming provided fields pass the validation
  });

  it('gets values of the form', async () => {
    checkoutStore.billingFormFields = fullBillingFields;

    const page = await newSpecPage({
      components: billingFormComponents,
      html: `<justifi-billing-form></justifi-billing-form>`,
    });

    const instance: any = page.rootInstance;
    await page.waitForChanges();

    const values = await instance.getValues();

    expect(values).toEqual(fullBillingFields);
  });

  it('should show simple card billing form when hideCardBillingForm is true and paymentMethodType is card', async () => {
    const page = await newSpecPage({
      components: [BillingForm, BillingFormFull, CardBillingFormSimple, BankAccountBillingFormSimple],
      html: `<billing-form hide-card-billing-form="true" payment-method-type="new_card"></billing-form>`,
    });

    const instance: any = page.rootInstance;
    await page.waitForChanges();

    expect(instance.hideCardBillingForm).toBe(true);
    expect(instance.paymentMethodType).toBe('new_card');
    expect(instance.showSimpleCardBillingForm).toBe(true);
    expect(instance.showSimpleBankAccountBillingForm).toBe(false);
  });

  it('should show simple bank account billing form when hideBankAccountBillingForm is true and paymentMethodType is bankAccount', async () => {
    const page = await newSpecPage({
      components: [BillingForm, BillingFormFull, CardBillingFormSimple, BankAccountBillingFormSimple],
      html: `<billing-form hide-bank-account-billing-form="true" payment-method-type="new_bank_account"></billing-form>`,
    });

    const instance: any = page.rootInstance;
    await page.waitForChanges();

    expect(instance.hideBankAccountBillingForm).toBe(true);
    expect(instance.paymentMethodType).toBe('new_bank_account');
    expect(instance.showSimpleCardBillingForm).toBe(false);
    expect(instance.showSimpleBankAccountBillingForm).toBe(true);
  });

  it('should render only ZIP field when hideCardBillingForm is true (postal-only mode)', async () => {
    const page = await newSpecPage({
      components: billingFormComponents,
      html: `<justifi-billing-form hide-card-billing-form="true" payment-method-type="new_card"></justifi-billing-form>`,
    });

    await page.waitForChanges();

    const cardBillingFormSimpleElement = page.root?.shadowRoot?.querySelector('card-billing-form-simple') ?? page.root?.querySelector('card-billing-form-simple');
    const nameField = cardBillingFormSimpleElement?.querySelector('[name="name"]');
    const addressField = cardBillingFormSimpleElement?.querySelector('[name="address_line1"]');
    const zipField = cardBillingFormSimpleElement?.querySelector('[name="address_postal_code"]');

    expect(nameField).toBeFalsy();
    expect(addressField).toBeFalsy();
    expect(zipField).toBeTruthy();
  });

  it('should render only name field when hideBankAccountBillingForm is true', async () => {
    const page = await newSpecPage({
      components: billingFormComponents,
      html: `<justifi-billing-form hide-bank-account-billing-form="true" payment-method-type="new_bank_account"></justifi-billing-form>`,
    });

    await page.waitForChanges();

    const bankAccountBillingFormSimpleElement = page.root?.shadowRoot?.querySelector('bank-account-billing-form-simple') ?? page.root?.querySelector('bank-account-billing-form-simple');
    const nameField = bankAccountBillingFormSimpleElement?.querySelector('[name="name"]');
    const addressField = bankAccountBillingFormSimpleElement?.querySelector('[name="address_line1"]');
    const zipField = bankAccountBillingFormSimpleElement?.querySelector('[name="address_postal_code"]');

    expect(nameField).toBeTruthy();
    expect(addressField).toBeFalsy();
    expect(zipField).toBeFalsy();
  });

  it('should render all fields by default when no hide props are set', async () => {
    const page = await newSpecPage({
      components: billingFormComponents,
      html: `<justifi-billing-form payment-method-type="new_card"></justifi-billing-form>`,
    });

    await page.waitForChanges();

    // Wait for component to be fully rendered
    await page.waitForChanges();

    const billingFormFullElement = page.root?.shadowRoot?.querySelector('billing-form-full') ?? page.root?.querySelector('billing-form-full');
    const nameField = billingFormFullElement?.querySelector('[name="name"]');
    const addressField = billingFormFullElement?.querySelector('[name="address_line1"]');
    const address2Field = billingFormFullElement?.querySelector('[name="address_line2"]');
    const cityField = billingFormFullElement?.querySelector('[name="address_city"]');
    const stateField = billingFormFullElement?.querySelector('[name="address_state"]');
    const zipField = billingFormFullElement?.querySelector('[name="address_postal_code"]');
    const billingFormDiv = billingFormFullElement?.querySelector('[part="billing-form"]');
    const header = billingFormFullElement?.querySelector('h3');

    expect(billingFormDiv).toBeTruthy();
    expect(header).toBeTruthy();
    expect(nameField).toBeTruthy();
    expect(addressField).toBeTruthy();
    expect(address2Field).toBeTruthy();
    expect(cityField).toBeTruthy();
    expect(stateField).toBeTruthy();
    expect(zipField).toBeTruthy();
  });

  it('should not render billing address header in postal-only mode', async () => {
    const page = await newSpecPage({
      components: billingFormComponents,
      html: `<justifi-billing-form hide-card-billing-form="true" payment-method-type="new_card"></justifi-billing-form>`,
    });

    await page.waitForChanges();

    const cardBillingFormSimpleElement = page.root?.shadowRoot?.querySelector('card-billing-form-simple') ?? page.root?.querySelector('card-billing-form-simple');
    const header = cardBillingFormSimpleElement?.querySelector('h3');
    expect(header).toBeFalsy();
  });

  it('should not render billing address header in name-only mode', async () => {
    const page = await newSpecPage({
      components: billingFormComponents,
      html: `<justifi-billing-form hide-bank-account-billing-form="true" payment-method-type="new_bank_account"></justifi-billing-form>`,
    });

    await page.waitForChanges();

    const bankAccountBillingFormSimpleElement = page.root?.shadowRoot?.querySelector('bank-account-billing-form-simple') ?? page.root?.querySelector('bank-account-billing-form-simple');
    const header = bankAccountBillingFormSimpleElement?.querySelector('h3');
    expect(header).toBeFalsy();
  });

  it('should handle form methods correctly in postal-only mode', async () => {
    checkoutStore.billingFormFields = { address_postal_code: '12345' };

    const page = await newSpecPage({
      components: billingFormComponents,
      html: `<justifi-billing-form hide-card-billing-form="true" payment-method-type="new_card"></justifi-billing-form>`,
    });

    const instance: any = page.rootInstance;
    await page.waitForChanges();

    const values = await instance.getValues();
    expect(values.address_postal_code).toBe('12345');

    const validation = await instance.validate();
    expect(validation).toHaveProperty('isValid');
    expect(validation).toHaveProperty('errors');
  });

  it('should handle form methods correctly in name-only mode', async () => {
    checkoutStore.billingFormFields = { name: 'John Doe' };

    const page = await newSpecPage({
      components: billingFormComponents,
      html: `<justifi-billing-form hide-bank-account-billing-form="true" payment-method-type="new_bank_account"></justifi-billing-form>`,
    });

    const instance: any = page.rootInstance;
    await page.waitForChanges();

    const values = await instance.getValues();
    expect(values.name).toBe('John Doe');

    const validation = await instance.validate();
    expect(validation).toHaveProperty('isValid');
    expect(validation).toHaveProperty('errors');
  });

  it('should use fullBillingSchema for bank account when hide-bank-account-billing-form is false', async () => {
    const page = await newSpecPage({
      components: billingFormComponents,
      html: `<justifi-billing-form hide-bank-account-billing-form="false" payment-method-type="new_bank_account"></justifi-billing-form>`,
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
      components: billingFormComponents,
      html: `<justifi-billing-form payment-method-type="new_bank_account"></justifi-billing-form>`,
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
      components: billingFormComponents,
      html: `<justifi-billing-form hide-bank-account-billing-form="true" payment-method-type="new_bank_account"></justifi-billing-form>`,
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
