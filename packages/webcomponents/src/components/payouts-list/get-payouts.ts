import { Payout } from '../../api';
import { getErrorMessage } from '../../api/services/utils';

export const makeGetPayouts =
  ({ id, authToken, service }) =>
  async ({ params, onSuccess, onError }) => {
    try {
      const response = await service.fetchPayouts(id, authToken, params);

      if (!response.error) {
        const pagingInfo = {
          ...response.page_info,
        };

        const payouts =
          response.data?.map((dataItem) => new Payout(dataItem)) || [];

        onSuccess({ payouts, pagingInfo });
      } else {
        const responseError = getErrorMessage(response.error);
        return onError(responseError);
      }
    } catch (error) {
      return onError(error.message || error);
    }
  };
