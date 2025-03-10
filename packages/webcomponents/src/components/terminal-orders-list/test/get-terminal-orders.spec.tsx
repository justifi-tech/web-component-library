import { TerminalOrderService } from '../../../api/services/terminal_orders.service';
import { makeGetTerminalOrders } from '../../../actions/terminal/get-terminal-orders';
import mockResponse from '../../../../../../mockData/mockTerminalOrdersListSuccess.json';
import { IApiResponseCollection, ITerminalOrder, TerminalOrder } from '../../../api';

// Mock the TerminalOrderService class
jest.mock('../../../api/services/terminal_orders.service');

describe('makeGetTerminalOrders', () => {
  const mockId = '123';
  const mockAuthToken = 'fake_token_789';
  const mockParams = { limit: 10, page: 1 };
  const mockApiOrigin = 'http://localhost:3000';

  const onSuccess = jest.fn();
  const onError = jest.fn();
  const final = jest.fn();

  let mockServiceInstance: jest.Mocked<TerminalOrderService>;

  beforeEach(() => {
    jest.clearAllMocks();

    // Create a new instance of the mocked TerminalOrderService
    mockServiceInstance = new TerminalOrderService() as jest.Mocked<TerminalOrderService>;

    // Explicitly mock fetchTerminalOrders as a jest mock function
    mockServiceInstance.fetchTerminalOrders = jest.fn();
  });

  it('should call onSuccess with terminals and pagingInfo on successful fetch', async () => {
    
    // Mock fetchTerminalOrders to resolve with mockResponse
    mockServiceInstance.fetchTerminalOrders.mockResolvedValue(
      mockResponse as IApiResponseCollection<ITerminalOrder[]>
    );

    const getTerminalOrders = makeGetTerminalOrders({
      id: mockId,
      authToken: mockAuthToken,
      service: mockServiceInstance,
      apiOrigin: mockApiOrigin
    });
    await getTerminalOrders({ params: mockParams, onSuccess, onError, final });

    expect(onSuccess).toHaveBeenCalledWith({
      terminalOrders: expect.arrayContaining([
        expect.any(TerminalOrder),
        expect.any(TerminalOrder),
      ]),
      pagingInfo: mockResponse.page_info,
    });
    expect(onError).not.toHaveBeenCalled();
  });

  it('should call onError with an error message on API failure', async () => {
    const mockError = new Error('Error fetching terminals');
    const onSuccess = jest.fn();
    const onError = jest.fn();

    // Mock fetchTerminalOrders to reject with mockError
    mockServiceInstance.fetchTerminalOrders.mockRejectedValue(mockError);

    const getTerminalOrders = makeGetTerminalOrders({
      id: mockId,
      authToken: mockAuthToken,
      service: mockServiceInstance,
      apiOrigin: mockApiOrigin
    });
    await getTerminalOrders({ params: mockParams, onSuccess, onError, final });

    expect(onError).toHaveBeenCalledWith({
      code: 'fetch-error',
      error: 'Error fetching terminals',
      severity: 'error',
    });
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('should call onError with an exception message on fetch exception', async () => {
    const mockError = new Error('Network error');
    const onSuccess = jest.fn();
    const onError = jest.fn();

    // Mock fetchTerminalOrders to reject with mockError
    mockServiceInstance.fetchTerminalOrders.mockRejectedValue(mockError);

    const getTerminalOrders = makeGetTerminalOrders({
      id: mockId,
      authToken: mockAuthToken,
      service: mockServiceInstance,
      apiOrigin: mockApiOrigin
    });
    await getTerminalOrders({ params: mockParams, onSuccess, onError, final });

    expect(onError).toHaveBeenCalledWith({
      code: 'fetch-error',
      error: 'Network error',
      severity: 'error',
    });
    expect(onSuccess).not.toHaveBeenCalled();
  });

  // Add more tests as needed for edge cases and different scenarios
});
