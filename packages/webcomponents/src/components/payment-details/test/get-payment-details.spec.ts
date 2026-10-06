import { IApiResponse, IPayment, Payment } from '../../../api';
import { PaymentService } from '../../../api/services/payment.service';
import { makeGetPaymentDetails } from '../../../actions/payment/get-payment-details';
import mockResponse from '../../../../../../mockData/mockPaymentDetailSuccess.json';

// Mock the PaymentService class
jest.mock('../../../api/services/payment.service');

describe('getPaymentDetails', () => {
  const paymentId = '123';
  const authToken = '123';

  let mockServiceInstance: jest.Mocked<PaymentService>;

  beforeEach(() => {
    jest.clearAllMocks();

    // Create a new instance of the mocked PaymentService
    mockServiceInstance = new PaymentService() as jest.Mocked<PaymentService>;

    // Explicitly mock fetchPayment as a jest mock function
    mockServiceInstance.fetchPayment = jest.fn();
  });

  it('should call onSuccess with payment on successful fetch', async () => {
    const onSuccess = jest.fn();
    const onError = jest.fn();
    const final = jest.fn();

    // Mock fetchPayment to resolve with mockResponse
    mockServiceInstance.fetchPayment.mockResolvedValue(
      mockResponse as unknown as IApiResponse<IPayment>
    );

    const getPaymentDetails = makeGetPaymentDetails({
      id: paymentId,
      authToken: authToken,
      service: mockServiceInstance
    });
    await getPaymentDetails({ onSuccess, onError, final });

    expect(onSuccess).toHaveBeenCalledWith({
      payment: expect.any(Payment),
    });
    expect(onError).not.toHaveBeenCalled();
  });

  it('should call onError with an error message on API failure', async () => {
    const mockError = new Error('Error fetching payment');
    const onSuccess = jest.fn();
    const onError = jest.fn();
    const final = jest.fn();

    // Mock fetchPayment to reject with mockError
    mockServiceInstance.fetchPayment.mockRejectedValue(mockError);

    const getPaymentDetails = makeGetPaymentDetails({
      id: paymentId,
      authToken: authToken,
      service: mockServiceInstance
    });
    await getPaymentDetails({ onSuccess, onError, final });

    expect(onSuccess).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledWith({
      code: 'fetch-error',
      error: 'Error fetching payment',
      severity: 'error',
    });
  });

  it('should call onError with an error message on API failure', async () => {
    const mockError = new Error('Error fetching payment');
    const onSuccess = jest.fn();
    const onError = jest.fn();
    const final = jest.fn();

    // Mock fetchPayment to reject with mockError
    mockServiceInstance.fetchPayment.mockRejectedValue(mockError);

    const getPaymentDetails = makeGetPaymentDetails({
      id: paymentId,
      authToken: authToken,
      service: mockServiceInstance
    });
    await getPaymentDetails({ onSuccess, onError, final });

    expect(onSuccess).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledWith({
      code: 'fetch-error',
      error: 'Error fetching payment',
      severity: 'error',
    });
  });
});
