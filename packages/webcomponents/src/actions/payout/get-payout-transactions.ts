import { PayoutBalanceTransaction } from '../../api';
import { ComponentErrorSeverity } from '../../api/ComponentError';
import { getErrorCode, getErrorMessage } from '../../api/services/utils';

export const makeGetPayoutTransactions =
  ({ authToken, service, apiOrigin }) =>
  async ({ params, onSuccess, onError, final }) => {
    try {
      const response = await service.fetchPayoutTransactions(authToken, params, apiOrigin);
      if (!response.error) {
        const balanceTransactions = response.data.map(
          (dataItem) => new PayoutBalanceTransaction(dataItem)
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