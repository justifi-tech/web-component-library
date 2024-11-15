import { Payment } from '../../api';
import { ComponentErrorSeverity } from '../../api/ComponentError';
import { getErrorCode, getErrorMessage } from '../../api/services/utils';

export const makeGetPayments =
  ({ id, authToken, service, apiOrigin }) =>
  async ({ params, onSuccess, onError }) => {
    try {
      const response = await service.fetchPayments(id, authToken, params, apiOrigin);

      if (!response.error) {
        const pagingInfo = {
          ...response.page_info,
        };

        const payments =
          response.data?.map((dataItem) => new Payment(dataItem)) || [];

        onSuccess({ payments, pagingInfo });
      } else {
        const responseError = getErrorMessage(response.error);
        const code = getErrorCode(response.error?.code);
        return onError({
          error: responseError,
          code,
          severity: ComponentErrorSeverity.ERROR,
        });
      }
    } catch (error) {
      const code = getErrorCode(error?.code);
      return onError({
        error: error.message || error,
        code,
        severity: ComponentErrorSeverity.ERROR,
      });
    }
  };
