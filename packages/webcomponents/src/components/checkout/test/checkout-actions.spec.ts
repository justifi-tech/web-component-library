import { makeGetCheckout, makeCheckoutComplete } from '../checkout-actions';
import mockResponse from '../../../../../../mockData/mockGetCheckoutSuccess.json';
import { Checkout, ICheckout } from '../../../api/Checkout';
import { API_NOT_AUTHENTICATED_ERROR } from '../../../api/shared';

// Mocks
jest.mock('../../../api/services/utils.ts', () => ({
  getErrorMessage: jest.fn(),
}));

const mockService = {
  fetchCheckout: jest.fn(),
  complete: jest.fn(),
};

// Test Suite
describe('makeGetCheckout', () => {
  const checkoutId = '123';
  const authToken = 'token';

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('calls onSuccess with a new Checkout instance on successful fetch', async () => {
    mockService.fetchCheckout.mockResolvedValue(mockResponse);

    const onSuccess = jest.fn();
    const onError = jest.fn();

    const getCheckout = makeGetCheckout({
      checkoutId,
      authToken,
      service: mockService,
    });
    await getCheckout({ onSuccess, onError });

    expect(onSuccess).toHaveBeenCalledWith({
      checkout: new Checkout(mockResponse.data as unknown as ICheckout),
    });
    expect(onError).not.toHaveBeenCalled();
  });

  it('calls onError with an error message on fetch error', async () => {
    mockService.fetchCheckout.mockResolvedValue(API_NOT_AUTHENTICATED_ERROR);

    const onSuccess = jest.fn();
    const onError = jest.fn();

    const getCheckout = makeGetCheckout({
      checkoutId,
      authToken,
      service: mockService,
    });
    await getCheckout({ onSuccess, onError });

    expect(onError).toHaveBeenCalledWith({
      error: 'Not Authenticated',
      code: 'not-authenticated',
      severity: 'error',
    });
  });

  it('calls onError with an error message on fetch exception', async () => {
    const error = new Error('Network error');
    mockService.fetchCheckout.mockRejectedValue(error);

    const onSuccess = jest.fn();
    const onError = jest.fn();

    const getCheckout = makeGetCheckout({
      checkoutId,
      authToken,
      service: mockService,
    });
    await getCheckout({ onSuccess, onError });

    expect(onError).toHaveBeenCalledWith({
      error: error.message,
      code: 'fetch-error',
      severity: 'error',
    });
  });
});

describe('makeCheckoutComplete', () => {
  const checkoutId = '123';
  const authToken = 'token';

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('calls onSuccess with checkout complete response data', async () => {
    mockService.complete.mockResolvedValue(mockResponse);

    const payment = { payment_mode: 'ecom', payment_token: '123' };
    const onSuccess = jest.fn();
    const onError = jest.fn();

    const completeCheckout = makeCheckoutComplete({
      checkoutId,
      authToken,
      service: mockService,
    });
    await completeCheckout({ payment, onSuccess, onError });

    expect(onSuccess).toHaveBeenCalledWith(mockResponse);
    expect(onError).not.toHaveBeenCalled();
  });

  it('calls onError with an error message on post error', async () => {
    mockService.complete.mockResolvedValue(API_NOT_AUTHENTICATED_ERROR);

    const payment = { payment_mode: 'ecom', payment_token: '123' };
    const onSuccess = jest.fn();
    const onError = jest.fn();

    const completeCheckout = makeCheckoutComplete({
      checkoutId,
      authToken,
      service: mockService,
    });
    await completeCheckout({ payment, onSuccess, onError });

    expect(onError).toHaveBeenCalledWith({
      error: 'Not Authenticated',
      code: 'not-authenticated',
      severity: 'error',
    });
  });

  it('calls onError with an error message on fetch exception', async () => {
    const error = new Error('Network error');
    mockService.complete.mockRejectedValue(error);

    const payment = { payment_mode: 'ecom', payment_token: '123' };
    const onSuccess = jest.fn();
    const onError = jest.fn();

    const completeCheckout = makeCheckoutComplete({
      checkoutId,
      authToken,
      service: mockService,
    });
    await completeCheckout({ payment, onSuccess, onError });

    expect(onError).toHaveBeenCalledWith({
      error: error.message,
      code: 'fetch-error',
      severity: 'error',
    });
  });
});
