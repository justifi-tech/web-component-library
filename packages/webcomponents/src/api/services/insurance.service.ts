import { IApiResponse, IQuote } from '..';
import Api from '../ApiNew';

const api = Api();

export interface IInsuranceService {
  fetchQuote(authToken: string, payload: any): Promise<IApiResponse<IQuote>>;
  toggleCoverage(
    authToken: string,
    quoteId: string,
    payload: any
  ): Promise<IApiResponse<IQuote>>;
}

export class InsuranceService implements IInsuranceService {
  async fetchQuote(
    authToken: string,
    payload: any
  ): Promise<IApiResponse<IQuote>> {
    const endpoint = 'insurance/quotes';
    const body = payload;
    return api.post({ endpoint, body, authToken });
  }
  async toggleCoverage(
    authToken: string,
    quoteId: string,
    payload: { accepted: boolean }
  ): Promise<IApiResponse<IQuote>> {
    const endpoint = `insurance/quotes/${quoteId}/toggle`;
    const body = payload;
    return api.post({ endpoint, body, authToken });
  }
}
