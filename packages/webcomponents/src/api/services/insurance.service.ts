import { Api, IApiResponse, IQuote } from '..';

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
    return Api({ authToken, apiOrigin: PROXY_API_ORIGIN }).post({
      endpoint,
      body: payload,
    });
  }
  async toggleCoverage(
    authToken: string,
    quoteId: string,
    payload: { accepted: boolean }
  ): Promise<IApiResponse<IQuote>> {
    const endpoint = `insurance/quotes/${quoteId}/toggle`;
    return Api({ authToken, apiOrigin: PROXY_API_ORIGIN }).post({
      endpoint,
      body: payload,
    });
  }
}
