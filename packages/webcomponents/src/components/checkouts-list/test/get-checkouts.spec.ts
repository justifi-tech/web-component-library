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
  const mockApiOrigin = 'http://localhost:3000';

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
      service: mockServiceInstance,
      apiOrigin: mockApiOrigin,
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
      service: mockServiceInstance,
      apiOrigin: mockApiOrigin,
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
      service: mockServiceInstance,
      apiOrigin: mockApiOrigin,
    });
    await getCheckoutsList({ params: mockParams, onSuccess, onError });

    expect(onError).toHaveBeenCalledWith({
      code: 'fetch-error',
      error: 'Network error',
      severity: 'error',
    });
    expect(onSuccess).not.toHaveBeenCalled();
  });

  // Add more tests as needed for edge cases and different scenarios
});
