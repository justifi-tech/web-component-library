import { Api, IApiResponseCollection, ITerminalOrder } from '..';

const api = Api();

export interface ITerminalOrderService {
  fetchTerminalOrders(
    accountId: string,
    authToken: string,
    params: any
  ): Promise<IApiResponseCollection<ITerminalOrder[]>>;
}

export class TerminalOrderService implements ITerminalOrderService {
  async fetchTerminalOrders(
    accountId: string,
    authToken: string,
    params: any
  ): Promise<IApiResponseCollection<ITerminalOrder[]>> {
    const endpoint = 'terminals/orders';
    const headers = { account: accountId };
    return api.get({ endpoint, params, headers, authToken });
  }
}
