import { Payment } from '../../api';
import { getErrorMessage } from '../../api/services/utils';

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
        const responseError = getErrorMessage(response.error);
        return onError(responseError);
      }
    } catch (error) {
      return onError(error.message || error);
    }
  };
