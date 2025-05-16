import { Api, IApiResponse, IRefund, RefundPayload } from '..';

const api = Api();

export interface IRefundService {
  postRefund(
    paymentId: string,
    accountId: string,
    authToken: string,
    refundBody: RefundPayload
  ): Promise<IApiResponse<IRefund>>;
};

export class RefundService implements IRefundService {
  async postRefund(
    paymentId: string,
    accountId: string,
    authToken: string,
    refundBody: RefundPayload
  ): Promise<IApiResponse<IRefund>> {
    const endpoint = `payments/${paymentId}/refunds`;
    const headers = { 'Sub-Account': accountId };
    const body = refundBody;
    return api.post({ endpoint, headers, body, authToken });
  }
}
