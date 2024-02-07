import { Api, IApiResponseCollection, IPayout } from '../../api';
import { config } from '../../../config';

export interface IPayoutService {
  fetchPayouts(
    accountId: string,
    authToken: string,
    params: any
  ): Promise<IApiResponseCollection<IPayout[]>>;
}

export class PayoutService implements IPayoutService {
  async fetchPayouts(
    accountId: string,
    authToken: string,
    params: any
  ): Promise<IApiResponseCollection<IPayout[]>> {
    const api = Api(authToken, config.proxyApiOrigin);
    const endpoint = `account/${accountId}/payouts`;
    return api.get(endpoint, params);
  }
}
