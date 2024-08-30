jest.mock('../../../utils/styled-host/modified-bootstrap.css', () => '');

import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import mockPaymentDetailsResponse from '../../../../../../mockData/mockPaymentDetailSuccess.json';
import { PaymentDetailsCore } from '../payment-details-core';
import { Details } from '../../details/details';
import { makeGetPaymentDetails } from '../get-payment-details';
import { API_NOT_AUTHENTICATED_ERROR } from '../../../api/shared';

describe('payment-details-core', () => {
  const components = [PaymentDetailsCore, Details];
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
});
