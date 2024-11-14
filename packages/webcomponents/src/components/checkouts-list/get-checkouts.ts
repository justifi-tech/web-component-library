import { Checkout } from '../../api';
import { ComponentErrorSeverity } from '../../api/ComponentError';
import { getErrorCode, getErrorMessage } from '../../api/services/utils';

export const makeGetCheckoutsList =
  ({ authToken, service, apiOrigin }) =>
    async ({ params, onSuccess, onError }) => {
      try {
        const response = await service.fetchCheckoutsList(authToken, params, apiOrigin);

        if (!response.error) {
          const pagingInfo = {
            ...response.page_info,
          };

          const checkouts =
            response.data?.map((dataItem) => new Checkout(dataItem)) || [];

          onSuccess({ checkouts, pagingInfo });
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
