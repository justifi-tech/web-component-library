import { IApiResponse, IApiResponseCollection, IPayment } from '../../../api';
import { IPaymentService } from '../../../api/services/payment.service';

// argument type for MockPaymentService constructor
// you can pass a success or an error response to fetchPayments
export interface MockPaymentServiceConstructorArgs {
  fetchPaymentsResponse?: IApiResponseCollection<IPayment[]>;
  fetchPaymentResponse?: IApiResponse<IPayment>;
}

export class MockPaymentService implements IPaymentService {
  private fetchPaymentsResponse: IApiResponseCollection<IPayment[]>;

  constructor({ fetchPaymentsResponse }: MockPaymentServiceConstructorArgs) {
    this.fetchPaymentsResponse = fetchPaymentsResponse;
  }

  fetchPayments(
    _accountId: string,
    _authToken: string,
    _params: any
  ): Promise<IApiResponseCollection<IPayment[]>> {
    return Promise.resolve(this.fetchPaymentsResponse);
  }

  fetchPayment(
    _paymentId: string,
    _authToken: string
  ): Promise<IApiResponse<IPayment>> {
    return Promise.resolve({ data: {} } as IApiResponse<IPayment>);
  }
}
