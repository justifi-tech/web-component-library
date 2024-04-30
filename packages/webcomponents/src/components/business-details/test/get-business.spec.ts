import { makeGetBusiness } from '../get-business';
import mockResponse from '../../../api/mockData/mockBusinessDetails.json';
import { Business, IBusiness } from '../../../api/Business';
import { API_NOT_AUTHENTICATED_ERROR } from '../../../api/shared';

// Mocks
jest.mock('../../../api/services/utils.ts', () => ({
  getErrorMessage: jest.fn(),
}));

const mockService = {
  fetchBusiness: jest.fn(),
};

// Test Suite
describe('makeGetBusiness', () => {
  const id = '123';
  const authToken = 'token';

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('calls onSuccess with a new Business instance on successful fetch', async () => {
    mockService.fetchBusiness.mockResolvedValue(mockResponse);

    const onSuccess = jest.fn();
    const onError = jest.fn();

    const getBusiness = makeGetBusiness({
      id,
      authToken,
      service: mockService,
    });
    await getBusiness({ onSuccess, onError });

    expect(onSuccess).toHaveBeenCalledWith({
      business: new Business(mockResponse.data as unknown as IBusiness),
    });
    expect(onError).not.toHaveBeenCalled();
  });

  it('calls onError with an error message on fetch error', async () => {
    mockService.fetchBusiness.mockResolvedValue(API_NOT_AUTHENTICATED_ERROR);

    const onSuccess = jest.fn();
    const onError = jest.fn();

    const getBusiness = makeGetBusiness({
      id,
      authToken,
      service: mockService,
    });
    await getBusiness({ onSuccess, onError });

    expect(onError).toHaveBeenCalledWith({
      error: 'Not Authenticated',
      code: 'not-authenticated',
      severity: 'error',
    });
  });

  it('calls onError with an error message on fetch exception', async () => {
    const error = new Error('Network error');
    mockService.fetchBusiness.mockRejectedValue(error);

    const onSuccess = jest.fn();
    const onError = jest.fn();

    const getBusiness = makeGetBusiness({
      id,
      authToken,
      service: mockService,
    });
    await getBusiness({ onSuccess, onError });

    expect(onError).toHaveBeenCalledWith({
      error: error.message,
      code: 'fetch-error',
      severity: 'error',
    });
  });
});
