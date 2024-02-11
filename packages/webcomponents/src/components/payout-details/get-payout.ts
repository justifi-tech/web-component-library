import { Payout } from '../../api';

export const makeGetPayout =
  ({ id, authToken, service }) =>
  async ({ onSuccess, onError }) => {
    try {
      const response = await service.fetchPayout(id, authToken);

      if (!response.error) {
        const payout = new Payout(response.data);

        onSuccess(payout);
      } else {
        const responseError =
          typeof response.error === 'string'
            ? response.error
            : response.error.message;
        const errorMessage = `Error fetching payout details: ${responseError}`;
        onError(errorMessage);
      }
    } catch (error) {
      const errorMessage = `Error fetching payout details: ${error}`;
      onError(errorMessage);
    }
  };
