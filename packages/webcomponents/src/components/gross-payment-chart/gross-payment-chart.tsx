import { Component, Prop, h } from '@stencil/core';
import { ChartDataService } from './chart-data.service';

@Component({
  tag: 'justifi-gross-payment-chart',
  styleUrl: 'gross-payment-chart.scss',
  shadow: true,
})
export class GrossPaymentChart {
  @Prop() accountId: string;
  @Prop() authToken: string;
  private dataService = new ChartDataService();

  render() {
    return (
      <gross-payment-chart-core
        account-id={this.accountId}
        auth-token={this.authToken}
        dataService={this.dataService}
      ></gross-payment-chart-core>
    );
  }
}
