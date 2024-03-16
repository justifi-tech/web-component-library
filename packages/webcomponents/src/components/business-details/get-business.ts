import { Business } from '../../api/Business';
import { getErrorMessage } from '../../api/services/utils';

export const makeGetBusiness =
  ({ id, authToken, service }) =>
  async ({ onSuccess, onError }) => {
    try {
      const response = await service.fetchBusiness(id, authToken);

      if (!response.error) {
        onSuccess({ business: new Business(response.data) });
      } else {
        const responseError = getErrorMessage(response.error);
        return onError({ error: responseError });
      }
    } catch (error) {
      return onError({ error: error.message || error });
    }
  };
