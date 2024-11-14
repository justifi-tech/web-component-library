import { Api, IApiResponseCollection, ITerminal } from '..';
import { config } from '../../../config';

export interface ITerminalService {
  fetchTerminals(
    accountId: string,
    authToken: string,
    params: any,
    apiOrigin?: string
  ): Promise<IApiResponseCollection<ITerminal[]>>;
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
}
