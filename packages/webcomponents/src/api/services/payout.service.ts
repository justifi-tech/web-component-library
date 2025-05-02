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

const api = Api();

export class PayoutService implements IPayoutService {
  async fetchPayouts(
    accountId: string,
    authToken: string,
    params: any
  ): Promise<IApiResponseCollection<IPayout[]>> {
    const endpoint = `account/${accountId}/payouts`;
    return api.get({ authToken, endpoint, params });
  }

  async fetchPayout(
    payoutId: string,
    authToken: string,
  ): Promise<IApiResponse<IPayout>> {
    const endpoint = `payouts/${payoutId}`;
    return api.get({ authToken, endpoint });
  }

  async fetchCSV(
    payoutId: string,
    authToken: string,
  ): Promise<IApiResponse<any>> {
    const endpoint = `reports/payouts/${payoutId}`;
    return api.get({ authToken, endpoint });
  }

  async fetchPayoutTransactions(
    accountId: string,
    authToken: string,
    params: any,
  ): Promise<IApiResponseCollection<IPayoutBalanceTransaction[]>> {
    const endpoint = `balance_transactions`;
    const headers = { 'sub-account': accountId };
    return api.get({ authToken, endpoint, params, headers });
  }
}
