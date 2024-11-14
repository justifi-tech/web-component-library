import { TerminalService } from '../../../api/services/terminal.service';
import { makeGetTerminals } from '../get-terminals';
import mockResponse from '../../../../../../mockData/mockTerminalsListSuccess.json';
import { IApiResponseCollection, ITerminal, Terminal } from '../../../api';

// Mock the TerminalService class
jest.mock('../../../api/services/terminal.service');

describe('makeGetTerminals', () => {
  const mockId = '123';
  const mockAuthToken = 'token';
  const mockParams = { limit: 10, page: 1 };
  const mockApiOrigin = 'http://localhost:3000';

  let mockServiceInstance: jest.Mocked<TerminalService>;

  beforeEach(() => {
    jest.clearAllMocks();

    // Create a new instance of the mocked TerminalService
    mockServiceInstance = new TerminalService() as jest.Mocked<TerminalService>;

    // Explicitly mock fetchTerminals as a jest mock function
    mockServiceInstance.fetchTerminals = jest.fn();
  });

  it('should call onSuccess with terminals and pagingInfo on successful fetch', async () => {
    const onSuccess = jest.fn();
    const onError = jest.fn();

    // Mock fetchTerminals to resolve with mockResponse
    mockServiceInstance.fetchTerminals.mockResolvedValue(
      mockResponse as IApiResponseCollection<ITerminal[]>
    );

    const getTerminals = makeGetTerminals({
      id: mockId,
      authToken: mockAuthToken,
      service: mockServiceInstance,
      apiOrigin: mockApiOrigin
    });
    await getTerminals({ params: mockParams, onSuccess, onError });

    expect(onSuccess).toHaveBeenCalledWith({
      terminals: expect.arrayContaining([
        expect.any(Terminal),
        expect.any(Terminal),
      ]),
      pagingInfo: mockResponse.page_info,
    });
    expect(onError).not.toHaveBeenCalled();
  });

  it('should call onError with an error message on API failure', async () => {
    const mockError = new Error('Error fetching terminals');
    const onSuccess = jest.fn();
    const onError = jest.fn();

    // Mock fetchTerminals to reject with mockError
    mockServiceInstance.fetchTerminals.mockRejectedValue(mockError);

    const getTerminals = makeGetTerminals({
      id: mockId,
      authToken: mockAuthToken,
      service: mockServiceInstance,
      apiOrigin: mockApiOrigin
    });
    await getTerminals({ params: mockParams, onSuccess, onError });

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

    // Mock fetchTerminals to reject with mockError
    mockServiceInstance.fetchTerminals.mockRejectedValue(mockError);

    const getTerminals = makeGetTerminals({
      id: mockId,
      authToken: mockAuthToken,
      service: mockServiceInstance,
      apiOrigin: mockApiOrigin
    });
    await getTerminals({ params: mockParams, onSuccess, onError });

    expect(onError).toHaveBeenCalledWith({
      code: 'fetch-error',
      error: 'Network error',
      severity: 'error',
    });
    expect(onSuccess).not.toHaveBeenCalled();
  });

  // Add more tests as needed for edge cases and different scenarios
});
