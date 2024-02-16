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
        const errorMessage = `Error fetching payout details: ${responseError}`;
        onError(errorMessage);
      }
    } catch (error) {
      const errorMessage = `Error fetching payout details: ${error}`;
      onError(errorMessage);
    }
  };
