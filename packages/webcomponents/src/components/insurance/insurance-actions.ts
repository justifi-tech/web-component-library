import { InsuranceService } from '../../api/services/insurance.service';
import { getErrorMessage } from '../../api/services/utils';

export const makeGetQuote = ({ authToken, payload, service }) =>
  async ({ onSuccess, onError }) => {
    try {
      const response = await (service as InsuranceService).fetchQuote(authToken, payload);

      if (!response.error) {
        const quote = response.data;
        onSuccess({ quote });
      } else {
        const responseError = getErrorMessage(response.error);
        return onError(responseError);
      }
    } catch (error) {
      return onError(error.message || error);
    }
  };
