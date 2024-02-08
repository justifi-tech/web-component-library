import { IApiResponseCollection, IPayout } from '../../../api';
import { IPayoutService } from '../../../api/services/payout.service';

// argument type for MockPayoutService constructor
// you can pass a success or an error response to fetchPayouts
export interface MockPayoutServiceConstructorArgs {
  fetchPayoutsResponse: IApiResponseCollection<IPayout[]>;
}

export class MockPayoutService implements IPayoutService {
  private fetchPayoutsResponse: IApiResponseCollection<IPayout[]>;

  constructor({ fetchPayoutsResponse }: MockPayoutServiceConstructorArgs) {
    this.fetchPayoutsResponse = fetchPayoutsResponse;
  }

  fetchPayouts(
    _accountId: string,
    _authToken: string,
    _params: any
  ): Promise<IApiResponseCollection<IPayout[]>> {
    return Promise.resolve(this.fetchPayoutsResponse);
  }
}
