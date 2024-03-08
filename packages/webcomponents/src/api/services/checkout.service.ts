import { Api, IApiResponse, ICheckout } from '..';
// import { config } from '../../../config';

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
    const endpoint = `checkouts/${checkoutId}`;
    return Api(authToken, 'https://api.justifi.ai/v1/').get(endpoint);
  }
}
