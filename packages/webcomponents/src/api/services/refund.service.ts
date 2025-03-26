import { Api, IApiResponse, IRefund, RefundPayload } from '..';

export interface IRefundService {
  postRefund(
    paymentId: string,
    authToken: string,
    refundBody: RefundPayload
  ): Promise<IApiResponse<IRefund>>;
};

export class RefundService implements IRefundService {
  async postRefund(
    paymentId: string,
    authToken: string,
    refundBody: RefundPayload
  ): Promise<IApiResponse<IRefund>> {
    console.log('paymentId:', paymentId);
    console.log('authToken:', authToken);
    const endpoint = `payments/${paymentId}/refunds`;
    return Api({ authToken, apiOrigin: PROXY_API_ORIGIN }).post(endpoint, refundBody);
  }
}
