import { Payment } from '../../api';

export const makeGetPaymentDetails =
  ({ id, authToken, service }) =>
  async ({ onSuccess, onError }) => {
    try {
      const response = await service.fetchPayment(id, authToken);
      if (!response.error) {
        onSuccess({ payment: new Payment(response.data) });
      } else {
        const responseError =
          typeof response.error === 'string'
            ? response.error
            : response.error.message;
        onError(`Error trying to fetch data : ${responseError}`);
      }
    } catch (error) {
      onError(`Error trying to fetch data : ${error}`);
    }
  };
