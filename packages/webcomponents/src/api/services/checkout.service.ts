import { Api, IApiResponse, ICheckout } from '..';
import { config } from '../../../config';

export interface ICheckoutService {
  fetchCheckout(
    authToken: string,
    checkoutId: string,
  ): Promise<IApiResponse<ICheckout>>;

  complete(
    authToken: string,
    checkoutId: string,
    payment: { mode: string; token?: string; },
  ): Promise<IApiResponse<ICheckout>>;
}

export class CheckoutService implements ICheckoutService {
  async fetchCheckout(
    authToken: string,
    checkoutId: string,
  ): Promise<IApiResponse<ICheckout>> {
    const endpoint = `checkouts/${checkoutId}`;
    return Api(authToken, config.proxyApiOrigin).get(endpoint);
  }
  async complete(
    authToken: string,
    checkoutId: string,
    payment: { mode: string; token?: string; },
  ): Promise<IApiResponse<ICheckout>> {
    const endpoint = `checkouts/${checkoutId}/complete`;
    const payload: { mode: string, payment_token?: string } = { mode: payment.mode };
    if (payment.token) {
      payload.payment_token = payment.token;
    }
    return Api(authToken, config.proxyApiOrigin).post(endpoint, JSON.stringify(payload));
  }
}
