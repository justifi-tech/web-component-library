import { newSpecPage } from '@stencil/core/testing';
import { JustifiConfigProvider } from '../justifi-config-provider';
import * as configStateModule from '../config-state';

const { configState } = configStateModule;

// setupTests.js bakes production defaults, so these specs run as a production
// build unless a test swaps the global.
const STAGING_IFRAME = 'https://components.justifi-staging.com';
const STAGING_API = 'https://wc-proxy.justifi-staging.com';
const LOCAL_IFRAME = 'http://localhost:3003';
const LOCAL_API = 'http://localhost:3000';
const EVIL = 'https://evil.example';

describe('justifi-config-provider', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  const render = (html: string) =>
    newSpecPage({ components: [JustifiConfigProvider], html });

  describe('defaults', () => {
    it('applies the build defaults when no attribute is set', async () => {
      await render('<justifi-config-provider></justifi-config-provider>');

      expect(configState.iframeOrigin).toBe(IFRAME_ORIGIN);
      expect(configState.apiOrigin).toBe(PROXY_API_ORIGIN);
      expect(consoleSpy).not.toHaveBeenCalled();
    });
  });

  describe('legitimate overrides', () => {
    it('accepts a local dev iframe origin', async () => {
      await render(`<justifi-config-provider iframe-origin="${LOCAL_IFRAME}"></justifi-config-provider>`);

      expect(configState.iframeOrigin).toBe(LOCAL_IFRAME);
      expect(consoleSpy).not.toHaveBeenCalled();
    });
  });

  describe('staging follows the build tier', () => {
    const swapBuildDefaults = (iframe: string, api: string) => {
      const previous = { iframe: IFRAME_ORIGIN, api: PROXY_API_ORIGIN };
      (global as any).IFRAME_ORIGIN = iframe;
      (global as any).PROXY_API_ORIGIN = api;
      return () => {
        (global as any).IFRAME_ORIGIN = previous.iframe;
        (global as any).PROXY_API_ORIGIN = previous.api;
      };
    };

    // The build defaults are localhost, not the staging values under test, so
    // the values have to clear the allowlist rather than match the fallback.
    it('accepts staging origins when the build itself is non-production', async () => {
      const restore = swapBuildDefaults(LOCAL_IFRAME, LOCAL_API);

      try {
        await render(
          `<justifi-config-provider iframe-origin="${STAGING_IFRAME}" api-origin="${STAGING_API}"></justifi-config-provider>`,
        );

        expect(configState.iframeOrigin).toBe(STAGING_IFRAME);
        expect(configState.apiOrigin).toBe(STAGING_API);
        expect(consoleSpy).not.toHaveBeenCalled();
      } finally {
        restore();
      }
    });

    it('refuses staging origins in a production build', async () => {
      await render(
        `<justifi-config-provider iframe-origin="${STAGING_IFRAME}" api-origin="${STAGING_API}"></justifi-config-provider>`,
      );

      expect(configState.iframeOrigin).toBe(IFRAME_ORIGIN);
      expect(configState.apiOrigin).toBe(PROXY_API_ORIGIN);
      expect(consoleSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('refused overrides', () => {
    it('keeps the build default iframe origin when iframe-origin is not a JustiFi origin', async () => {
      await render(`<justifi-config-provider iframe-origin="${EVIL}"></justifi-config-provider>`);

      expect(configState.iframeOrigin).toBe(IFRAME_ORIGIN);
    });

    it('keeps the build default api origin when api-origin is not a JustiFi origin', async () => {
      await render(`<justifi-config-provider api-origin="${EVIL}"></justifi-config-provider>`);

      expect(configState.apiOrigin).toBe(PROXY_API_ORIGIN);
    });

    it('logs exactly one console.error naming the prop, the refused value and the fallback', async () => {
      await render(`<justifi-config-provider iframe-origin="${EVIL}"></justifi-config-provider>`);

      expect(consoleSpy).toHaveBeenCalledTimes(1);
      const message = String(consoleSpy.mock.calls[0][0]);
      expect(message).toContain('iframe-origin');
      expect(message).toContain(EVIL);
      expect(message).toContain(IFRAME_ORIGIN);
    });

    it('ignores attribute changes after load (no watcher re-applies config)', async () => {
      const page = await render(`<justifi-config-provider iframe-origin="${LOCAL_IFRAME}"></justifi-config-provider>`);
      expect(configState.iframeOrigin).toBe(LOCAL_IFRAME);

      page.root.setAttribute('iframe-origin', EVIL);
      await page.waitForChanges();

      expect(configState.iframeOrigin).toBe(LOCAL_IFRAME);
      expect(consoleSpy).not.toHaveBeenCalled();
    });

    it('still completes the config handshake and passes account-id through', async () => {
      const setConfigStateSpy = jest.spyOn(configStateModule, 'setConfigState');

      await render(
        `<justifi-config-provider iframe-origin="${EVIL}" account-id="acc_123"></justifi-config-provider>`,
      );

      expect(setConfigStateSpy).toHaveBeenCalledTimes(1);
      expect(setConfigStateSpy).toHaveBeenCalledWith({
        apiOrigin: PROXY_API_ORIGIN,
        iframeOrigin: IFRAME_ORIGIN,
        accountId: 'acc_123',
      });
      expect(configState.accountId).toBe('acc_123');
      setConfigStateSpy.mockRestore();
    });
  });
});
