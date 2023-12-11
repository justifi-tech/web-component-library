import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'gross-payment-chart',
  styleUrl: 'gross-payment-chart.css',
  shadow: true,
})
export class GrossPaymentChart {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
