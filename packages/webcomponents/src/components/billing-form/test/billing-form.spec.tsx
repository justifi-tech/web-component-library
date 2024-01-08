import { newSpecPage } from '@stencil/core/testing';
import { BillingForm } from '../billing-form';

describe('justifi-billing-form', () => {
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
    expect(instance.billingFields).toEqual(fields);
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
});
