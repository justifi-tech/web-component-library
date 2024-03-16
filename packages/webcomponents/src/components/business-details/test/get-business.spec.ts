import { makeGetBusiness } from '../get-business';
import mockResponse from '../../../api/mockData/mockBusinessDetails.json';
import { Business, IBusiness } from '../../../api/Business';

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
    const error = 'Test error';
    const responseError = { error };
    mockService.fetchBusiness.mockResolvedValue(responseError);

    const onSuccess = jest.fn();
    const onError = jest.fn();

    const getBusiness = makeGetBusiness({
      id,
      authToken,
      service: mockService,
    });
    await getBusiness({ onSuccess, onError });

    expect(onError).toHaveBeenCalledWith({ error });
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

    expect(onError).toHaveBeenCalledWith({ error: error.message });
  });
});
