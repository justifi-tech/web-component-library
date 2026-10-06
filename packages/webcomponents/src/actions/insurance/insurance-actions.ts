import { getErrorCode, getErrorMessage } from '../../api/services/utils';
import { ComponentErrorSeverity } from '../../api/ComponentError';

export const makeGetQuote = ({ authToken, service }) =>
  async ({ payload, onSuccess, onError }) => {
    try {
      const response = await service.fetchQuote(authToken, payload);

      if (!response.error) {
        const quote = response.data;
        onSuccess({ quote });
      } else {
        const responseError = getErrorMessage(response.error);
        const code = getErrorCode(response.error?.code);
        return onError({
          error: responseError,
          code,
          severity: ComponentErrorSeverity.ERROR,
        });
      }
    } catch (error) {
      const code = getErrorCode(error?.code);
      return onError({
        error: error.message || error,
        code,
        severity: ComponentErrorSeverity.ERROR,
      });
    }
  };

export const makeToggleCoverage = ({ authToken, service }) =>
  async ({ quoteId, payload, onSuccess, onError }) => {
    try {
      const response = await service.toggleCoverage(authToken, quoteId, payload);

      if (!response.error) {
        const quote = response.data;
        onSuccess({ quote });
      } else {
        const responseError = getErrorMessage(response.error);
        const code = getErrorCode(response.error?.code);
        return onError({
          error: responseError,
          code,
          severity: ComponentErrorSeverity.ERROR,
        });
      }
    } catch (error) {
      const code = getErrorCode(error?.code);
      return onError({
        error: error.message || error,
        code,
        severity: ComponentErrorSeverity.ERROR,
      });
    }
  };