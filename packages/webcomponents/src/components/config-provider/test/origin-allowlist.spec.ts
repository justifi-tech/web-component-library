import { isAllowedOrigin, resolveOrigin } from '../origin-allowlist';

// Which tier the bundle was built for is read off its own baked default.
const PROD_BUILD = 'https://components.justifi.ai';
const STAGING_BUILD = 'https://components.justifi-staging.com';
const LOCAL_BUILD = 'http://localhost:3003';

describe('isAllowedOrigin', () => {
  describe('accepted in every build', () => {
    it.each([
      ['https://components.justifi.ai', 'production iframe host'],
      ['https://wc-proxy.justifi.ai', 'production api proxy'],
      ['https://api.justifi.ai', 'production api'],
      ['http://localhost:3003', 'localhost over http, any port'],
      ['https://localhost:3003', 'localhost over https'],
      ['http://127.0.0.1:3003', 'IPv4 loopback'],
      ['http://[::1]:3003', 'IPv6 loopback'],
    ])('accepts %s (%s)', (origin) => {
      expect(isAllowedOrigin(origin, PROD_BUILD)).toBe(true);
      expect(isAllowedOrigin(origin, STAGING_BUILD)).toBe(true);
      expect(isAllowedOrigin(origin, LOCAL_BUILD)).toBe(true);
    });
  });

  describe('staging hosts follow the build tier', () => {
    const STAGING = [
      ['https://components.justifi-staging.com', 'staging iframe host'],
      ['https://wc-proxy.justifi-staging.com', 'staging api proxy'],
      ['https://api.justifi-staging.com', 'staging api'],
    ];

    it.each(STAGING)('accepts %s (%s) in a staging build', (origin) => {
      expect(isAllowedOrigin(origin, STAGING_BUILD)).toBe(true);
    });

    it.each(STAGING)('accepts %s (%s) in a localhost build', (origin) => {
      expect(isAllowedOrigin(origin, LOCAL_BUILD)).toBe(true);
    });

    it.each(STAGING)('rejects %s (%s) in a production build', (origin) => {
      expect(isAllowedOrigin(origin, PROD_BUILD)).toBe(false);
    });

    const UNUSABLE_BUILD_DEFAULTS: [unknown, string][] = [
      [undefined, 'unset build default'],
      ['', 'empty build default'],
      ['not-a-url', 'malformed build default'],
      ['https://evil.example', 'foreign build default'],
      [42, 'non-string build default'],
    ];

    it.each(UNUSABLE_BUILD_DEFAULTS)('rejects staging when the build default is %p (%s)', (buildDefault) => {
      expect(
        isAllowedOrigin('https://components.justifi-staging.com', buildDefault),
      ).toBe(false);
    });
  });

  describe('rejected in every build', () => {
    it.each([
      ['https://evil.example', 'foreign host'],
      ['https://justifi.ai', 'the apex itself is not a service host'],
      ['https://test-iframe.justifi.ai', 'unknown justifi.ai subdomain'],
      ['https://a.b.justifi-staging.com', 'unknown nested staging subdomain'],
      ['https://justifi.ai.evil.example', 'allowed apex as a subdomain of a foreign host'],
      ['https://notjustifi.ai', 'suffix without the dot boundary'],
      ['https://components.justifi.ai.attacker.com', 'allowed host as a prefix'],
      ['https://justifi-ai.com', 'look-alike apex'],
      ['http://components.justifi.ai', 'plain http on a non-loopback host'],
      ['http://components.justifi-staging.com', 'plain http on a staging host'],
      ['https://components.justifi.ai@evil.example', 'allowed host in userinfo'],
      ['https://foo@components.justifi.ai', 'userinfo in front of an allowed host'],
      ['https://evil.example#components.justifi.ai', 'allowed host in fragment'],
      ['https://evil.example/?next=https://components.justifi.ai', 'allowed host in query'],
      ['https://components.justifi.ai.', 'trailing-dot FQDN form of an allowed host'],
      ['https://components.justifi.аi', 'IDN homoglyph (Cyrillic a) of an allowed host'],
      ['http://localhost.evil.example', 'localhost as a subdomain label'],
      ['javascript:alert(1)', 'javascript scheme'],
      ['data:text/html,x', 'data scheme'],
      ['//evil.example', 'scheme-relative'],
      ['components.justifi.ai', 'no scheme'],
      ['', 'empty string'],
    ])('rejects %s (%s)', (origin) => {
      expect(isAllowedOrigin(origin, PROD_BUILD)).toBe(false);
      expect(isAllowedOrigin(origin, STAGING_BUILD)).toBe(false);
    });

    it.each([
      ['https://components.justifi.ai/', 'trailing slash'],
      ['https://components.justifi.ai/v2?x=1', 'path and query'],
      ['https://Components.JustiFi.AI', 'non-canonical casing'],
      ['HTTPS://components.justifi.ai', 'non-canonical scheme casing'],
      ['https://components.justifi.ai:443', 'explicit default port'],
      ['https://components.justifi.ai ', 'trailing whitespace'],
      ['http://127.1', 'shorthand loopback that URL normalizes'],
    ])('rejects non-canonical %s (%s) even on an allowed host', (origin) => {
      expect(isAllowedOrigin(origin, PROD_BUILD)).toBe(false);
      expect(isAllowedOrigin(origin, STAGING_BUILD)).toBe(false);
    });

    it.each([
      [undefined, 'undefined'],
      [null, 'null'],
      [42, 'number'],
      [{ href: 'https://components.justifi.ai' }, 'object'],
      [Object.create(null), 'object without a prototype'],
    ])('rejects non-string %p (%s)', (value) => {
      expect(isAllowedOrigin(value, STAGING_BUILD)).toBe(false);
    });
  });
});

