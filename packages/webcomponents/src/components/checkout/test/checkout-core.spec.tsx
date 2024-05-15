import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { CheckoutCore } from '../checkout-core';
import { makeGetCheckout } from '../checkout-actions';
import mockGetCheckoutSuccess from './../../../../../../mockData/mockGetCheckoutSuccess.json';
import { Checkout, ICheckout } from '../../../api/Checkout';

describe('justifi-checkout-core', () => {
  it('should display loading state correclty', async () => {
    const page = await newSpecPage({
      components: [CheckoutCore],
      template: () => <justifi-checkout-core />,
    });

    await page.waitForChanges();

    expect(page.root).toMatchSnapshot();
  });

  it('should display error state correctly', async () => {
    const getCheckout = makeGetCheckout({
      checkoutId: '',
      authToken: '',
      service: {
        fetchCheckout: async () => ({ error: 'error' }),
      },
    });

    const page = await newSpecPage({
      components: [CheckoutCore],
      template: () => <checkout-core getCheckout={getCheckout} />,
    });

    await page.waitForChanges();

    expect(page.root).toMatchSnapshot();
  });

  it('should set checkout correctly to state', async () => {
    const getCheckout = makeGetCheckout({
      checkoutId: '',
      authToken: '',
      service: {
        fetchCheckout: async () => mockGetCheckoutSuccess,
      },
    });

    const page = await newSpecPage({
      components: [CheckoutCore],
      template: () => <justifi-checkout-core getCheckout={getCheckout} />,
    });

    await page.waitForChanges();

    const expectedCheckout = new Checkout(mockGetCheckoutSuccess.data as unknown as ICheckout);
    expect(page.rootInstance.checkout).toEqual(expectedCheckout);
    expect(page.root).toMatchSnapshot();
  });

  it('should emit error event when fetch fails', async () => {
    const getCheckout = makeGetCheckout({
      authToken: 'abc',
      checkoutId: '123',
      service: {
        fetchCheckout: jest.fn().mockRejectedValue(new Error('Fetch error')),
      },
    })

    const errorSpy = jest.fn();

    const page = await newSpecPage({
      components: [CheckoutCore],
      template: () => <checkout-core getCheckout={getCheckout} onError-event={errorSpy} />,
    });

    await page.waitForChanges();

    expect(errorSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: {
          errorCode: 'fetch-error',
          message: 'Fetch error',
          severity: 'error',
        }
      })
    );
  });

  it('should emit error event when API returns error', async () => {

  });

  it('emits "submitted" event upon submit request completion', async () => {

  });
});
