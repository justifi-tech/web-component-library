import { Component, Host, Prop, State, Watch, h } from '@stencil/core';
import { Api, IApiResponseCollection } from '../../api';
import Chart from 'chart.js/auto'

interface GrossVolumeReportDate {
  date: string, value: number
}

interface GrossVolumeReport {
  total: number,
  dates: GrossVolumeReportDate[]
}

@Component({
  tag: 'justifi-gross-payment-chart',
  styleUrl: 'gross-payment-chart.scss',
  shadow: true,
})
export class GrossPaymentChart {
  chart: Chart
  ctx = document.getElementById('chart') as HTMLCanvasElement

  @Prop() accountId: string;
  @Prop() authToken: string;
  @State() data: GrossVolumeReport
  @State() loading: boolean;
  @State() errorMessage: string;

  @Watch('accountId')
  @Watch('authToken')
  updateOnPropChange() {
    this.fetchData();
    this.renderChart();
  }

  connectedCallback() {
    this.fetchData();
    this.renderChart();
  }

  async fetchData(): Promise<void> {
    if (!this.accountId || !this.authToken) {
      this.errorMessage = "Can not fetch any data without an AccountID and an AuthToken";
      this.loading = false;
      return;
    }

    this.loading = true;

    const api = Api(this.authToken, process.env.PRIVATE_API_ORIGIN);
    const endpoint = `account/${this.accountId}/reports/gross_volume`;
    const response: IApiResponseCollection<GrossVolumeReport> = await api.get(endpoint);

    if (!response.error) {
      this.data = response?.data;
      console.log(this.data);
    }
  }

  renderChart() {
    this.chart = new Chart(
      this.ctx,
      {
        type: 'bar',
        data: {
          datasets: [{
            label: 'Gross Volume',
            data: [1, 2, 3, 4, 5, 6]
          }]
        }
      }
    )
  }

  render() {
    return (
      <Host>
        <canvas id="chart" />
      </Host>
    );
  }

}
