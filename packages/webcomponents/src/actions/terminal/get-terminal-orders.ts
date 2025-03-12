import { TerminalOrder } from '../../api';
import { ComponentErrorSeverity } from '../../api/ComponentError';
import { getErrorCode, getErrorMessage } from '../../api/services/utils';

export const makeGetTerminalOrders = 
  ({ id, authToken, service, apiOrigin }) =>
  async ({ params, onSuccess, onError, final }) => {
    try {
      const response = await service.fetchTerminalOrders(id, authToken, params, apiOrigin);

      if (!response.error) {
        const pagingInfo = {
          ...response.page_info,
        };

        const terminalOrders =
          response.data?.map((dataItem) => new TerminalOrder(dataItem)) || [];

        onSuccess({ terminalOrders, pagingInfo });
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
