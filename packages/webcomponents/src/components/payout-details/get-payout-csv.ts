import { ComponentErrorSeverity } from '../../api/ComponentError';
import { getErrorCode, getErrorMessage } from '../../api/services/utils';

export const makeGetPayoutCSV =
  ({ authToken, service }) =>
  async ({ payoutId, onError }) => {
    try {
      const { data } = await service.fetchCSV(payoutId, authToken);
      const a = document.createElement('a');
      a.href = data.csv_url;
      a.click();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      const code = getErrorCode(error?.code);
      onError({
        error: errorMessage,
        code,
        severity: ComponentErrorSeverity.ERROR,
      });
    }
  };
