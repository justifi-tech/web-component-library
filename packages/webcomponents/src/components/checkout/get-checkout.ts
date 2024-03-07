import { getErrorMessage } from '../../api/services/utils';

export const makeGetCheckout = ({ authToken, checkoutId, service }) =>
  async ({ params, onSuccess, onError }) => {
    try {
      const response = await service.fetchCheckout(authToken, checkoutId, params);

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
