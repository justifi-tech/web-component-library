import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'billing-form',
  styleUrl: 'billing-form.css',
  shadow: true,
})
export class BillingForm {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
