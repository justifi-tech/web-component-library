import { Business } from '../../api/Business';
import { ComponentErrorSeverity } from '../../api/ComponentError';
import { getErrorCode, getErrorMessage } from '../../api/services/utils';

export const makeGetBusiness =
  ({ id, authToken, service, apiOrigin = PROXY_API_ORIGIN }) =>
  async ({ onSuccess, onError }) => {
    try {
      const response = await service.fetchBusiness(id, authToken, apiOrigin);

      if (!response.error) {
        onSuccess({ business: new Business(response.data) });
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
