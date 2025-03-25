import { Api, IApiResponse, IRefund, RefundPayload } from '..';

export interface IRefundService {
  completeRefund(
    paymentId: string,
    authToken: string,
    refundBody: RefundPayload
  ): Promise<IApiResponse<IRefund>>;
};

export class RefundService implements IRefundService {
  async completeRefund(
    paymentId: string,
    authToken: string,
    refundBody: RefundPayload
  ): Promise<IApiResponse<IRefund>> {
    const endpoint = `payments/${paymentId}/refunds`;
    return Api({ authToken, apiOrigin: PROXY_API_ORIGIN }).post(endpoint, refundBody);
  }
}
