import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'subaccount-details',
  styleUrl: 'subaccount-details.css',
  shadow: true,
})
export class SubaccountDetails {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
