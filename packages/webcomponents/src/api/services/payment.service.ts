import { Api, IApiResponseCollection, IApiResponse, IPayment } from '..';
import { config } from '../../../config';

export interface IPaymentService {
  fetchPayments(
    accountId: string,
    authToken: string,
    params: any,
    apiOrigin?: string
  ): Promise<IApiResponseCollection<IPayment[]>>;
  fetchPayment(
    paymentId: string,
    authToken: string
  ): Promise<IApiResponse<IPayment>>;
}

export class PaymentService implements IPaymentService {
  async fetchPayments(
    accountId: string,
    authToken: string,
    params: any,
    apiOrigin?: string
  ): Promise<IApiResponseCollection<IPayment[]>> {
    
    if (!apiOrigin) {
      apiOrigin = config.proxyApiOrigin;
    }

    const api = Api({ authToken, apiOrigin: apiOrigin });
    const endpoint = `account/${accountId}/payments`;
    return api.get(endpoint, params);
  }

  async fetchPayment(
    paymentId: string,
    authToken: string
  ): Promise<IApiResponse<IPayment>> {
    const endpoint = `payments/${paymentId}`;
    return Api({ authToken, apiOrigin: config.proxyApiOrigin }).get(endpoint);
  }
}
