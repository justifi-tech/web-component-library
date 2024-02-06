import { FetchPaymentsResponseType } from '../../../api';
import { IPaymentService } from '../payment.service';

// argument type for MockPaymentService constructor
// you can pass a success or an error response to fetchPayments
export interface MockPaymentServiceConstructorArgs {
  fetchPaymentsResponse: FetchPaymentsResponseType;
}

export class MockPaymentService implements IPaymentService {
  private fetchPaymentsResponse: FetchPaymentsResponseType;

  constructor({ fetchPaymentsResponse }: MockPaymentServiceConstructorArgs) {
    this.fetchPaymentsResponse = fetchPaymentsResponse;
  }

  fetchPayments(
    _accountId: string,
    _authToken: string,
    _params: any
  ): Promise<FetchPaymentsResponseType> {
    return Promise.resolve(this.fetchPaymentsResponse);
  }
}
