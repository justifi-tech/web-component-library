import { Payment } from '../../api';
import { ComponentErrorSeverity } from '../../api/ComponentError';
import { getErrorCode, getErrorMessage } from '../../api/services/utils';

export const makeGetPaymentDetails =
  ({ id, authToken, service }) =>
  async ({ onSuccess, onError, final }) => {
    try {
      const response = await service.fetchPayment(id, authToken);
      if (!response.error) {
        onSuccess({ payment: new Payment(response.data) });
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
    } finally {
      final();
    }
  };
