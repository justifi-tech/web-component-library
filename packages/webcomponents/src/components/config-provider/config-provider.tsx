import { Component, Prop } from '@stencil/core';
import { setConfigState } from './config-state';

@Component({
  tag: 'justifi-config-provider',
  shadow: false
})
export class ConfigProvider {
  @Prop() apiOrigin?: string = PROXY_API_ORIGIN;
  @Prop() iframeOrigin?: string = IFRAME_ORIGIN;
  @Prop() accountId?: string = '';

  componentWillLoad() {
    setConfigState({
      apiOrigin: this.apiOrigin,
      iframeOrigin: this.iframeOrigin,
      accountId: this.accountId
    });
  }

  render() {
    return null;
  }
}
