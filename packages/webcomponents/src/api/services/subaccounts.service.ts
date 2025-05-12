import { ISubAccount } from '..';
import Api, { IApiResponseCollection } from '../ApiNew';

export interface ISubAccountService {
  fetchSubAccounts(
    accountId: string,
    authToken: string,
    params: any
  ): Promise<IApiResponseCollection<ISubAccount[]>>;
}

const api = Api();

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
