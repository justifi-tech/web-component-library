import { ComponentErrorSeverity } from '../../api/ComponentError';
import { getErrorCode, getErrorMessage } from '../../api/services/utils';

export const makeGetGrossPaymentChartData =
  ({ id, authToken, service }) =>
  async ({ onSuccess, onError }) => {
    try {
      const response = await service.fetchGrossVolumeChartData(id, authToken);

      if (!response.error) {
        onSuccess(response.data);
      } else {
        const errorMessage = getErrorMessage(response.error);
        const code = getErrorCode(response.error?.code);
        onError({
          error: errorMessage,
          code,
          severity: ComponentErrorSeverity.ERROR,
        });
      }
    } catch (error) {
      const code = getErrorCode(error?.code);
      const errorMessage = getErrorMessage(error);
      onError({
        error: errorMessage,
        code,
        severity: ComponentErrorSeverity.ERROR,
      });
    }
  };
