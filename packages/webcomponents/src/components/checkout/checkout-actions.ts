import { ComponentErrorSeverity } from '../../api/ComponentError';
import { getErrorCode, getErrorMessage } from '../../api/services/utils';

export const makeGetCheckout =
  ({ authToken, checkoutId, service }) =>
  async ({ onSuccess, onError }) => {
    try {
      const response = await service.fetchCheckout(authToken, checkoutId);

      if (!response.error) {
        const checkout = response.data;
        onSuccess({ checkout });
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

export const makeCheckoutComplete =
  ({ authToken, checkoutId, service }) =>
  async ({ payment, onSuccess, onError }) => {
    try {
      const response = await service.complete(authToken, checkoutId, payment);

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
    }
  };
