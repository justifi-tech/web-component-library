import { Api, IApiResponseCollection, IApiResponse, IPayment } from '..';

export interface IPaymentService {
  fetchPayments(
    accountId: string,
    authToken: string,
    params: any,
    apiOrigin?: string
  ): Promise<IApiResponseCollection<IPayment[]>>;
  fetchPayment(
    paymentId: string,
    authToken: string,
    apiOrigin?: string
  ): Promise<IApiResponse<IPayment>>;
  fetchPaymentTransactions(
    paymentId: string,
    authToken: string,
    params: any,
    apiOrigin?: string
  ): Promise<IApiResponseCollection<any>>;
}

export class PaymentService implements IPaymentService {
  async fetchPayments(
    accountId: string,
    authToken: string,
    params: any,
    apiOrigin: string = PROXY_API_ORIGIN
  ): Promise<IApiResponseCollection<IPayment[]>> {
    const api = Api({ authToken, apiOrigin: apiOrigin });
    const endpoint = `account/${accountId}/payments`;
    return api.get({ endpoint, params });
  }

  async fetchPayment(
    paymentId: string,
    authToken: string,
    apiOrigin: string = PROXY_API_ORIGIN
  ): Promise<IApiResponse<IPayment>> {
    const endpoint = `payments/${paymentId}`;
    return Api({ authToken, apiOrigin }).get({ endpoint });
  }

  async fetchPaymentTransactions(
    paymentId: string,
    authToken: string,
    params: any,
    apiOrigin: string = PROXY_API_ORIGIN
  ): Promise<IApiResponseCollection<any>> {
    const endpoint = `payments/${paymentId}/payment_balance_transactions`;
    return Api({ authToken, apiOrigin }).get({ endpoint, params });
  }

}
