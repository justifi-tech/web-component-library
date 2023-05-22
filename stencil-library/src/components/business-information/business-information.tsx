import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'justifi-business-information',
  styleUrl: 'business-information.scss',
  shadow: true,
})
export class BusinessInformation {
  render() {
    return (
      <Host>
        <div>Business Information</div>
        <slot></slot>
      </Host>
    );
  }

}
