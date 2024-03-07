import { Api, IApiResponse, ICheckout } from '..';
import { config } from '../../../config';

export interface ICheckoutService {
  fetchCheckout(
    authToken: string,
    checkoutId: string,
  ): Promise<IApiResponse<ICheckout>>;
}

export class CheckoutService implements ICheckoutService {
  async fetchCheckout(
    authToken: string,
    checkoutId: string,
  ): Promise<IApiResponse<ICheckout>> {
    const endpoint = `checkout/${checkoutId}`;
    return Api(authToken, config.proxyApiOrigin).get(endpoint);
  }
}
