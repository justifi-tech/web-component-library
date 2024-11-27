import { Api, IApiResponse, IApiResponseCollection, ITerminal } from '..';
import { config } from '../../../config';

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
}

export class TerminalService implements ITerminalService {
  async fetchTerminals(
    accountId: string,
    authToken: string,
    params: any,
    apiOrigin?: string
  ): Promise<IApiResponseCollection<ITerminal[]>> {
    
    if (!apiOrigin) {
      apiOrigin = config.proxyApiOrigin;
    }

    const headers = { Account: accountId };

    const api = Api({ authToken, apiOrigin: apiOrigin });
    const endpoint = 'terminals';
    return api.get(endpoint, params, null, headers);
  }

  async fetchTerminal(
    terminalId: string,
    authToken: string,
    apiOrigin?: string
  ): Promise<IApiResponse<ITerminal>> {

    if (!apiOrigin) {
      apiOrigin = config.proxyApiOrigin;
    }

    const endpoint = `terminals/${terminalId}`;
    return Api({ authToken, apiOrigin: apiOrigin }).get(endpoint);
  }
}
