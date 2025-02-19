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
    return api.get(endpoint, params, null, headers);
  }

  async fetchTerminal(
    terminalId: string,
    authToken: string,
    apiOrigin: string = PROXY_API_ORIGIN
  ): Promise<IApiResponse<ITerminal>> {
    const endpoint = `terminals/${terminalId}`;
    return Api({ authToken, apiOrigin: apiOrigin }).get(endpoint);
  }

  async fetchTerminalModels(
    accountId: string,
    authToken: string,
    apiOrigin: string = PROXY_API_ORIGIN
  ): Promise<IApiResponseCollection<ITerminal>> {
    const headers = { Account: accountId };

    const api = Api({ authToken, apiOrigin });
    const endpoint = 'terminals/available-to-order';
    return api.get(endpoint, null, null, headers);
  }
}
