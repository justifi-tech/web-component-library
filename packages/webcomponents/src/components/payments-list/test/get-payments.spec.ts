import { PaymentService } from '../../../api/services/payment.service';
import { makeGetPayments } from '../get-payments';
import mockResponse from '../../../../../../mockData/mockPaymentsSuccess.json';
import { IApiResponseCollection, IPayment, Payment } from '../../../api';

// Mock the PaymentService class
jest.mock('../../../api/services/payment.service');

describe('makeGetPayments', () => {
  const mockId = '123';
  const mockAuthToken = 'token';
  const mockParams = { limit: 10, page: 1 };

  let mockServiceInstance: jest.Mocked<PaymentService>;

  beforeEach(() => {
    jest.clearAllMocks();

    // Create a new instance of the mocked PaymentService
    mockServiceInstance = new PaymentService() as jest.Mocked<PaymentService>;

    // Explicitly mock fetchPayments as a jest mock function
    mockServiceInstance.fetchPayments = jest.fn();
  });

  it('should call onSuccess with payments and pagingInfo on successful fetch', async () => {
    const onSuccess = jest.fn();
    const onError = jest.fn();

    // Mock fetchPayments to resolve with mockResponse
    mockServiceInstance.fetchPayments.mockResolvedValue(
      mockResponse as IApiResponseCollection<IPayment[]>
    );

    const getPayments = makeGetPayments({
      id: mockId,
      authToken: mockAuthToken,
      service: mockServiceInstance,
    });
    await getPayments({ params: mockParams, onSuccess, onError });

    expect(onSuccess).toHaveBeenCalledWith({
      payments: expect.arrayContaining([
        expect.any(Payment),
        expect.any(Payment),
      ]),
      pagingInfo: mockResponse.page_info,
    });
    expect(onError).not.toHaveBeenCalled();
  });

  it('should call onError with an error message on API failure', async () => {
    const mockError = new Error('Error fetching payments');
    const onSuccess = jest.fn();
    const onError = jest.fn();

    // Mock fetchPayments to reject with mockError
    mockServiceInstance.fetchPayments.mockRejectedValue(mockError);

    const getPayments = makeGetPayments({
      id: mockId,
      authToken: mockAuthToken,
      service: mockServiceInstance,
    });
    await getPayments({ params: mockParams, onSuccess, onError });

    expect(onError).toHaveBeenCalledWith('Error fetching payments');
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('should call onError with an exception message on fetch exception', async () => {
    const mockError = new Error('Network error');
    const onSuccess = jest.fn();
    const onError = jest.fn();

    // Mock fetchPayments to reject with mockError
    mockServiceInstance.fetchPayments.mockRejectedValue(mockError);

    const getPayments = makeGetPayments({
      id: mockId,
      authToken: mockAuthToken,
      service: mockServiceInstance,
    });
    await getPayments({ params: mockParams, onSuccess, onError });

    expect(onError).toHaveBeenCalledWith('Network error');
    expect(onSuccess).not.toHaveBeenCalled();
  });

  // Add more tests as needed for edge cases and different scenarios
});
