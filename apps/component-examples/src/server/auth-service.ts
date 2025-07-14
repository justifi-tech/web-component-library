import { API_PATHS } from '../utils/api-paths';

export interface AuthConfig {
  apiOrigin: string;
  clientId: string;
  clientSecret: string;
  subAccountId: string;
}

export interface TokenResponse {
  access_token: string;
  token_type?: string;
  expires_in?: number;
}

export interface WebComponentTokenRequest {
  resources: string[];
}

export class AuthService {
  private config: AuthConfig;

  constructor(config: AuthConfig) {
    this.config = config;
  }

  private getAuthTokenEndpoint(): string {
    return `${this.config.apiOrigin}/${API_PATHS.AUTH_TOKEN}`;
  }

  private getWebComponentTokenEndpoint(): string {
    return `${this.config.apiOrigin}/${API_PATHS.WEB_COMPONENT_TOKEN}`;
  }

  async getAuthToken(): Promise<string> {
    const requestBody = JSON.stringify({
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
    });

    try {
      const response = await fetch(this.getAuthTokenEndpoint(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: requestBody,
      });

      if (!response.ok) {
        throw new Error(
          `Auth token request failed: ${response.status} ${response.statusText}`
        );
      }

      const responseJson: TokenResponse = await response.json();
      return responseJson.access_token;
    } catch (error) {
      console.error('Error getting auth token:', error);
      throw error;
    }
  }

  async getWebComponentToken(
    authToken: string,
    resources: string[]
  ): Promise<string> {
    const requestBody: WebComponentTokenRequest = { resources };

    try {
      const response = await fetch(this.getWebComponentTokenEndpoint(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(
          `Web component token request failed: ${response.status} ${response.statusText}`
        );
      }

      const responseJson: TokenResponse = await response.json();
      return responseJson.access_token;
    } catch (error) {
      console.error('Error getting web component token:', error);
      throw error;
    }
  }

  getSubAccountId(): string {
    return this.config.subAccountId;
  }

  getApiOrigin(): string {
    return this.config.apiOrigin;
  }
}
