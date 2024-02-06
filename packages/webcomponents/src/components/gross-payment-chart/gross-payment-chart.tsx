import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'justifi-gross-payment-chart',
  styleUrl: 'gross-payment-chart.scss',
  shadow: true,
})
export class GrossPaymentChart {
  @Prop() accountId: string;
  @Prop() authToken: string;

  render() {
    return (
      <gross-payment-chart-core
        account-id={this.accountId}
        auth-token={this.authToken}
      ></gross-payment-chart-core>
    );
  }
}
