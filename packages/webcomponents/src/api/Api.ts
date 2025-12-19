import { waitForConfig, configState } from '../components/config-provider/config-state';
import { generateId } from '../utils/utils';

// Re-export types from @justifi/types for backward compatibility
export type {
  IApiResponse,
  IServerError,
  IErrorObject,
  IApiResponseCollection,
} from '@justifi/types';

interface MakeRequestProps {
  authToken: string;
  endpoint: string;
  method: string;
  params?: unknown;
  body?: string;
  signal?: AbortSignal;
  headers?: HeadersInit;
}

interface GetProps {
  authToken: string;
  endpoint: string;
  params?: unknown;
  signal?: AbortSignal;
  headers?: HeadersInit;
}

interface PostProps {
  authToken?: string;
  endpoint: string;
  body?: unknown;
  params?: unknown;
  signal?: AbortSignal;
  headers?: HeadersInit;
}

interface PutProps {
  authToken: string;
  endpoint: string;
  body?: unknown;
  params?: unknown;
  signal?: AbortSignal;
}

interface PatchProps {
  authToken: string;
  endpoint: string;
  body?: unknown;
  params?: unknown;
  signal?: AbortSignal;
}

interface DestroyProps {
  authToken: string;
  endpoint: string;
  params?: unknown;
  signal?: AbortSignal;
}

export const Api = () => {
  async function getAuthorizationHeader(authToken: string) {
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

  async function makeRequest(props: MakeRequestProps) {
    const { authToken, endpoint, method, params, body, signal, headers } = props;

    await waitForConfig();
    const apiOrigin = configState.apiOrigin;

    const url = `${apiOrigin}/v1/${endpoint}`;
    const requestUrl = params ? `${url}?${new URLSearchParams(params as Record<string, string>)}` : url;

    const defaultHeaders = await getAuthorizationHeader(authToken);
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

  async function get(props: GetProps) {
    const { authToken, endpoint, params, signal, headers } = props;
    return makeRequest({ authToken, endpoint, method: 'GET', params, signal, headers });
  }

  async function post(props: PostProps) {
    const { authToken, endpoint, body, params, signal, headers } = props;
    return makeRequest({
      authToken: authToken || '',
      endpoint,
      method: 'POST',
      params,
      body: JSON.stringify(body),
      signal,
      headers,
    });
  }

  async function put(props: PutProps) {
    const { authToken, endpoint, body, params, signal } = props;
    return makeRequest({
      authToken,
      endpoint,
      method: 'PUT',
      params,
      body: JSON.stringify(body),
      signal,
    });
  }

  async function patch(props: PatchProps) {
    const { authToken, endpoint, body, params, signal } = props;
    return makeRequest({
      authToken,
      endpoint,
      method: 'PATCH',
      params,
      body: JSON.stringify(body),
      signal,
    });
  }

  async function destroy(props: DestroyProps) {
    const { authToken, endpoint, params, signal } = props;
    return makeRequest({ authToken, endpoint, method: 'DELETE', params, signal });
  }

  return { get, post, put, patch, destroy };
};

function handleError(requestUrl: string): void {
  console.error(`Error fetching from ${requestUrl}`);
}
