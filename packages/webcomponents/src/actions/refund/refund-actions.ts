import { IApiResponse, IRefund, IRefundPayload, isErrorObject } from '../../api';
import { ComponentErrorCodes, ComponentErrorSeverity } from '../../api/ComponentError';
import { RefundService } from '../../api/services/refund.service';
import { getErrorCode, getErrorMessage } from '../../api/services/utils';

interface requestProps {
  authToken: string;
  accountId: string;
  paymentId: string;
  service: RefundService;
  apiOrigin?: string;
}

interface usageProps {
  body: IRefundPayload;
  onError: (error: any) => void;
  onComplete: (response: IApiResponse<IRefund>) => void;
}

export const makePostRefund = (requestProps: requestProps) => {
  
  const { authToken, accountId, paymentId, service, apiOrigin } = requestProps;
  
  return async (usageProps: usageProps) => {
    
    const { body, onError, onComplete } = usageProps;
    
    let response: IApiResponse<IRefund>;
  
    try {
      response = await service.postRefund(paymentId, accountId, authToken, body, apiOrigin);

      if (response.error) {
        const err = response.error;
        let errorMessage: string;
        let code: string;
        const errorObject = isErrorObject(err);

        if (errorObject) {
          errorMessage = getErrorMessage(err);
          code = getErrorCode(err.code);
        } else {
          errorMessage = err;
          code = ComponentErrorCodes.POST_ERROR;
        }

        return onError({
          error: errorMessage,
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
        return onComplete(response);
    }
  };
};
