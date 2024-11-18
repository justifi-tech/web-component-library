import { SubAccount } from './SubAccount';
import { ComponentErrorSeverity } from './ComponentError';
import { getErrorCode, getErrorMessage } from './services/utils';

export const makeGetSubAccounts =
  ({ authToken, service }) =>
  async ({ params, onSuccess, onError }) => {
    try {
      const response = await service.fetchSubAccounts(authToken, params);

      if (!response.error) {
        const pagingInfo = {
          ...response.page_info,
        };

        const subAccounts =
          response.data?.map((dataItem) => new SubAccount(dataItem)) || [];

        onSuccess({ subAccounts, pagingInfo });
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