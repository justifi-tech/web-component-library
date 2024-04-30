import { IApiResponseCollection, IPayout, Payout } from '../../../api';
import { PayoutService } from '../../../api/services/payout.service';
import { makeGetPayouts } from '../get-payouts';
import mockResponse from '../../../../../../mockData/mockPayoutsSuccess.json';

describe('makeGetPayouts', () => {
  const mockId = '123';
  const mockAuthToken = 'token';
  const mockParams = { limit: 10, page: 1 };

  let mockServiceInstance: jest.Mocked<PayoutService>;

  beforeEach(() => {
    jest.clearAllMocks();

    // Create a new instance of the mocked PayoutService
    mockServiceInstance = new PayoutService() as jest.Mocked<PayoutService>;

    // Explicitly mock fetchPayouts as a jest mock function
    mockServiceInstance.fetchPayouts = jest.fn();
  });

  it('should call onSuccess with payouts and pagingInfo on successful fetch', async () => {
    const onSuccess = jest.fn();
    const onError = jest.fn();

    // Mock fetchPayouts to resolve with mockResponse
    mockServiceInstance.fetchPayouts.mockResolvedValue(
      mockResponse as IApiResponseCollection<IPayout[]>
    );

    const getPayouts = makeGetPayouts({
      id: mockId,
      authToken: mockAuthToken,
      service: mockServiceInstance,
    });
    await getPayouts({ params: mockParams, onSuccess, onError });

    expect(onSuccess).toHaveBeenCalledWith({
      payouts: expect.arrayContaining([expect.any(Payout), expect.any(Payout)]),
      pagingInfo: mockResponse.page_info,
    });
    expect(onError).not.toHaveBeenCalled();
  });

  it('should call onError with an error message on API failure', async () => {
    const mockError = new Error('Error fetching payouts');
    const onSuccess = jest.fn();
    const onError = jest.fn();

    // Mock fetchPayouts to reject with mockError
    mockServiceInstance.fetchPayouts.mockRejectedValue(mockError);

    const getPayouts = makeGetPayouts({
      id: mockId,
      authToken: mockAuthToken,
      service: mockServiceInstance,
    });
    await getPayouts({ params: mockParams, onSuccess, onError });

    expect(onError).toHaveBeenCalledWith({
      code: 'fetch-error',
      error: 'Error fetching payouts',
      severity: 'error',
    });
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('should call onError with an error message on API failure', async () => {
    const mockError = new Error('Error fetching payouts');
    const onSuccess = jest.fn();
    const onError = jest.fn();

    // Mock fetchPayouts to reject with mockError
    mockServiceInstance.fetchPayouts.mockRejectedValue(mockError);

    const getPayouts = makeGetPayouts({
      id: mockId,
      authToken: mockAuthToken,
      service: mockServiceInstance,
    });
    await getPayouts({ params: mockParams, onSuccess, onError });

    expect(onError).toHaveBeenCalledWith({
      code: 'fetch-error',
      error: 'Error fetching payouts',
      severity: 'error',
    });
    expect(onSuccess).not.toHaveBeenCalled();
  });
});
