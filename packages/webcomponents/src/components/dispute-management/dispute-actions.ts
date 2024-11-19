import { Dispute } from '../../api/Dispute';
import { ComponentErrorSeverity } from '../../api/ComponentError';
import { getErrorCode, getErrorMessage } from '../../api/services/utils';

export const makeGetDispute =
  ({ id, authToken, service, apiOrigin }) =>
    async ({ params, onSuccess, onError }) => {
      try {
        const response = await service.fetchDispute(id, authToken, params, apiOrigin);

        if (!response.error) {
          const pagingInfo = {
            ...response.page_info,
          };

          const dispute = new Dispute(response.data);

          onSuccess({ dispute, pagingInfo });
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
