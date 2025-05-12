import { Payment } from '../../api';
import { ComponentErrorSeverity } from '../../api/ComponentError';
import { getErrorCode, getErrorMessage } from '../../api/services/utils';

export const makeGetPayments =
  ({ id, authToken, service }) =>
  async ({ params, onSuccess, onError, final }) => {
    try {
      const response = await service.fetchPayments(id, authToken, params);

      if (!response.error) {
        const pagingInfo = {
          ...response.page_info,
        };

        const payments: Payment[] =
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
    } finally {
      return final();
    }
  };
