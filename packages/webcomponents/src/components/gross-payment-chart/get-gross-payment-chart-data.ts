import { ReportsService } from '../../api/services/reports.service';
import { getErrorMessage } from '../../api/services/utils';

interface MakeGetGrossPaymentChartDataProps {
  id: string;
  authToken: string;
  service: ReportsService;
}

export const makeGetGrossPaymentChartData =
  ({ id, authToken, service }: MakeGetGrossPaymentChartDataProps) =>
  async ({ onSuccess, onError }) => {
    try {
      const response = await service.fetchGrossVolumeChartData(id, authToken);
      if (!response.error) {
        onSuccess(response.data);
      } else {
        onError(getErrorMessage(response.error));
      }
    } catch (error) {
      onError(getErrorMessage(error));
    }
  };
