import { Api, IApiResponse, ICheckout } from '..';
import { config } from '../../../config';

export interface ICheckoutService {
  fetchCheckout(
    paymentId: string,
    authToken: string
  ): Promise<IApiResponse<ICheckout>>;
}

export class CheckoutService implements ICheckoutService {
  async fetchCheckout(
    paymentId: string,
    authToken: string
  ): Promise<IApiResponse<ICheckout>> {
    const endpoint = `payments/${paymentId}`;
    return Api(authToken, config.proxyApiOrigin).get(endpoint);
  }
}
