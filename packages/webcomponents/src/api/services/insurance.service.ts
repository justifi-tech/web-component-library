import { Api, IApiResponse, IQuote } from '..';
import { config } from '../../../config';

export interface IInsuranceService {
  fetchQuote(
    quoteId: string,
    authToken: string
  ): Promise<IApiResponse<IQuote>>;
}

export class InsuranceService implements IInsuranceService {
  async fetchQuote(
    quoteId: string,
    authToken: string
  ): Promise<IApiResponse<IQuote>> {
    const endpoint = `payments/${quoteId}`;
    return Api(authToken, config.proxyApiOrigin).get(endpoint);
  }
}
