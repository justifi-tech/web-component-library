import { Api, IApiResponseCollection, ISubAccount } from '..';
import { config } from '../../../config';

export interface ISubAccountService {
  fetchSubAccounts(
    authToken: string,
    params: any,
  ): Promise<IApiResponseCollection<ISubAccount[]>>;
}

export class SubAccountService implements ISubAccountService {
  async fetchSubAccounts(
    authToken: string,
    params: any,
  ): Promise<IApiResponseCollection<ISubAccount[]>> {
    const api = Api({ authToken, apiOrigin: config.proxyApiOrigin });
    const endpoint = 'subaccounts';
    return api.get(endpoint, params);
  }
}
