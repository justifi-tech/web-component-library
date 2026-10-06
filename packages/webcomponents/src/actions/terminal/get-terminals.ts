import { Terminal } from '../../api';
import { ComponentErrorSeverity } from '../../api/ComponentError';
import { getErrorCode, getErrorMessage } from '../../api/services/utils';

export const makeGetTerminals =
  ({ id, authToken, service }) =>
  async ({ params, onSuccess, onError }) => {
    try {
      const response = await service.fetchTerminals(id, authToken, params);

      if (!response.error) {
        const pagingInfo = {
          ...response.page_info,
        };

        const terminals =
          response.data?.map((dataItem) => new Terminal(dataItem)) || [];

        onSuccess({ terminals, pagingInfo });
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
  