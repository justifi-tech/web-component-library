import { Api, IApiResponse, IRefund } from '..';


export interface IRefundService {
  complete(
    paymentId: string,
    authToken: string,
    refundBody: { amount: number; description: string; reason: string; metadata: object }
  ): Promise<IApiResponse<IRefund>>;
};

export class RefundService implements IRefundService {
  async complete(
    paymentId: string,
    authToken: string,
    refundBody: { amount: number; description: string; reason: string; metadata: object }
  ): Promise<IApiResponse<IRefund>> {
    const endpoint = `payments/${paymentId}/refunds`;
    return Api({ authToken, apiOrigin: PROXY_API_ORIGIN }).post(endpoint, refundBody);
  }
}