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
    apiOrigin?: string
  ): Promise<IApiResponseCollection<ISubAccount[]>> {
    if (!apiOrigin) {
      apiOrigin = PROXY_API_ORIGIN;
    }

    const headers = { Account: accountId };

    const api = Api({ authToken, apiOrigin: apiOrigin });
    const endpoint = 'sub_accounts';
    return api.get(endpoint, params, null, headers);
  }
}
