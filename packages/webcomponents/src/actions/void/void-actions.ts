import { ComponentErrorSeverity } from '@justifi/types';
import { getErrorCode, getErrorMessage } from '../../api/services/utils';

export const makePostVoid =
  ({ authToken, accountId, paymentId, service }) =>
    async ({ onSuccess, onError, final }) => {
    try {
      const response = await service.postVoid(paymentId, accountId, authToken);

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

