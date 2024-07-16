import { ComponentErrorSeverity } from "../../../api/ComponentError";
import { getErrorCode, getErrorMessage } from "../../../api/services/utils";

export const makeGetBusiness = ({ authToken, businessId, service }) =>
  async ({ onSuccess, onError }) => {
    try {
      const response = await service.fetchBusiness(businessId, authToken);

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
    }
  };
  