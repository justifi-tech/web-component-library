import { Terminal } from '../../api';
import { ComponentErrorSeverity } from '../../api/ComponentError';
import { getErrorCode, getErrorMessage } from '../../api/services/utils';

export const makeGetTerminalDetails =
  ({ id, authToken, service }) =>
  async ({ onSuccess, onError }) => {
    try {
      const response = await service.fetchTerminal(id, authToken);
      if (!response.error) {
        onSuccess({ terminal: new Terminal(response.data) });
      } else {
        const responseError = getErrorMessage(response.error);
        const code = getErrorCode(response.error?.code);
        onError({
          error: responseError,
          code,
          severity: ComponentErrorSeverity.ERROR,
        });
      }
    } catch (error) {
      const code = getErrorCode(error?.code);
      onError({
        error: getErrorMessage(error),
        code,
        severity: ComponentErrorSeverity.ERROR,
      });
    }
  };
  