import { ComponentErrorSeverity } from '../../api/ComponentError';
import { getErrorCode, getErrorMessage } from '../../api/services/utils';

export const makePostRefund =
  ({ authToken, accountId, paymentId, service, apiOrigin }) =>
    async ({ refundBody, onSuccess, onError, final }) => {
    try {
      const response = await service.postRefund(paymentId, accountId, authToken, refundBody, apiOrigin);

      if (!response.error) {
        onSuccess(response);
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
