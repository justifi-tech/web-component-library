import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'justifi-theme-provider',
  shadow: true,
})
export class ThemeProvider {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
