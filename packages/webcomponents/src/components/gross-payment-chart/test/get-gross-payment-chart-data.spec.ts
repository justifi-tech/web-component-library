import { makeGetGrossPaymentChartData } from '../get-gross-payment-chart-data';
import { ReportsService } from '../../../api/services/reports.service';
import { mockGrossVolumeReport } from '../../../api/mockData/mockGrossVolumeReport';

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
    const mockError = 'API error';
    mockFetchGrossVolumeChartData.mockResolvedValue({
      error: mockError,
      data: null,
    });

    const onSuccess = jest.fn();
    const onError = jest.fn();

    const getGrossPaymentChartData = makeGetGrossPaymentChartData({
      id: mockId,
      authToken: mockAuthToken,
      service: mockService,
    });

    await getGrossPaymentChartData({ onSuccess, onError });

    expect(onError).toHaveBeenCalledWith(
      `Error trying to fetch data : ${mockError}`
    );
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
      `Error trying to fetch data : ${mockError}`
    );
    expect(onSuccess).not.toHaveBeenCalled();
  });
});
