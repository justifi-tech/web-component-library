import { Api, IApiResponse } from '..';

const api = Api();

export interface ILinkTokenResponse {
  link_token: string;
}

export interface IPlaidService {
  getLinkToken(
    authToken: string,
    accountId: string,
    checkoutId: string
  ): Promise<IApiResponse<ILinkTokenResponse>>;

  tokenizeBankAccount(
    authToken: string,
    accountId: string,
    publicToken: string
  ): Promise<IApiResponse<any>>;
}

export class PlaidService implements IPlaidService {
  async getLinkToken(
    authToken: string,
    accountId: string,
    checkoutId: string
  ): Promise<IApiResponse<ILinkTokenResponse>> {
    const endpoint = `plaid/${accountId}/link`;
    const body = { checkout_id: checkoutId };
    return api.post({ endpoint, body, authToken });
  }

  async tokenizeBankAccount(
    authToken: string,
    accountId: string,
    publicToken: string
  ): Promise<IApiResponse<any>> {
    const endpoint = `plaid/${accountId}/tokenize`;
    const body = { public_token: publicToken };
    return api.post({ endpoint, body, authToken });
  }
}
