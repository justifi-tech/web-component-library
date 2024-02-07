import { newSpecPage } from '@stencil/core/testing';
import { PaymentDetailsCore } from '../payment-details-core';
import mockPaymentDetailSuccess from '../../../api/mockData/mockPaymentDetailSuccess.json';

describe('payment-details-core', () => {
  let paymentServiceMock;

  beforeEach(() => {
    paymentServiceMock = {
      fetchPayment: jest.fn(),
    };
  });

  it('renders loading state initially', async () => {
    const page = await newSpecPage({
      components: [PaymentDetailsCore],
      html: '<payment-details-core></payment-details-core>',
    });
    expect(page.root).toMatchSnapshot();
  });

  it('renders error state when no paymentId or authToken', async () => {
    const page = await newSpecPage({
      components: [PaymentDetailsCore],
      html: '<payment-details-core></payment-details-core>',
    });
    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  });

  it('fetches payment details on connected callback', async () => {
    paymentServiceMock.fetchPayment.mockResolvedValueOnce(mockPaymentDetailSuccess);
    const page = await newSpecPage({
      components: [PaymentDetailsCore],
      html: '<payment-details-core></payment-details-core>',
      supportsShadowDom: true,
    });

    page.rootInstance.paymentId = '123';
    page.rootInstance.authToken = 'token';
    page.rootInstance.paymentService = paymentServiceMock;
    await page.waitForChanges();

    expect(paymentServiceMock.fetchPayment).toHaveBeenCalledWith('123', 'token');
    expect(page.rootInstance.payment).toEqual(expect.objectContaining({
      "id": "py_1NNeEnf4FbelxDCQN2RHcE"
    }));
    expect(page.root).toMatchSnapshot();
  });

  it('handles fetch payment error correctly', async () => {
    paymentServiceMock.fetchPayment.mockRejectedValueOnce('Fetch error');
    const page = await newSpecPage({
      components: [PaymentDetailsCore],
      html: '<payment-details-core></payment-details-core>',
    });

    page.root.paymentId = '123';
    page.root.authToken = 'token';
    page.root.paymentService = paymentServiceMock;
    await page.waitForChanges();

    expect(page.rootInstance.errorMessage).toBe('Error trying to fetch data : Fetch error');
    expect(page.root).toMatchSnapshot();
  });
});

