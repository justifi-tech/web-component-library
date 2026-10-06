import { PaymentBalanceTransaction } from '../../api';
import { ComponentErrorSeverity } from '../../api/ComponentError';
import { getErrorCode, getErrorMessage } from '../../api/services/utils';

export const makeGetPaymentTransactions =
  ({ id, authToken, service }) =>
  async ({ params, onSuccess, onError, final }) => {
    try {
      const response = await service.fetchPaymentTransactions(id, authToken, params);
      if (!response.error) {
        const balanceTransactions = response.data.map(
          (dataItem) => new PaymentBalanceTransaction(dataItem)
        );

        const pagingInfo = { ...response.page_info };

        onSuccess({ balanceTransactions, pagingInfo });
      } else {
        const responseError = getErrorMessage(response.error);
        const code = getErrorCode(response.error?.code);
        onError({
          error: responseError,
          code,
          severity: ComponentErrorSeverity.ERROR,
        });
      }
    } catch (error) {
      const code = getErrorCode(error?.code);
      onError({
        error: getErrorMessage(error),
        code,
        severity: ComponentErrorSeverity.ERROR,
      });
    } finally {
      final();
    }
  };