describe('resolveOrigin', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it.each([
    'https://components.justifi-staging.com',
    'https://wc-proxy.justifi-staging.com',
    'http://localhost:3003',
    'http://[::1]:3003',
  ])('returns an accepted value byte-identical: %s', (origin) => {
    expect(resolveOrigin('iframe-origin', origin, STAGING_BUILD)).toBe(origin);
    expect(consoleSpy).not.toHaveBeenCalled();
  });

  it('still accepts a localhost override in a production build', () => {
    expect(resolveOrigin('iframe-origin', 'http://localhost:3003', PROD_BUILD)).toBe(
      'http://localhost:3003',
    );
    expect(consoleSpy).not.toHaveBeenCalled();
  });

  it('refuses a staging override in a production build and says why', () => {
    const result = resolveOrigin('iframe-origin', STAGING_BUILD, PROD_BUILD);

    expect(result).toBe(PROD_BUILD);
    expect(consoleSpy).toHaveBeenCalledTimes(1);
    expect(String(consoleSpy.mock.calls[0][0])).toContain('non-production build');
  });

  it('returns the fallback silently when no value was provided', () => {
    expect(resolveOrigin('iframe-origin', undefined, PROD_BUILD)).toBe(PROD_BUILD);
    expect(resolveOrigin('api-origin', null, PROD_BUILD)).toBe(PROD_BUILD);
    expect(consoleSpy).not.toHaveBeenCalled();
  });

  it('returns the fallback and logs once when the value is refused', () => {
    const result = resolveOrigin('api-origin', 'https://evil.example', PROD_BUILD);

    expect(result).toBe(PROD_BUILD);
    expect(consoleSpy).toHaveBeenCalledTimes(1);
    const message = String(consoleSpy.mock.calls[0][0]);
    expect(message).toContain('api-origin');
    expect(message).toContain('https://evil.example');
    expect(message).toContain(PROD_BUILD);
  });

  it('does not throw on a property value that cannot be stringified', () => {
    const exotic = Object.create(null);

    expect(() => resolveOrigin('iframe-origin', exotic, PROD_BUILD)).not.toThrow();
    expect(resolveOrigin('iframe-origin', exotic, PROD_BUILD)).toBe(PROD_BUILD);
    expect(String(consoleSpy.mock.calls[0][0])).toContain('<object>');
  });
});
