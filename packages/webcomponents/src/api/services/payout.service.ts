import { Api, IApiResponse, IApiResponseCollection, IPayout, IPayoutBalanceTransaction } from '..';

export interface IPayoutService {
  fetchPayouts(
    accountId: string,
    authToken: string,
    params: any,
    apiOrigin?: string
  ): Promise<IApiResponseCollection<IPayout[]>>;
  fetchPayout(
    payoutId: string,
    authToken: string,
    apiOrigin?: string
  ): Promise<IApiResponse<IPayout>>;
  fetchCSV(
    payoutId: string,
    authToken: string,
    apiOrigin?: string
  ): Promise<IApiResponse<any>>;
  fetchPayoutTransactions(
    authToken: string,
    params: any,
    apiOrigin?: string
  ): Promise<IApiResponseCollection<IPayoutBalanceTransaction[]>>;
}

export class PayoutService implements IPayoutService {
  async fetchPayouts(
    accountId: string,
    authToken: string,
    params: any,
    apiOrigin: string = PROXY_API_ORIGIN
  ): Promise<IApiResponseCollection<IPayout[]>> {
    const api = Api({ authToken, apiOrigin });
    const endpoint = `account/${accountId}/payouts`;
    return api.get({ endpoint, params });
  }

  async fetchPayout(
    payoutId: string,
    authToken: string,
    apiOrigin: string = PROXY_API_ORIGIN
  ): Promise<IApiResponse<IPayout>> {
    const api = Api({ authToken, apiOrigin });
    const endpoint = `payouts/${payoutId}`;
    return api.get({ endpoint });
  }

  async fetchCSV(
    payoutId: string,
    authToken: string,
    apiOrigin: string = PROXY_API_ORIGIN
  ): Promise<IApiResponse<any>> {
    const api = Api({ authToken, apiOrigin });
    const endpoint = `reports/payouts/${payoutId}`;
    return api.get({ endpoint });
  }

  async fetchPayoutTransactions(
    authToken: string,
    accountId: string,
    params: any,
    apiOrigin: string = PROXY_API_ORIGIN
  ): Promise<IApiResponseCollection<IPayoutBalanceTransaction[]>> {
    const api = Api({ authToken, apiOrigin });
    const endpoint = `balance_transactions`;
    const headers = { 'sub-account': accountId };
    return api.get({ endpoint, params, headers });
  }
}
