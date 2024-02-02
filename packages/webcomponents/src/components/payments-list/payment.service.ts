import { Api } from '../../api';
import { config } from '../../../config';
import { FetchPaymentsResponseType } from './fetch-payments-response.type';

export interface IPaymentService {
  fetchPayments(
    accountId: string,
    authToken: string,
    params: any
  ): Promise<FetchPaymentsResponseType>;
}

export class PaymentService implements IPaymentService {
  async fetchPayments(
    accountId: string,
    authToken: string,
    params: any
  ): Promise<FetchPaymentsResponseType> {
    const api = Api(authToken, config.proxyApiOrigin);
    const endpoint = `account/${accountId}/payments`;
    return api.get(endpoint, params);
  }
}
