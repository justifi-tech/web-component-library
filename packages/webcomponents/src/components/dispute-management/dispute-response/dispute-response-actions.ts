import { DisputeResponse } from '../../../api/Dispute';
import { ComponentErrorSeverity } from '../../../api/ComponentError';
import { getErrorCode, getErrorMessage } from '../../../api/services/utils';

export const makeGetDisputeResponse =
  ({ id, authToken, service, apiOrigin }) =>
    async ({ params, onSuccess, onError }) => {
      try {
        const response = await service.fetchDisputeResponse(id, authToken, params, apiOrigin);

        if (!response.error) {
          const pagingInfo = {
            ...response.page_info,
          };

          const disputeResponse: DisputeResponse = response.data;

          onSuccess({ disputeResponse, pagingInfo });
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

export const makeUpdateDisputeResponse = ({ authToken, disputeId, service }) =>
  async ({ payload, onSuccess, onError, final = () => { } }) => {
    try {
      const response = await service.updateDisputeResponse(disputeId, authToken, payload);

      if (!response.error) {
        onSuccess(response);
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
    } finally {
      return final()
    }
  };