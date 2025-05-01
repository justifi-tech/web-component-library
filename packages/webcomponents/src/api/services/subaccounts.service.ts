import { ISubAccount } from '..';
import Api, { IApiResponseCollection } from '../ApiNew';


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
    const headers = { Account: accountId };

    const api = Api(authToken);
    const endpoint = 'sub_accounts';
    return api.get({ endpoint, params, headers });
  }
}
