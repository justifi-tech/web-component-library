import { ComponentErrorSeverity, Terminal } from '../../api';
import { getErrorCode, getErrorMessage } from '../../api/services/utils';

export const makeGetAvailableToOrderTerminals =
  ({ id, authToken, service }) =>
  async ({ onSuccess, onError }) => {
    try {
      const response = await service.fetchAvailableToOrderTerminals(
        id,
        authToken
      );

      if (!response.error) {
        const terminals =
          response.data?.map((dataItem) => new Terminal(dataItem)) || [];

        onSuccess({ terminals });
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
