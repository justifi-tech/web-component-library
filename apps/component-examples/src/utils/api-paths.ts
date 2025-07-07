export const API_PATHS = {
  AUTH_TOKEN: 'oauth/token',
  WEB_COMPONENT_TOKEN: 'v1/web_component_tokens',
  CHECKOUT: 'v1/checkouts',
  BUSINESS: 'v1/entities/business',
  PAYMENTS: 'v1/payments',
} as const;

export type ApiPath = (typeof API_PATHS)[keyof typeof API_PATHS];

export interface ApiEndpoints {
  authToken: string;
  webComponentToken: string;
  checkout: string;
  business: string;
  payments: string;
}
