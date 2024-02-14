import { Payment } from '../../api';

export const makeGetPayments =
  ({ id, authToken, service }) =>
  async ({ params, onSuccess, onError }) => {
    try {
      const response = await service.fetchPayments(id, authToken, params);

      if (!response.error) {
        const pagingInfo = {
          ...response.page_info,
        };

        const payments =
          response.data?.map((dataItem) => new Payment(dataItem)) || [];

        onSuccess({ payments, pagingInfo });
      } else {
        const responseError =
          typeof response.error === 'string'
            ? response.error
            : response.error.message;

        return onError(responseError);
      }
    } catch (error) {
      return onError(error.message || error);
    }
  };
