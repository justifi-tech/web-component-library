jest.mock('../../../ui-components/styled-host/styled-host.css', () => '');

import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import mockPaymentDetailsResponse from '../../../../../../mockData/mockPaymentDetailSuccess.json';
import { PaymentDetailsCore } from '../payment-details-core';
import { JustifiDetails } from '../../../ui-components/details/justifi-details';
import { makeGetPaymentDetails } from '../../../actions/payment/get-payment-details';
import { API_NOT_AUTHENTICATED_ERROR } from '../../../api/shared';

describe('payment-details-core', () => {
  const components = [PaymentDetailsCore, JustifiDetails];
  it('it renders properly with fetched data', async () => {
    const mockPaymentService = {
      fetchPayment: jest.fn().mockResolvedValue(mockPaymentDetailsResponse),
    };

    const getPaymentDetails = makeGetPaymentDetails({
      id: '123',
      authToken: '123',
      service: mockPaymentService
    });

    const page = await newSpecPage({
      components,
      template: () => <payment-details-core getPaymentDetails={getPaymentDetails} />,
    });

    await page.waitForChanges();

    expect(page.rootInstance.payment).toEqual(expect.objectContaining({ id: mockPaymentDetailsResponse.data.id }));
    expect(mockPaymentService.fetchPayment).toHaveBeenCalled();
    expect(page.root).toMatchSnapshot();
  });

  it('displays an error state on failed data fetch', async () => {
    const mockService = {
      fetchPayment: jest.fn().mockRejectedValue(new Error('Fetch error'))
    };

    const getPaymentDetails = makeGetPaymentDetails({
      id: 'some-id',
      authToken: 'some-auth-token',
      service: mockService
    });

    const page = await newSpecPage({
      components,
      template: () => <payment-details-core getPaymentDetails={getPaymentDetails} />,
    });

    await page.waitForChanges();

    expect(page.root).toMatchSnapshot();
  });

  it('emits an error event when there is an error fetching data', async () => {
    const mockService = {
      fetchPayment: jest.fn().mockRejectedValue(new Error('Fetch error'))
    };

    const getPaymentDetails = makeGetPaymentDetails({
      id: 'some-id',
      authToken: 'some-auth-token',
      service: mockService
    });

    const errorSpy = jest.fn();

    const page = await newSpecPage({
      components,
      template: () => <payment-details-core getPaymentDetails={getPaymentDetails} onError-event={errorSpy} />,
    });

    await page.waitForChanges();

    expect(errorSpy).toHaveBeenCalledWith(expect.objectContaining({
      detail: {
        message: 'Fetch error',
        errorCode: 'fetch-error',
        severity: 'error'
      }
    }));
  });

  it('emits an error event when API return an error', async () => {
    const mockService = {
      fetchPayment: jest.fn().mockResolvedValue(API_NOT_AUTHENTICATED_ERROR)
    };

    const getPaymentDetails = makeGetPaymentDetails({
      id: 'some-id',
      authToken: 'some-auth-token',
      service: mockService
    });

    const errorSpy = jest.fn();

    const page = await newSpecPage({
      components,
      template: () => <payment-details-core getPaymentDetails={getPaymentDetails} onError-event={errorSpy} />,
    });

    await page.waitForChanges();

    expect(errorSpy).toHaveBeenCalledWith(expect.objectContaining({
      detail: {
        message: 'Not Authenticated',
        errorCode: 'not-authenticated',
        severity: 'error'
      }
    }));
  });

  it('renders Dispute Lost badge when payment is disputed and a dispute was lost', async () => {
    const disputedLostResponse = JSON.parse(JSON.stringify(mockPaymentDetailsResponse));

    disputedLostResponse.data.status = 'disputed';
    disputedLostResponse.data.disputed = true;
    disputedLostResponse.data.disputes = [
      {
        amount_cents: 1000,
        created_at: disputedLostResponse.data.created_at,
        currency: disputedLostResponse.data.currency,
        gateway_ref_id: 'gw_test_1',
        id: 'dp_test_1',
        payment_id: disputedLostResponse.data.id,
        reason: null,
        status: 'lost',
        updated_at: disputedLostResponse.data.updated_at,
      },
    ];

    const mockPaymentService = {
      fetchPayment: jest.fn().mockResolvedValue(disputedLostResponse),
    };

    const getPaymentDetails = makeGetPaymentDetails({
      id: '123',
      authToken: '123',
      service: mockPaymentService,
    });

    const page = await newSpecPage({
      components,
      template: () => <payment-details-core getPaymentDetails={getPaymentDetails} />,
    });

    await page.waitForChanges();

    expect(page.root).toMatchSnapshot();
  });
});
