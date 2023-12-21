import dotenv from 'dotenv';

let resolvedEnv = {};

const envFile = dotenv.config({ path: './.env' });

const defaultEnv = {
  IFRAME_ORIGIN: 'https://js.justifi.ai/v2',
  EXAMPLE_BUSINESS_ID: 'biz_3GCA2FgtShugA9O6dlLfH3',
  EXAMPLE_BUSINESS_ACCOUNT_ID: 'acc_5u5Dus39Meb1qqSsu5U7qS',
  PROXY_API_ORIGIN: 'https://wc-proxy.justifi.ai',
  PROXY_AUTH_TOKEN: 'eyJraWQiOiJqdXN0aWZpLWUyNDgyMmU3ODE1MmEzZjRkMjU1IiwidHlwIjoiSldUIiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJodHRwczovL2F1dGguanVzdGlmaS5haS8iLCJhenAiOiJvYXNfMllwZDd3bFQ2NGFlZzc5aGhZaFVBdSIsInN1YiI6Im9hc18yWXBkN3dsVDY0YWVnNzloaFloVUF1QHNlc3Npb25zIiwiYXVkIjoiaHR0cHM6Ly9hcGkuanVzdGlmaS5haS92MSIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyIsInBlcm1pc3Npb25zIjpbeyJyb2xlIjoicmVhZDphY2NvdW50IiwicmVzb3VyY2VfaWQiOiJhY2NfMUdCS1Mycmc3bUxsMnIzRHM0TlBQWSJ9XSwiZXhwIjoxNzA4Mjc4MTk2LCJpYXQiOjE3MDA1MDIxOTYsInBsYXRmb3JtX2FjY291bnRfaWQiOiJhY2NfN2NWbmc3ZXNDdmZIZXZXUUxTd2xuayJ9.Ks6U_mPlNDX09G9T75RPR__VKYZOeknPxLFr1O5Ri6yr9khAtUb_RwBx366qpf19MZ0NyxVtCb7qdXOhL9cb1Xl0owfqBZJXz3vvedfDui_4S9A5YdG4fy82Ja4p4fsCJGgkTgVHu_KBd9tmPY9SOTvRv8PBXdeCAYqqG4VR-sc9nSRtol62uB_kRcN3GRsptN8MTbWHwoqWGOolBCmzk12d9wjO-9t3X3jZ7LIOKP6rO9Lqn1Sh1KfoiUkyiv_TyHbwoQsqU11LZ6XWmDzPGukSdwNwV7qfSFAH4ldAiDYUGDIzFARCr6PEF2MwEC2e6myObiCXWNjg3X1C6oUS6Q',
  EXAMPLE_PAYMENTS_ACCOUNT_ID: 'acc_1GBKS2rg7mLl2r3Ds4NPPY',
  EXAMPLE_PAYMENT_ID: 'py_4KkUgtKYHT1A6empFws90I',
  EXAMPLE_PAYOUT_ID: 'po_zBUZ6WvMEzoPzwS0qUmWE',
  PRIVATE_API_ORIGIN: 'https://api.justifi.ai/v1',
  PRIVATE_AUTH_TOKEN: '',
  EXAMPLE_PLATFORM_ACCOUNT_ID: 'acc_5u5Dus39Meb1qqSsu5U7qS'
}

if (envFile.parsed) {
  resolvedEnv = envFile.parsed;
} else {
  resolvedEnv = defaultEnv;
}

export const replaceEnvVariables = () => {
  const objKeys = Object.keys(resolvedEnv);
  const replaceMapping = {};
  objKeys.forEach(key => {
    replaceMapping[`ENV_${key}`] = resolvedEnv[key];
  });
  return replaceMapping;
}


