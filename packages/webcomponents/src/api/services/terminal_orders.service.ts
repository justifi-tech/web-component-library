import { Api, IApiResponseCollection, ITerminalOrder } from '..';

export interface ITerminalOrderService {
  fetchTerminalOrders(
    accountId: string,
    authToken: string,
    params: any,
    apiOrigin?: string
  ): Promise<IApiResponseCollection<ITerminalOrder[]>>;
}

export class TerminalOrderService implements ITerminalOrderService {
  async fetchTerminalOrders(
    accountId: string,
    authToken: string,
    params: any,
    apiOrigin: string = PROXY_API_ORIGIN
  ): Promise<IApiResponseCollection<ITerminalOrder[]>> {
    const headers = { account: accountId };

    const api = Api({ authToken, apiOrigin });
    const endpoint = 'terminals/orders';
    return api.get(endpoint, params, null, headers);
  }
}
