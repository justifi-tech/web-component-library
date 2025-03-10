import { ComponentErrorSeverity } from '../../api';
import { getErrorCode, getErrorMessage } from '../../api/services/utils';

export const makeOrderTerminals =
  ({ authToken, service }) =>
  async ({ terminalOrder, onSuccess, onError }) => {
    try {
      const response = await service.orderTerminals(authToken, terminalOrder);

      if (!response.error) {
        const { data } = response;
        onSuccess({ data });
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
