import { ComponentErrorSeverity, TerminalModel } from '../../api';
import { getErrorCode, getErrorMessage } from '../../api/services/utils';

export const makeGetTerminalModels =
  ({ id, authToken, service, apiOrigin }) =>
  async ({ onSuccess, onError }) => {
    try {
      const response = await service.fetchTerminalModels(
        id,
        authToken,
        apiOrigin
      );

      if (!response.error) {
        const terminals =
          response.data?.terminal_order_models?.map(
            (dataItem) => new TerminalModel(dataItem)
          ) || [];

        const orderLimit = response.data?.order_limit;

        onSuccess({ terminals, orderLimit });
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
