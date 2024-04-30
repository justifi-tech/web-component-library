import { Payout } from '../../api';
import { ComponentErrorSeverity } from '../../api/ComponentError';
import { getErrorCode, getErrorMessage } from '../../api/services/utils';

export const makeGetPayouts =
  ({ id, authToken, service }) =>
  async ({ params, onSuccess, onError }) => {
    try {
      const response = await service.fetchPayouts(id, authToken, params);

      if (!response.error) {
        const pagingInfo = {
          ...response.page_info,
        };

        const payouts =
          response.data?.map((dataItem) => new Payout(dataItem)) || [];

        onSuccess({ payouts, pagingInfo });
      } else {
        const error = getErrorMessage(response.error);
        const code = getErrorCode(response.error?.code);
        return onError({
          error,
          code,
          severity: ComponentErrorSeverity.ERROR,
        });
      }
    } catch (error) {
      const message = getErrorMessage(error);
      const code = getErrorCode(error?.code);
      return onError({
        error: message,
        code,
        severity: ComponentErrorSeverity.ERROR,
      });
    }
  };
