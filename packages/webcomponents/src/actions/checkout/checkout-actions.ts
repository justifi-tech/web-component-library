import { ComponentErrorSeverity } from '../../api/ComponentError';
import { getErrorCode, getErrorMessage } from '../../api/services/utils';

export const makeGetCheckout =
  ({ authToken, checkoutId, service }) =>
  async ({ onSuccess, onError }) => {
    try {
      console.debug('[CheckoutActions] fetchCheckout request', {
        hasAuthToken: !!authToken,
        checkoutId,
      });
      const response = await service.fetchCheckout(authToken, checkoutId);
      console.debug('[CheckoutActions] fetchCheckout response', {
        hasError: !!response?.error,
      });
      if (!response.error) {
        const checkout = response.data;
        console.debug('[CheckoutActions] fetchCheckout success', {
          status: checkout?.status,
        });
        onSuccess({ checkout });
      } else {
        const responseError = getErrorMessage(response.error);
        const code = getErrorCode(response.error?.code);
        console.debug('[CheckoutActions] fetchCheckout error', {
          code,
          responseError,
        });
        return onError({
          error: responseError,
          code,
          severity: ComponentErrorSeverity.ERROR,
        });
      }
    } catch (error) {
      const code = getErrorCode(error?.code);
      console.debug('[CheckoutActions] fetchCheckout exception', {
        code,
        message: error?.message || String(error),
      });
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
      console.debug('[CheckoutActions] complete request', {
        hasAuthToken: !!authToken,
        checkoutId,
        payment_mode: payment?.payment_mode,
        hasToken: !!payment?.payment_token,
      });
      const response = await service.complete(authToken, checkoutId, payment);
      console.debug('[CheckoutActions] complete response', {
        hasError: !!response?.error,
      });
      if (!response.error) {
        const checkout = response.data;
        console.debug('[CheckoutActions] complete success', {
          status: checkout?.status,
        });
        onSuccess({ checkout });
      } else {
        const responseError = getErrorMessage(response.error);
        const code = getErrorCode(response.error?.code);
        console.debug('[CheckoutActions] complete error', {
          code,
          responseError,
        });
        return onError({
          error: responseError,
          code,
          severity: ComponentErrorSeverity.ERROR,
        });
      }
    } catch (error) {
      const code = getErrorCode(error?.code);
      console.debug('[CheckoutActions] complete exception', {
        code,
        message: error?.message || String(error),
      });
      return onError({
        error: error.message || error,
        code,
        severity: ComponentErrorSeverity.ERROR,
      });
    }
  };
