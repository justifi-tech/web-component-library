import { Payout } from '../../api';
import { ComponentErrorSeverity } from '../../api/ComponentError';
import { getErrorCode, getErrorMessage } from '../../api/services/utils';

export const makeGetPayoutDetails =
  ({ id, authToken, service, apiOrigin }) =>
  async ({ onSuccess, onError }) => {
    try {
      const response = await service.fetchPayout(id, authToken, apiOrigin);

      if (!response.error) {
        const payout = new Payout(response.data);

        onSuccess(payout);
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
      const errorMessage = getErrorMessage(error);
      const code = getErrorCode(error?.code);
      onError({
        error: errorMessage,
        code,
        severity: ComponentErrorSeverity.ERROR,
      });
    }
  };
