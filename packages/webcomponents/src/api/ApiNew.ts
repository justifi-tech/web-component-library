import { configState } from '../components/config-provider/config-state';
import { generateId } from '../utils/utils';
import { PagingInfo } from './Pagination';

export interface IApiResponse<T> {
  data: T;
  error?: IErrorObject | IServerError;
  page_info?: PagingInfo;
  errors?: string[];
  id: number | string;
  type: string;
}

export type IServerError = string;

export interface IErrorObject {
  message: string;
  code: string;
  param?: string;
}

export interface IApiResponseCollection<T> extends IApiResponse<T> {
  page_info: PagingInfo;
}

interface RequestProps {
  endpoint: string;
  method: string;
  params?: any;
  body?: any;
  signal?: AbortSignal;
  headers?: HeadersInit;
}

const Api = (authToken: string) => {
  
  const apiOrigin = configState.apiOrigin;
  
  async function getAuthorizationHeader() {
    if (!authToken) {
      return {
        'Content-Type': 'application/json',
      };
    }

    return {
      Authorization: `Bearer ${authToken}`,
      'Idempotency-Key': generateId(),
      'Content-Type': 'application/json',
    };
  }

  async function makeRequest(props: RequestProps) {
    const { endpoint, method, params, body, signal, headers } = props;

    const url = `${apiOrigin}/v1/${endpoint}`;
    const requestUrl = params ? `${url}?${new URLSearchParams(params)}` : url;

    const defaultHeaders = await getAuthorizationHeader();
    const mergedHeaders = { ...defaultHeaders, ...headers };

    const response = await fetch(requestUrl, {
      method: method,
      headers: mergedHeaders,
      body: body,
      signal: signal,
    });

    if (response) {
      return response.status === 204 ? {} : response.json();
    }
    handleError(requestUrl);
  }

  async function get({
    endpoint,
    params,
    signal,
    headers,
  }: {
    endpoint: string;
    params?: any;
    signal?: AbortSignal;
    headers?: HeadersInit;
  }) {
    return makeRequest({ endpoint, method: 'GET', params, signal, headers });
  }

  async function post({
    endpoint,
    body,
    params,
    signal,
    headers,
  }: {
    endpoint: string;
    body?: any;
    params?: any;
    signal?: AbortSignal;
    headers?: HeadersInit;
  }) {
    return makeRequest({
      endpoint,
      method: 'POST',
      params,
      body: JSON.stringify(body),
      signal,
      headers,
    });
  }

  async function put({
    endpoint,
    body,
    params,
    signal,
  }: {
    endpoint: string;
    body?: any;
    params?: any;
    signal?: AbortSignal;
  }) {
    return makeRequest({
      endpoint,
      method: 'PUT',
      params,
      body: JSON.stringify(body),
      signal,
    });
  }

  async function patch({
    endpoint,
    body,
    params,
    signal,
  }: {
    endpoint: string;
    body?: any;
    params?: any;
    signal?: AbortSignal;
  }) {
    return makeRequest({
      endpoint,
      method: 'PATCH',
      params,
      body: JSON.stringify(body),
      signal,
    });
  }

  async function destroy({
    endpoint,
    params,
    signal,
  }: {
    endpoint: string;
    params?: any;
    signal?: AbortSignal;
  }) {
    return makeRequest({ endpoint, method: 'DELETE', params, signal });
  }

  return { get, post, put, patch, destroy };
};

function handleError(requestUrl: string): void {
  console.error(`Error fetching from ${requestUrl}`);
}

export default Api;
