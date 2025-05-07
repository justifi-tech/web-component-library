import {
  Api,
  IApiResponse,
  IApiResponseCollection,
  ICheckout,
  ICheckoutCompleteResponse,
} from '..';

const api = Api();

export interface ICheckoutService {
  fetchCheckout(
    authToken: string,
    checkoutId: string
  ): Promise<IApiResponse<ICheckout>>;

  fetchCheckouts(
    accountId: string,
    authToken: string,
    params: any
  ): Promise<IApiResponseCollection<ICheckout[]>>;

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
    return api.get({ endpoint, authToken });
  }

  async fetchCheckouts(
    accountId: string,
    authToken: string,
    params: any
  ): Promise<IApiResponseCollection<ICheckout[]>> {
    const endpoint = 'checkouts';
    const headers = { Account: accountId };
    return api.get({ endpoint, params, headers, authToken });
  }

  async complete(
    authToken: string,
    checkoutId: string,
    payment: { payment_mode: string; payment_token?: string }
  ): Promise<IApiResponse<ICheckoutCompleteResponse>> {
    const endpoint = `checkouts/${checkoutId}/complete`;
    const body: { payment_mode: string; payment_token?: string } = {
      payment_mode: payment.payment_mode,
    };
    if (payment.payment_token) {
      body.payment_token = payment.payment_token;
    }
    return api.post({ endpoint, body, authToken });
  }
}
