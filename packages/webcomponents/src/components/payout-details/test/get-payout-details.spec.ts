import { IApiResponse, Payout } from '../../../api';
import { PayoutService } from '../../../api/services/payout.service';
import { makeGetPayoutDetails } from '../../../actions/payout/get-payout-details';
import mockResponse from '../../../../../../mockData/mockPayoutDetailsSuccess.json';

describe('getPayout', () => {
  const mockId = '123';
  const mockAuthToken = '123';
  let mockServiceInstance: jest.Mocked<PayoutService>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockServiceInstance = new PayoutService() as jest.Mocked<PayoutService>;
    mockServiceInstance.fetchPayout = jest.fn();
  });

  it('should call onSuccess with payout on successful fetch', async () => {
    const onSuccess = jest.fn();
    const onError = jest.fn();

    mockServiceInstance.fetchPayout.mockResolvedValue(
      mockResponse as unknown as IApiResponse<Payout>
    );

    const getPayout = makeGetPayoutDetails({
      id: mockId,
      authToken: mockAuthToken,
      service: mockServiceInstance
    });
    await getPayout({ onSuccess, onError });

    expect(onSuccess).toHaveBeenCalledWith(expect.any(Payout));
    expect(onError).not.toHaveBeenCalled();
  });

  it('should call onError with an error message on API failure', async () => {
    const errorMessage = 'Error fetching payout';
    const mockError = new Error(errorMessage);
    const onSuccess = jest.fn();
    const onError = jest.fn();

    mockServiceInstance.fetchPayout.mockRejectedValue(mockError);

    const getPayout = makeGetPayoutDetails({
      id: mockId,
      authToken: mockAuthToken,
      service: mockServiceInstance
    });
    await getPayout({ onSuccess, onError });

    expect(onSuccess).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledWith({
      code: 'fetch-error',
      error: 'Error fetching payout',
      severity: 'error',
    });
  });

  it('should call onError with an error message on API failure with error message', async () => {
    const errorMessage = 'Error fetching payout';
    const mockError = new Error(errorMessage);
    const onSuccess = jest.fn();
    const onError = jest.fn();

    mockServiceInstance.fetchPayout.mockRejectedValue(mockError);

    const getPayout = makeGetPayoutDetails({
      id: mockId,
      authToken: mockAuthToken,
      service: mockServiceInstance
    });
    await getPayout({ onSuccess, onError });

    expect(onSuccess).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledWith({
      code: 'fetch-error',
      error: 'Error fetching payout',
      severity: 'error',
    });
  });
});
