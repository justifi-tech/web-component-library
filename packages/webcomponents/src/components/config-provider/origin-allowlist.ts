/**
 * Which `iframe-origin` / `api-origin` values <justifi-config-provider> accepts.
 *
 * The two props exist so staging and local development can point the SDK at
 * non-production JustiFi hosts. Anything else is refused and the build default
 * is kept: a script that can inject `<justifi-config-provider>` into a merchant
 * page must not be able to redirect the hosted fields, or the API calls that
 * carry the auth token, to a host it controls.
 *
 * Hosts are listed explicitly rather than as `*.justifi.ai`, so a forgotten
 * subdomain (a dangling CNAME on a marketing or docs host) can never become a
 * place to serve fake card fields from.
 *
 * The staging hosts are only accepted by a build that is itself pointed at a
 * non-production origin, so a production bundle cannot be talked into loading
 * hosted fields from staging. There is no new build flag for this — the baked
 * `IFRAME_ORIGIN` / `PROXY_API_ORIGIN` default already says which tier the
 * build belongs to, and an unrecognised default is treated as production.
 */
const PRODUCTION_HOSTS = [
  'components.justifi.ai',
  'wc-proxy.justifi.ai',
  'api.justifi.ai',
];
const STAGING_HOSTS = [
  'components.justifi-staging.com',
  'wc-proxy.justifi-staging.com',
  'api.justifi-staging.com',
];
const LOOPBACK_HOSTS = ['localhost', '127.0.0.1', '[::1]'];

const parseOrigin = (value: unknown): URL | null => {
  if (typeof value !== 'string' || value === '') return null;
  try {
    return new URL(value);
  } catch {
    return null;
  }
};

/**
 * True when the build default is a staging or loopback origin, i.e. this bundle
 * was built for development. Anything else — a production host, a malformed
 * value, an unset env var — counts as production, so the tier fails closed.
 */
const buildIsNonProduction = (buildDefault: unknown): boolean => {
  const url = parseOrigin(buildDefault);
  if (!url) return false;

  return (
    STAGING_HOSTS.includes(url.hostname) || LOOPBACK_HOSTS.includes(url.hostname)
  );
};

/**
 * True when `value` is a canonical origin (`scheme://host[:port]`, nothing
 * else) that this build accepts: a production JustiFi host over https, a
 * loopback host over http/https (any port), or — in a non-production build
 * only — a staging JustiFi host over https.
 *
 * Requiring `url.origin === value` is what rejects userinfo, paths, query,
 * fragments, casing and default-port variants in one check. Consumers append
 * `/v1/…` and `/v2/…` to the value and Google Pay compares `event.origin`
 * against it by string, so a non-canonical value would break downstream.
 */
export const isAllowedOrigin = (
  value: unknown,
  buildDefault: unknown,
): value is string => {
  const url = parseOrigin(value);
  if (!url || url.origin !== value) return false;

  if (LOOPBACK_HOSTS.includes(url.hostname)) {
    return url.protocol === 'http:' || url.protocol === 'https:';
  }

  if (url.protocol !== 'https:') return false;
  if (PRODUCTION_HOSTS.includes(url.hostname)) return true;

  return (
    STAGING_HOSTS.includes(url.hostname) && buildIsNonProduction(buildDefault)
  );
};

const describe = (value: unknown) =>
  typeof value === 'string' ? value : `<${typeof value}>`;

const allowedList = (buildDefault: unknown) =>
  buildIsNonProduction(buildDefault)
    ? 'https://{components,wc-proxy,api}.justifi.ai, the same hosts on ' +
      'justifi-staging.com, or a localhost origin'
    : 'https://{components,wc-proxy,api}.justifi.ai or a localhost origin ' +
      '(staging hosts are accepted only by a non-production build)';

/**
 * Returns `value` unchanged when it is an allowed origin, otherwise `fallback`.
 * A refused value logs one console.error so both an injection attempt and a
 * plain typo are visible instead of silently rendering an empty field.
 */
export const resolveOrigin = (
  prop: 'iframe-origin' | 'api-origin',
  value: unknown,
  fallback: string,
): string => {
  if (value === undefined || value === null || value === fallback) return fallback;
  if (isAllowedOrigin(value, fallback)) return value;

  console.error(
    `@justifi/webcomponents: <justifi-config-provider ${prop}="${describe(value)}"> ` +
    `is not an allowed JustiFi origin and was ignored. Using "${fallback}". ` +
    `Allowed: ${allowedList(fallback)}.`,
  );
  return fallback;
};
