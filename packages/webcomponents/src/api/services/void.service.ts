import { Api, IApiResponse, IPayment } from '..';

const api = Api();

export interface IVoidService {
  postVoid(
    paymentId: string,
    accountId: string,
    authToken: string
  ): Promise<IApiResponse<IPayment>>;
}

export class VoidService implements IVoidService {
  async postVoid(
    paymentId: string,
    accountId: string,
    authToken: string
  ): Promise<IApiResponse<IPayment>> {
    const endpoint = `payments/${paymentId}/void`;
    const headers = { 'Sub-Account': accountId };
    return api.post({ endpoint, headers, authToken });
  }
}

