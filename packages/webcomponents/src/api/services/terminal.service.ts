import { Api, IApiResponse, IApiResponseCollection, ITerminal } from '..';

export interface ITerminalService {
  fetchTerminals(
    accountId: string,
    authToken: string,
    params: any,
    apiOrigin?: string
  ): Promise<IApiResponseCollection<ITerminal[]>>;
  fetchTerminal(
    terminalId: string,
    authToken: string,
    apiOrigin?: string
  ): Promise<IApiResponse<ITerminal>>;
  fetchTerminalModels(
    accountId: string,
    authToken: string,
    params: any,
    apiOrigin?: string
  ): Promise<IApiResponseCollection<ITerminal>>;
  orderTerminals(
    authToken: string,
    terminalOrder: any,
    apiOrigin?: string
  ): Promise<IApiResponse<ITerminal>>;
}

export class TerminalService implements ITerminalService {
  async fetchTerminals(
    accountId: string,
    authToken: string,
    params: any,
    apiOrigin: string = PROXY_API_ORIGIN
  ): Promise<IApiResponseCollection<ITerminal[]>> {
    const headers = { Account: accountId };

    const api = Api({ authToken, apiOrigin });
    const endpoint = 'terminals';
    return api.get({ endpoint, params, headers });
  }

  async fetchTerminal(
    terminalId: string,
    authToken: string,
    apiOrigin: string = PROXY_API_ORIGIN
  ): Promise<IApiResponse<ITerminal>> {
    const endpoint = `terminals/${terminalId}`;
    return Api({ authToken, apiOrigin: apiOrigin }).get({ endpoint });
  }

  async fetchTerminalModels(
    accountId: string,
    authToken: string,
    apiOrigin: string = API_ORIGIN
  ): Promise<IApiResponseCollection<ITerminal>> {
    const headers = { 'sub-account': accountId };

    const api = Api({ authToken, apiOrigin });
    const endpoint = 'terminals/order_models';
    return api.get({ endpoint, headers });
  }

  async orderTerminals(
    authToken: string,
    terminalOrder: any,
    apiOrigin: string = API_ORIGIN
  ): Promise<IApiResponse<ITerminal>> {
    const headers = { 'sub-account': terminalOrder.sub_account_id };
    const api = Api({ authToken, apiOrigin });
    const endpoint = 'terminals/orders';
    return api.post({ endpoint, body: terminalOrder, headers });
  }
}
