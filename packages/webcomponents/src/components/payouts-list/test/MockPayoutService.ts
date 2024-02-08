import { IApiResponse, IApiResponseCollection, IPayout } from '../../../api';
import { IPayoutService } from '../../../api/services/payout.service';

// argument type for MockPayoutService constructor
// you can pass a success or an error response to fetchPayouts
export interface MockPayoutServiceConstructorArgs {
  fetchPayoutsResponse?: IApiResponseCollection<IPayout[]>;
  fetchPayoutResponse?: IApiResponse<IPayout>;
}

export class MockPayoutService implements IPayoutService {
  private fetchPayoutsResponse: IApiResponseCollection<IPayout[]>;
  private fetchPayoutResponse: IApiResponse<IPayout>;

  constructor({
    fetchPayoutsResponse,
    fetchPayoutResponse,
  }: MockPayoutServiceConstructorArgs) {
    this.fetchPayoutsResponse = fetchPayoutsResponse;
    this.fetchPayoutResponse = fetchPayoutResponse;
  }

  fetchPayouts(
    _accountId: string,
    _authToken: string,
    _params: any
  ): Promise<IApiResponseCollection<IPayout[]>> {
    return Promise.resolve(this.fetchPayoutsResponse);
  }

  fetchPayout(
    _payoutId: string,
    _authToken: string
  ): Promise<IApiResponse<IPayout>> {
    return Promise.resolve(this.fetchPayoutResponse);
  }
}
