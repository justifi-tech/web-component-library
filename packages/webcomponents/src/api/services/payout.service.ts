import { Api, IApiResponse, IApiResponseCollection, IPayout } from '..';

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
  fetchCSV(payoutId: string, authToken: string): Promise<IApiResponse<any>>;
}

export class PayoutService implements IPayoutService {
  async fetchPayouts(
    accountId: string,
    authToken: string,
    params: any,
    apiOrigin?: string
  ): Promise<IApiResponseCollection<IPayout[]>> {
    if (!apiOrigin) {
      apiOrigin = PROXY_API_ORIGIN;
    }

    const api = Api({ authToken, apiOrigin });
    const endpoint = `account/${accountId}/payouts`;
    return api.get(endpoint, params);
  }

  async fetchPayout(
    payoutId: string,
    authToken: string,
    apiOrigin?: string
  ): Promise<IApiResponse<IPayout>> {
    if (!apiOrigin) {
      apiOrigin = PROXY_API_ORIGIN;
    }

    const api = Api({ authToken, apiOrigin });
    const endpoint = `payouts/${payoutId}`;
    return api.get(endpoint);
  }

  async fetchCSV(
    payoutId: string,
    authToken: string,
    apiOrigin?: string
  ): Promise<IApiResponse<any>> {
    if (!apiOrigin) {
      apiOrigin = PROXY_API_ORIGIN;
    }

    const api = Api({ authToken, apiOrigin });
    const endpoint = `reports/payouts/${payoutId}`;
    return api.get(endpoint);
  }
}
