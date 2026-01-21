import { ComponentErrorSeverity, SubAccount } from '../../api';
import { getErrorCode, getErrorMessage } from '../../api/services/utils';

export const makeGetSubAccount =
  ({ accountId, authToken, service }) =>
  async ({ subAccountId, onSuccess, onError }) => {
    try {
      const response = await service.fetchSubAccount(
        accountId,
        authToken,
        subAccountId
      );

      if (!response.error) {
        const subAccount = new SubAccount(response.data);

        onSuccess({ subAccount });
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
