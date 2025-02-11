import { Api, IApiResponseCollection, ISubAccount } from '..';

export interface ISubAccountService {
  fetchSubAccounts(
    accountId: string,
    authToken: string,
    params: any,
    apiOrigin?: string
  ): Promise<IApiResponseCollection<ISubAccount[]>>;
}

export class SubAccountService implements ISubAccountService {
  async fetchSubAccounts(
    accountId: string,
    authToken: string,
    params: any,
    apiOrigin: string = PROXY_API_ORIGIN
  ): Promise<IApiResponseCollection<ISubAccount[]>> {
    const headers = { Account: accountId };

    const api = Api({ authToken, apiOrigin: apiOrigin });
    const endpoint = 'sub_accounts';
    return api.get(endpoint, params, null, headers);
  }
}
