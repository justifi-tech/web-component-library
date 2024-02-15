import { Payment } from '../../api';
import { getErrorMessage } from '../../api/services/utils';

export const makeGetPaymentDetails =
  ({ id, authToken, service }) =>
  async ({ onSuccess, onError }) => {
    try {
      const response = await service.fetchPayment(id, authToken);
      if (!response.error) {
        onSuccess({ payment: new Payment(response.data) });
      } else {
        const responseError = getErrorMessage(response.error);
        onError(`Error trying to fetch data : ${responseError}`);
      }
    } catch (error) {
      onError(`Error trying to fetch data : ${error}`);
    }
  };
