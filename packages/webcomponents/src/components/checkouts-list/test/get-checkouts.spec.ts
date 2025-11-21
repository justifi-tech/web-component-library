import { CheckoutService } from '../../../api/services/checkout.service';
import { makeGetCheckouts } from '../../../actions/checkout/get-checkouts';
import mockResponse from '../../../../../../mockData/mockGetCheckoutsListSuccess.json';
import { IApiResponseCollection, ICheckout, Checkout } from '../../../api';

// Mock the CheckoutService class
jest.mock('../../../api/services/checkout.service');

describe('makeGetCheckouts', () => {
  const mockId = 'mock_id';
  const mockAuthToken = 'mock_token';
  const mockParams = { limit: 10, page: 1 };

  let mockServiceInstance: jest.Mocked<CheckoutService>;

  beforeEach(() => {
    jest.clearAllMocks();

    // Create a new instance of the mocked CheckoutService
    mockServiceInstance = new CheckoutService() as jest.Mocked<CheckoutService>;

    // Explicitly mock fetchPayments as a jest mock function
    mockServiceInstance.fetchCheckouts = jest.fn();
  });

  it('should call onSuccess with checkouts and pagingInfo on successful fetch', async () => {
    const onSuccess = jest.fn();
    const onError = jest.fn();

    // Mock fetchCheckouts to resolve with mockResponse
    mockServiceInstance.fetchCheckouts.mockResolvedValue(
      mockResponse as IApiResponseCollection<ICheckout[]>
    );

    const getCheckoutsList = makeGetCheckouts({
      accountId: mockId,
      authToken: mockAuthToken,
      service: mockServiceInstance
    });
    await getCheckoutsList({ params: mockParams, onSuccess, onError });

    expect(onSuccess).toHaveBeenCalledWith({
      checkouts: expect.arrayContaining([
        expect.any(Checkout),
        expect.any(Checkout),
      ]),
      pagingInfo: mockResponse.page_info,
    });
    expect(onError).not.toHaveBeenCalled();
  });

  it('should call onError with an error message on API failure', async () => {
    const mockError = new Error('Error fetching checkouts');
    const onSuccess = jest.fn();
    const onError = jest.fn();

    // Mock fetchCheckouts to reject with mockError
    mockServiceInstance.fetchCheckouts.mockRejectedValue(mockError);

    const getCheckoutsList = makeGetCheckouts({
      accountId: mockId,
      authToken: mockAuthToken,
      service: mockServiceInstance
    });
    await getCheckoutsList({ params: mockParams, onSuccess, onError });

    expect(onError).toHaveBeenCalledWith({
      code: 'fetch-error',
      error: 'Error fetching checkouts',
      severity: 'error',
    });
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('should call onError with an exception message on fetch exception', async () => {
    const mockError = new Error('Network error');
    const onSuccess = jest.fn();
    const onError = jest.fn();

    // Mock fetchCheckouts to reject with mockError
    mockServiceInstance.fetchCheckouts.mockRejectedValue(mockError);

    const getCheckoutsList = makeGetCheckouts({
      accountId: mockId,
      authToken: mockAuthToken,
      service: mockServiceInstance
    });
    await getCheckoutsList({ params: mockParams, onSuccess, onError });

    expect(onError).toHaveBeenCalledWith({
      code: 'fetch-error',
      error: 'Network error',
      severity: 'error',
    });
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('should correctly parse apple_pay payment_mode from completions', async () => {
    const onSuccess = jest.fn();
    const onError = jest.fn();

    // Mock response already includes an Apple Pay checkout (cho_5e6f7g8h9i0j1a2b3c4d)
    mockServiceInstance.fetchCheckouts.mockResolvedValue(
      mockResponse as IApiResponseCollection<ICheckout[]>
    );

    const getCheckoutsList = makeGetCheckouts({
      accountId: mockId,
      authToken: mockAuthToken,
      service: mockServiceInstance,
    });
    await getCheckoutsList({ params: mockParams, onSuccess, onError });

    expect(onSuccess).toHaveBeenCalled();
    const checkouts = onSuccess.mock.calls[0][0].checkouts;
    const applePayCheckout = checkouts.find(
      (checkout) => checkout.id === 'cho_5e6f7g8h9i0j1a2b3c4d'
    );
    expect(applePayCheckout).toBeInstanceOf(Checkout);
    expect(applePayCheckout.payment_mode).toBe('Apple Pay');
    expect(onError).not.toHaveBeenCalled();
  });

  // Add more tests as needed for edge cases and different scenarios
});
