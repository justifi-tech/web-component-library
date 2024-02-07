import { Api, IApiResponseCollection, IPayment } from '../../api';
import { config } from '../../../config';

export interface IPaymentService {
  fetchPayments(
    accountId: string,
    authToken: string,
    params: any
  ): Promise<IApiResponseCollection<IPayment[]>>;
}

export class PaymentService implements IPaymentService {
  async fetchPayments(
    accountId: string,
    authToken: string,
    params: any
  ): Promise<IApiResponseCollection<IPayment[]>> {
    const api = Api(authToken, config.proxyApiOrigin);
    const endpoint = `account/${accountId}/payments`;
    return api.get(endpoint, params);
  }
}
