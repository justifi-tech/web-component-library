import { h } from "@stencil/core";
import { newSpecPage } from '@stencil/core/testing';
import { CheckoutCore } from '../checkout-core';
import { makeGetCheckout } from '../checkout-actions';
import mockCheckout from './../../../../../../mockData/mockCheckout.json';

describe('justifi-checkout-core', () => {
  it('shows saved payment methods when the checkout loads and has saved payment methods', async () => {
    const getCheckout = makeGetCheckout({
      checkoutId: '',
      authToken: '',
      service: {
        fetchBusiness: async () => ({ error: 'error' }),
      },
    });

    const page = await newSpecPage({
      components: [CheckoutCore],
      template: () => <justifi-checkout-core getCheckout={getCheckout} />,
    });

    await page.waitForChanges();

    expect(page.root).toMatchSnapshot();
  });

  it('shows corresponding component when "New bank account" payment method option is selected', async () => {
    const page = await newSpecPage({
      components: [CheckoutCore],
      template: () => <justifi-checkout-core />,
    });

    await page.waitForChanges();

    expect(page.root).toMatchSnapshot();
  });

  it('shows corresponding component when "New credit or debit card" payment method option is selected', async () => {

  });

  it('Submitting gets token from selected payment method', async () => {

  });

  it('Emits "submitted" event upon submit request completion', async () => {

  });
});
