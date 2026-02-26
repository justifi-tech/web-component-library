import { newSpecPage } from '@stencil/core/testing';
import { CardBillingFormSimple } from '../card-billing-form-simple';
import { BankAccountBillingFormSimple } from '../bank-account-billing-form-simple';
import { BillingFormFull } from '../billing-form-full';
import { checkoutStore } from '../../../../store/checkout.store';

describe('billing-form-store-sync', () => {
  beforeEach(() => {
    checkoutStore.billingFormFields = { address_postal_code: '' };
  });

  it('card-billing-form-simple reads checkoutStore.billingFormFields on mount', async () => {
    checkoutStore.billingFormFields = {
      address_postal_code: '90210',
    };

    const page = await newSpecPage({
      components: [CardBillingFormSimple],
      html: `<justifi-card-billing-form-simple></justifi-card-billing-form-simple>`,
    });

    await page.waitForChanges();

    const instance = page.rootInstance as any;
    const values = await instance.getValues();
    expect(values.address_postal_code).toBe('90210');
  });

  it('bank-account-billing-form-simple reads checkoutStore.billingFormFields on mount', async () => {
    checkoutStore.billingFormFields = {
      name: 'Jane Doe',
      address_postal_code: '',
    };

    const page = await newSpecPage({
      components: [BankAccountBillingFormSimple],
      html: `<justifi-bank-account-billing-form-simple></justifi-bank-account-billing-form-simple>`,
    });

    await page.waitForChanges();

    const instance = page.rootInstance as any;
    const values = await instance.getValues();
    expect(values.name).toBe('Jane Doe');
  });

  it('billing-form-full reads checkoutStore.billingFormFields on mount', async () => {
    checkoutStore.billingFormFields = {
      name: 'John Doe',
      address_line1: '123 Main St',
      address_city: 'Beverly Hills',
      address_state: 'CA',
      address_postal_code: '90210',
    };

    const page = await newSpecPage({
      components: [BillingFormFull],
      html: `<justifi-billing-form-full></justifi-billing-form-full>`,
    });

    await page.waitForChanges();

    const instance = page.rootInstance as any;
    const values = await instance.getValues();
    expect(values.name).toBe('John Doe');
    expect(values.address_line1).toBe('123 Main St');
    expect(values.address_postal_code).toBe('90210');
  });

  it('sub-components react to store changes after mount', async () => {
    checkoutStore.billingFormFields = { address_postal_code: '11111' };

    const page = await newSpecPage({
      components: [CardBillingFormSimple],
      html: `<justifi-card-billing-form-simple></justifi-card-billing-form-simple>`,
    });

    await page.waitForChanges();

    let values = await (page.rootInstance as any).getValues();
    expect(values.address_postal_code).toBe('11111');

    // Update store after mount
    checkoutStore.billingFormFields = { address_postal_code: '22222' };
    await page.waitForChanges();

    values = await (page.rootInstance as any).getValues();
    expect(values.address_postal_code).toBe('22222');
  });
});
