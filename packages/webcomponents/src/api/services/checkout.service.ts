import { Api, IApiResponse, ICheckout } from '..';
import { config } from '../../../config';

export interface ICheckoutService {
  fetchCheckout(
    authToken: string,
    checkoutId: string,
  ): Promise<IApiResponse<ICheckout>>;

  pay(
    authToken: string,
    checkoutId: string,
    tokenizedPaymentMethod: string,
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
  async pay(
    authToken: string,
    checkoutId: string,
    paymentMethodToken: string,
  ): Promise<IApiResponse<ICheckout>> {
    const endpoint = `checkouts/${checkoutId}/pay`;
    return Api(authToken, config.proxyApiOrigin).post(endpoint, JSON.stringify({ token: paymentMethodToken }));
  }
}
