import { Api, IApiResponseCollection, IApiResponse, IPayment, IPaymentBalanceTransaction } from '..';

const api = Api();

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
  fetchPaymentTransactions(
    paymentId: string,
    params: any,
    authToken: string
  ): Promise<IApiResponseCollection<any>>;
}

export class PaymentService implements IPaymentService {
  async fetchPayments(
    accountId: string,
    authToken: string,
    params: any
  ): Promise<IApiResponseCollection<IPayment[]>> {
    const endpoint = `account/${accountId}/payments`;
    return api.get({ endpoint, params, authToken });
  }

  async fetchPayment(
    paymentId: string,
    authToken: string
  ): Promise<IApiResponse<IPayment>> {
    const endpoint = `payments/${paymentId}`;
    return api.get({ endpoint, authToken });
  }

  async fetchPaymentTransactions(
    paymentId: string,
    authToken: string,
    params: any
  ): Promise<IApiResponseCollection<IPaymentBalanceTransaction[]>> {
    const endpoint = `payments/${paymentId}/payment_balance_transactions`;
    return api.get({ endpoint, params, authToken });
  }

}
