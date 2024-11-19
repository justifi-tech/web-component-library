import { Api, IApiResponseCollection, ISubAccount } from '..';
import { config } from '../../../config';

export interface ISubAccountService {
  fetchSubAccounts(
    authToken: string,
    params: any,
    apiOrigin?: string
  ): Promise<IApiResponseCollection<ISubAccount[]>>;
}

export class SubAccountService implements ISubAccountService {
  async fetchSubAccounts(
    authToken: string,
    params: any,
    apiOrigin?: string
  ): Promise<IApiResponseCollection<ISubAccount[]>> {

    if (!apiOrigin) {
      apiOrigin = config.proxyApiOrigin;
    }
    
    const api = Api({ authToken, apiOrigin: apiOrigin });
    const endpoint = 'sub_accounts';
    return api.get(endpoint, params);
  }
}
