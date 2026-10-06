import { Api, IApiResponseCollection, ISubAccount } from '..';

const api = Api();

export interface ISubAccountService {
  fetchSubAccounts(
    accountId: string,
    authToken: string,
    params: any
  ): Promise<IApiResponseCollection<ISubAccount[]>>;
}

export class SubAccountService implements ISubAccountService {
  async fetchSubAccounts(
    accountId: string,
    authToken: string,
    params: any
  ): Promise<IApiResponseCollection<ISubAccount[]>> {
    const endpoint = 'sub_accounts';
    const headers = { Account: accountId };
    return api.get({ authToken, endpoint, params, headers });
  }
}
