import { newSpecPage } from '@stencil/core/testing';
import mockPaymentDetailsResponse from '../../../api/mockData/mockPaymentDetailSuccess.json';
import { PaymentDetailsCore } from '../payment-details-core';
import { Details } from '../../details/details';
import { makeGetPaymentDetails } from '../get-payment-details';

describe('payment-details-core', () => {
  const components = [PaymentDetailsCore, Details];
  it('it renders properly with fetched data', async () => {
    const mockPaymentService = {
      fetchPayment: jest.fn().mockResolvedValue(mockPaymentDetailsResponse),
    };

    const page = await newSpecPage({
      components,
      html: `<payment-details-core></payment-details-core>`,
    });

    page.rootInstance.componentWillLoad = () => { };

    page.rootInstance.getPaymentDetails = makeGetPaymentDetails({
      id: '123',
      authToken: '123',
      service: mockPaymentService
    });

    page.rootInstance.fetchData();
    await page.waitForChanges();

    expect(page.rootInstance.payment).toEqual(expect.objectContaining({ id: mockPaymentDetailsResponse.data.id }));
    expect(mockPaymentService.fetchPayment).toHaveBeenCalled();
    // expect(page.root).toMatchSnapshot();
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
      html: '<payment-details-core></payment-details-core>',
    });

    page.rootInstance.componentWillLoad = () => { };

    page.rootInstance.getPaymentDetails = getPaymentDetails;
    page.rootInstance.fetchData();
    await page.waitForChanges();

    // expect(page.root).toMatchSnapshot();
  });
});
