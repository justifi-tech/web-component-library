import { Payout } from '../../api';
import { getErrorMessage } from '../../api/services/utils';

export const makeGetPayoutDetails =
  ({ id, authToken, service }) =>
  async ({ onSuccess, onError }) => {
    try {
      const response = await service.fetchPayout(id, authToken);

      if (!response.error) {
        const payout = new Payout(response.data);

        onSuccess(payout);
      } else {
        const responseError = getErrorMessage(response.error);
        const errorMessage = responseError;
        onError(getErrorMessage(errorMessage));
      }
    } catch (error) {
      const errorMessage = error;
      onError(getErrorMessage(errorMessage));
    }
  };
