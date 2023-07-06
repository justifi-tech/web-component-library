import { v4 as uuidv4 } from 'uuid';
import { IPagination } from './Pagination';

export interface IApiResponse<T> {
  data: T;
  error?: IErrorObject | IServerError;
  page_info?: IPagination;
  errors?: string[];
  id: number;
  type: string;
}

export type IServerError = string;

export interface IErrorObject {
  message: string;
  code: string;
  param?: string;
}

export interface IApiResponseCollection<T> extends IApiResponse<T> {
  page_info: IPagination;
}

const Api = (authToken: string) => {
  // const apiOrigin = 'https://justifi.ai';
  const apiOrigin = 'http://localhost:3000';

  async function getAuthorizationHeader() {
    return {
      'Authorization': `Bearer ${authToken}`,
      'Idempotency-Key': uuidv4(),
      'Content-Type': 'application/json',
    };
  }

  async function makeRequest(endpoint: string, method: string, params?: any, body?: any, signal?: AbortSignal) {
    const url = `${apiOrigin}/v1/${endpoint}`;
    const requestUrl = params ? `${url}?${new URLSearchParams(params)}` : url;
    const response = await fetch(requestUrl, {
      method: method,
      headers: await getAuthorizationHeader(),
      body: body,
      signal: signal,
    });

    if (response) {
      return response.status === 204 ? {} : response.json();
    }
    handleError(requestUrl);
  }

  async function get(endpoint: string, params?: any, signal?: AbortSignal) {
    return makeRequest(endpoint, 'GET', params, null, signal);
  }

  async function post(endpoint: string, body?: any, params?: any, signal?: AbortSignal) {
    return makeRequest(endpoint, 'POST', params, body, signal);
  }

  async function patch(endpoint: string, body?: any, params?: any, signal?: AbortSignal) {
    return makeRequest(endpoint, 'PATCH', params, body, signal);
  }

  async function destroy(endpoint: string, params?: any, signal?: AbortSignal) {
    return makeRequest(endpoint, 'DELETE', params, null, signal);
  }

  return { get, post, patch, destroy };
};

function handleError(requestUrl: string): void {
  console.error(`Error fetching from ${requestUrl}`);
}

export default Api;
