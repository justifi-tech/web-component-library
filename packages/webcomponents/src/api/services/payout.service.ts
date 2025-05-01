import { IPayout, IPayoutBalanceTransaction } from '..';
import Api, { IApiResponse, IApiResponseCollection } from '../ApiNew';

export interface IPayoutService {
  fetchPayouts(
    accountId: string,
    authToken: string,
    params: any
  ): Promise<IApiResponseCollection<IPayout[]>>;
  fetchPayout(
    payoutId: string,
    authToken: string
  ): Promise<IApiResponse<IPayout>>;
  fetchCSV(
    payoutId: string,
    authToken: string
  ): Promise<IApiResponse<any>>;
  fetchPayoutTransactions(
    accountId: string,
    authToken: string,
    params: any,
  ): Promise<IApiResponseCollection<IPayoutBalanceTransaction[]>>;
}

export class PayoutService implements IPayoutService {
  async fetchPayouts(
    accountId: string,
    authToken: string,
    params: any
  ): Promise<IApiResponseCollection<IPayout[]>> {
    const api = Api(authToken);
    const endpoint = `account/${accountId}/payouts`;
    return api.get({ endpoint, params });
  }

  async fetchPayout(
    payoutId: string,
    authToken: string,
  ): Promise<IApiResponse<IPayout>> {
    const api = Api(authToken);
    const endpoint = `payouts/${payoutId}`;
    return api.get({ endpoint });
  }

  async fetchCSV(
    payoutId: string,
    authToken: string,
  ): Promise<IApiResponse<any>> {
    const api = Api(authToken);
    const endpoint = `reports/payouts/${payoutId}`;
    return api.get({ endpoint });
  }

  async fetchPayoutTransactions(
    accountId: string,
    authToken: string,
    params: any,
  ): Promise<IApiResponseCollection<IPayoutBalanceTransaction[]>> {
    const api = Api(authToken);
    const endpoint = `balance_transactions`;
    const headers = { 'sub-account': accountId };
    return api.get({ endpoint, params, headers });
  }
}
