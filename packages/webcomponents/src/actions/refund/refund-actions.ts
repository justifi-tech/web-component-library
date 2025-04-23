import { IApiResponse, IRefund, IRefundPayload } from '../../api';
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
  final: (response: IApiResponse<IRefund>) => void;
}

export const makePostRefund = (props: requestProps) => {
  const { authToken, accountId, paymentId, service, apiOrigin } = props;
    return async (props: usageProps) => {
    const { body, onError, final } = props;
    
      let response: IApiResponse<IRefund>;
    
      try {
        response = await service.postRefund(paymentId, accountId, authToken, body, apiOrigin);

      if (response.error) {
        const err = response.error;
        let errorMessage: string;
        let code: string;

        if (typeof err === 'string') {
          errorMessage = err;
          code = ComponentErrorCodes.POST_ERROR;
        } else {
          errorMessage = getErrorMessage(err);
          code = getErrorCode(err.code);
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
      final(response);
    }
  };
};
