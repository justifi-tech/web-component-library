import { Api, IApiResponse, IRefund, IRefundPayload } from '..';

export interface IRefundService {
  postRefund(
    paymentId: string,
    accountId: string,
    authToken: string,
    body: IRefundPayload,
    apiOrigin?: string
  ): Promise<IApiResponse<IRefund>>;
};

export class RefundService implements IRefundService {
  async postRefund(
    paymentId: string,
    accountId: string,
    authToken: string,
    body: IRefundPayload,
    apiOrigin: string = PROXY_API_ORIGIN
  ): Promise<IApiResponse<IRefund>> {
    const api = Api({ authToken, apiOrigin });
    const endpoint = `payments/${paymentId}/refunds`;
    const headers = { 'Sub-Account': accountId };
    return api.post({ endpoint, headers, body });
  }
}
