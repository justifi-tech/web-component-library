import { IApiResponse, IApiResponseCollection, ITerminal } from '..';
import Api from '../ApiNew';

const api = Api();

export interface ITerminalService {
  fetchTerminals(
    accountId: string,
    authToken: string,
    params: any
  ): Promise<IApiResponseCollection<ITerminal[]>>;
  fetchTerminal(
    terminalId: string,
    authToken: string
  ): Promise<IApiResponse<ITerminal>>;
  fetchTerminalModels(
    accountId: string,
    authToken: string,
    params: any
  ): Promise<IApiResponseCollection<ITerminal>>;
  orderTerminals(
    authToken: string,
    terminalOrder: any
  ): Promise<IApiResponse<ITerminal>>;
}

export class TerminalService implements ITerminalService {
  async fetchTerminals(
    accountId: string,
    authToken: string,
    params: any
  ): Promise<IApiResponseCollection<ITerminal[]>> {
    const endpoint = 'terminals';
    const headers = { Account: accountId };
    return api.get({ endpoint, params, headers, authToken });
  }

  async fetchTerminal(
    terminalId: string,
    authToken: string
  ): Promise<IApiResponse<ITerminal>> {
    const endpoint = `terminals/${terminalId}`;
    return api.get({ endpoint, authToken });
  }

  async fetchTerminalModels(
    accountId: string,
    authToken: string
  ): Promise<IApiResponseCollection<ITerminal>> {
    const endpoint = 'terminals/order_models';
    const headers = { 'sub-account': accountId };
    return api.get({ endpoint, headers, authToken });
  }

  async orderTerminals(
    authToken: string,
    terminalOrder: any
  ): Promise<IApiResponse<ITerminal>> {
    const endpoint = 'terminals/orders';
    const body = terminalOrder;
    const headers = { 'sub-account': terminalOrder.sub_account_id };
    return api.post({ endpoint, body, headers, authToken });
  }
}
