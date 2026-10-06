import { makeGetGrossPaymentChartData } from '../../../actions/gross-payment/get-gross-payment-chart-data';
import { ReportsService } from '../../../api/services/reports.service';
import { mockGrossVolumeReport } from '../../../../../../mockData/mockGrossVolumeReport';
import { API_NOT_AUTHENTICATED_ERROR } from '../../../api/shared';

const mockFetchGrossVolumeChartData = jest.fn().mockResolvedValue({
  data: mockGrossVolumeReport,
  error: null,
});

jest.mock('../../../api/services/reports.service', () => ({
  ReportsService: jest.fn().mockImplementation(() => ({
    fetchGrossVolumeChartData: mockFetchGrossVolumeChartData,
  })),
}));

describe('makeGetGrossPaymentChartData', () => {
  const mockId = 'test-id';
  const mockAuthToken = 'test-token';
  let mockService;

  beforeEach(() => {
    jest.clearAllMocks();
    mockService = new ReportsService();
    mockService.fetchGrossVolumeChartData = mockFetchGrossVolumeChartData;
  });

  it('calls onSuccess with data on successful fetch', async () => {
    mockFetchGrossVolumeChartData.mockResolvedValue({
      data: mockGrossVolumeReport,
      error: null,
    });

    const onSuccess = jest.fn();
    const onError = jest.fn();

    const getGrossPaymentChartData = makeGetGrossPaymentChartData({
      id: mockId,
      authToken: mockAuthToken,
      service: mockService,
    });

    await getGrossPaymentChartData({ onSuccess, onError });

    expect(onSuccess).toHaveBeenCalledWith(mockGrossVolumeReport);
    expect(onError).not.toHaveBeenCalled();
  });

  it('calls onError with message on API error', async () => {
    mockFetchGrossVolumeChartData.mockResolvedValue(
      API_NOT_AUTHENTICATED_ERROR
    );

    const onSuccess = jest.fn();
    const onError = jest.fn();

    const getGrossPaymentChartData = makeGetGrossPaymentChartData({
      id: mockId,
      authToken: mockAuthToken,
      service: mockService,
    });

    await getGrossPaymentChartData({ onSuccess, onError });

    expect(onError).toHaveBeenCalledWith({
      code: 'not-authenticated',
      error: 'Not Authenticated',
      severity: 'error',
    });
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('calls onError with message on exception', async () => {
    const mockError = new Error('Network error');
    mockFetchGrossVolumeChartData.mockRejectedValue(mockError);

    const onSuccess = jest.fn();
    const onError = jest.fn();

    const getGrossPaymentChartData = makeGetGrossPaymentChartData({
      id: mockId,
      authToken: mockAuthToken,
      service: mockService,
    });

    await getGrossPaymentChartData({ onSuccess, onError });

    expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({ error: 'Network error' })
    );
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('calls onError with message on error returned', async () => {
    mockFetchGrossVolumeChartData.mockResolvedValue(
      API_NOT_AUTHENTICATED_ERROR
    );

    const onSuccess = jest.fn();
    const onError = jest.fn();

    const getGrossPaymentChartData = makeGetGrossPaymentChartData({
      id: mockId,
      authToken: mockAuthToken,
      service: mockService,
    });

    await getGrossPaymentChartData({ onSuccess, onError });

    expect(onError).toHaveBeenCalledWith({
      code: 'not-authenticated',
      error: 'Not Authenticated',
      severity: 'error',
    });
    expect(onSuccess).not.toHaveBeenCalled();
  });
});
