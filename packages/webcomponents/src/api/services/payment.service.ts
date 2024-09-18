import { Api, IApiResponseCollection, IApiResponse, IPayment } from '..';

export interface IPaymentService {
  fetchPayments(
    accountId: string,
    authToken: string,
    params: any
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
    params: any
  ): Promise<IApiResponseCollection<IPayment[]>> {
    const api = Api({ authToken, apiOrigin: PROXY_API_ORIGIN });
    const endpoint = `account/${accountId}/payments`;
    return api.get(endpoint, params);
  }

  async fetchPayment(
    paymentId: string,
    authToken: string
  ): Promise<IApiResponse<IPayment>> {
    const endpoint = `payments/${paymentId}`;
    return Api({ authToken, apiOrigin: PROXY_API_ORIGIN }).get(endpoint);
  }
}
