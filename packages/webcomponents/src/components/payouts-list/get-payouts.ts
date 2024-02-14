import { Payout } from '../../api';

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
