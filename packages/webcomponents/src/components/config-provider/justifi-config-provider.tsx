import { Component, Prop } from '@stencil/core';
import { setConfigState } from './config-state';
import { resolveOrigin } from './origin-allowlist';

@Component({
  tag: 'justifi-config-provider',
  shadow: false
})
export class JustifiConfigProvider {
  /**
   * Origin the SDK calls the JustiFi API through. Accepts only a canonical
   * `https://` origin on a known JustiFi host (`components.`, `wc-proxy.` or
   * `api.` on `justifi.ai`), or a `localhost` / `127.0.0.1` / `[::1]` origin
   * over http or https (any port). The `justifi-staging.com` hosts are
   * accepted only by a build whose own default is a staging or localhost
   * origin, so a production bundle cannot be pointed at staging. Any other
   * value is ignored with a `console.error` and the build default is used.
   */
  @Prop() apiOrigin?: string = PROXY_API_ORIGIN;
  /**
   * Origin the hosted-field iframes (card and bank account inputs) load from.
   * Same allowlist as `apiOrigin`: a canonical `https://` origin on a
   * production JustiFi host, a loopback host over http/https, or a staging
   * JustiFi host when the build's own default is non-production. Any other
   * value is ignored with a `console.error` and the build default is used.
   */
  @Prop() iframeOrigin?: string = IFRAME_ORIGIN;
  @Prop() accountId?: string = '';

  componentWillLoad() {
    setConfigState({
      apiOrigin: resolveOrigin('api-origin', this.apiOrigin, PROXY_API_ORIGIN),
      iframeOrigin: resolveOrigin('iframe-origin', this.iframeOrigin, IFRAME_ORIGIN),
      accountId: this.accountId
    });
  }

  render() {
    return null;
  }
}
