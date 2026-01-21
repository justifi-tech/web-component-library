import { Api, IApiResponse, IApiResponseCollection, ISubAccount } from '..';

const api = Api();

export interface ISubAccountService {
  fetchSubAccounts(
    accountId: string,
    authToken: string,
    params: any
  ): Promise<IApiResponseCollection<ISubAccount[]>>;
  fetchSubAccount(
    accountId: string,
    authToken: string,
    subAccountId: string
  ): Promise<IApiResponse<ISubAccount>>;
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

  async fetchSubAccount(
    accountId: string,
    authToken: string,
    subAccountId: string
  ): Promise<IApiResponse<ISubAccount>> {
    const endpoint = `sub_accounts/${subAccountId}`;
    const headers = { Account: accountId };
    return api.get({ authToken, endpoint, headers });
  }
}
