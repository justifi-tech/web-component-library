jest.mock('../../../ui-components/styled-host/styled-host.css', () => '');

import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { CheckoutCore } from '../checkout-core';
import { makeCheckoutComplete, makeGetCheckout } from '../../../actions/checkout/checkout-actions';
import { Checkout, ICheckout } from '../../../api/Checkout';
import { API_NOT_AUTHENTICATED_ERROR } from '../../../api/shared';
import mockGetCheckoutSuccess from './../../../../../../mockData/mockGetCheckoutSuccess.json';
import mockPostCheckoutSuccess from './../../../../../../mockData/mockPostCheckoutSuccess.json';
import { PaymentMethodOptions } from '../payment-method-options';
import { BillingForm } from '../billing-form/billing-form';
import { NewPaymentMethod } from '../new-payment-method';

describe('justifi-checkout-core', () => {
  it('should display loading state correctly', async () => {
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

  it('should render the full billing form by default', async () => {
    const page = await newSpecPage({
      components: [CheckoutCore, PaymentMethodOptions, NewPaymentMethod, BillingForm],
      template: () => <justifi-checkout-core />,
    });

    await page.waitForChanges();

    expect(page.root).toMatchSnapshot();
  });

  it('should render the postal form if hideCardBillingForm prop is true', async () => {
    const page = await newSpecPage({
      components: [CheckoutCore, PaymentMethodOptions, NewPaymentMethod, BillingForm],
      template: () => <justifi-checkout-core hideCardBillingForm={true} />,
    });

    await page.waitForChanges();

    expect(page.root).toMatchSnapshot();
  });

  it('should emit error event when fetch fails', async () => {
    const getCheckout = makeGetCheckout({
      authToken: '',
      checkoutId: '',
      service: {
        fetchCheckout: jest.fn().mockRejectedValue(new Error('Fetch error')),
      },
    })

    const errorSpy = jest.fn();

    const page = await newSpecPage({
      components: [CheckoutCore],
      template: () => <justifi-checkout-core getCheckout={getCheckout} onError-event={errorSpy} />,
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
    const getCheckout = makeGetCheckout({
      authToken: '',
      checkoutId: '',
      service: {
        fetchCheckout: jest.fn().mockResolvedValue(API_NOT_AUTHENTICATED_ERROR),
      },
    })

    const errorSpy = jest.fn();

    const page = await newSpecPage({
      components: [CheckoutCore],
      template: () => <justifi-checkout-core getCheckout={getCheckout} onError-event={errorSpy} />,
    });

    await page.waitForChanges();

    expect(errorSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: {
          errorCode: 'not-authenticated',
          message: 'Not Authenticated',
          severity: 'error',
        }
      })
    );
  });

  it('emits "submitted" event upon submit request completion', async () => {
    const getCheckout = makeGetCheckout({
      authToken: '',
      checkoutId: '',
      service: {
        fetchCheckout: async () => mockGetCheckoutSuccess,
      }
    });

    const checkoutComplete = makeCheckoutComplete({
      authToken: '',
      checkoutId: '',
      service: {
        complete: async () => mockPostCheckoutSuccess,
      }
    });

    const submittedSpy = jest.fn();

    const page = await newSpecPage({
      components: [CheckoutCore, PaymentMethodOptions],
      template: () => <justifi-checkout-core getCheckout={getCheckout} complete={checkoutComplete} onSubmit-event={submittedSpy} />,
    });

    await page.waitForChanges();

    // mock resolved payment method (token) / select payment method
    const instance = page.rootInstance;
    instance.paymentMethodOptionsRef = { resolvePaymentMethod: jest.fn().mockResolvedValue({ token: '123' }) };

    // Submit the form
    const submitButton = page.root.shadowRoot.querySelector('button[type="submit"]');
    (submitButton as HTMLElement).click();

    await page.waitForChanges();

    expect(submittedSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: {
          response: mockPostCheckoutSuccess,
        }
      })
    );
  });
});
