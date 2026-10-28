import { Api, IApiResponse } from '..';
import { IPaypalOrder, PaypalFundingSource } from '../Paypal';

const api = Api();

export interface IPaypalService {
  createPaypalOrder(
    authToken: string,
    checkoutId: string,
    fundingSource: PaypalFundingSource,
    signal?: AbortSignal
  ): Promise<IApiResponse<IPaypalOrder>>;
}

export class PaypalService implements IPaypalService {
  async createPaypalOrder(
    authToken: string,
    checkoutId: string,
    fundingSource: PaypalFundingSource,
    signal?: AbortSignal
  ): Promise<IApiResponse<IPaypalOrder>> {
    const endpoint = `checkouts/${checkoutId}/paypal/orders`;
    const body = { funding_source: fundingSource };
    return api.post({ endpoint, body, authToken, signal });
  }
}
