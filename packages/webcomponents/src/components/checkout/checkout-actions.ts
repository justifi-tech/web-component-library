import { CheckoutService } from '../../api/services/checkout.service';
import { getErrorMessage } from '../../api/services/utils';

export const makeGetCheckout = ({ authToken, checkoutId, service }) =>
  async ({ onSuccess, onError }) => {
    try {
      const response = await (service as CheckoutService).fetchCheckout(authToken, checkoutId);

      if (!response.error) {
        const checkout = response.data;
        onSuccess({ checkout });
      } else {
        const responseError = getErrorMessage(response.error);
        return onError(responseError);
      }
    } catch (error) {
      return onError(error.message || error);
    }
  };

export const makeCheckoutComplete = ({ authToken, checkoutId, service }) =>
  async ({ payment, onSuccess, onError }) => {
    try {
      const response = await (service as CheckoutService).complete(authToken, checkoutId, payment);

      if (!response.error) {
        const checkout = response.data;
        onSuccess({ checkout });
      } else {
        const responseError = getErrorMessage(response.error);
        return onError(responseError);
      }
    } catch (error) {
      return onError(error.message || error);
    }
  };
