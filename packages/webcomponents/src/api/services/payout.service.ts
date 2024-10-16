import { Api, IApiResponse, IApiResponseCollection, IPayout } from '..';
import { config } from '../../../config';

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
  fetchCSV(payoutId: string, authToken: string): Promise<IApiResponse<any>>;
}

export class PayoutService implements IPayoutService {
  async fetchPayouts(
    accountId: string,
    authToken: string,
    params: any
  ): Promise<IApiResponseCollection<IPayout[]>> {
    const api = Api({ authToken, apiOrigin: config.proxyApiOrigin });
    const endpoint = `account/${accountId}/payouts`;
    return api.get(endpoint, params);
  }

  async fetchPayout(
    payoutId: string,
    authToken: string
  ): Promise<IApiResponse<IPayout>> {
    const api = Api({ authToken, apiOrigin: config.proxyApiOrigin });
    const endpoint = `payouts/${payoutId}`;
    return api.get(endpoint);
  }

  async fetchCSV(
    payoutId: string,
    authToken: string
  ): Promise<IApiResponse<any>> {
    const api = Api({ authToken, apiOrigin: config.proxyApiOrigin });
    const endpoint = `reports/payouts/${payoutId}`;
    return api.get(endpoint);
  }
}
