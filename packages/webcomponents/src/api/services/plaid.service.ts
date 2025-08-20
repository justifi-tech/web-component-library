import { Api, IApiResponse } from '..';

const api = Api();

export interface ILinkTokenResponse {
  link_token: string;
}

export interface IPlaidService {
  getLinkToken(
    authToken: string,
    accountId: string,
    checkoutId: string,
    signal?: AbortSignal
  ): Promise<IApiResponse<ILinkTokenResponse>>;

  tokenizeBankAccount(
    authToken: string,
    accountId: string,
    publicToken: string,
    linkTokenId?: string,
    paymentMethodGroupId?: string,
    signal?: AbortSignal
  ): Promise<IApiResponse<any>>;
}

export class PlaidService implements IPlaidService {
  async getLinkToken(
    authToken: string,
    accountId: string,
    checkoutId: string,
    signal?: AbortSignal
  ): Promise<IApiResponse<ILinkTokenResponse>> {
    const endpoint = `plaid/${accountId}/link`;
    const body = { checkout_id: checkoutId };
    return api.post({ endpoint, body, authToken, signal });
  }

  async tokenizeBankAccount(
    authToken: string,
    accountId: string,
    publicToken: string,
    linkTokenId?: string,
    paymentMethodGroupId?: string,
    signal?: AbortSignal
  ): Promise<IApiResponse<any>> {
    const endpoint = `plaid/${accountId}/tokenize`;
    const body: any = { public_token: publicToken };
    if (linkTokenId) {
      body.link_token_id = linkTokenId;
    }
    if (paymentMethodGroupId) {
      body.payment_method_group_id = paymentMethodGroupId;
    }
    return api.post({ endpoint, body, authToken, signal });
  }
}
