import { Api, IApiResponse, ICheckout, ICheckoutCompleteResponse } from '..';
import { config } from '../../../config';

export interface ICheckoutService {
  fetchCheckout(
    authToken: string,
    checkoutId: string
  ): Promise<IApiResponse<ICheckout>>;

  complete(
    authToken: string,
    checkoutId: string,
    payment: { payment_mode: string; payment_token?: string }
  ): Promise<IApiResponse<ICheckoutCompleteResponse>>;
}

export class CheckoutService implements ICheckoutService {
  async fetchCheckout(
    authToken: string,
    checkoutId: string
  ): Promise<IApiResponse<ICheckout>> {
    const endpoint = `checkouts/${checkoutId}`;
    return Api({ authToken, apiOrigin: config.proxyApiOrigin }).get(endpoint);
  }
  async complete(
    authToken: string,
    checkoutId: string,
    payment: { payment_mode: string; payment_token?: string }
  ): Promise<IApiResponse<ICheckoutCompleteResponse>> {
    const endpoint = `checkouts/${checkoutId}/complete`;
    const payload: { payment_mode: string; payment_token?: string } = {
      payment_mode: payment.payment_mode,
    };
    if (payment.payment_token) {
      payload.payment_token = payment.payment_token;
    }
    return Api({ authToken, apiOrigin: config.proxyApiOrigin }).post(
      endpoint,
      JSON.stringify(payload)
    );
  }
}
