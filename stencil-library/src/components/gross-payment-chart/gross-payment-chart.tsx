import { Component, Host, Prop, State, Watch, h } from '@stencil/core';
import { Api, IApiResponseCollection } from '../../api';
import { Chart, BarController, Colors, BarElement, CategoryScale, LinearScale, Legend} from 'chart.js'
import { mockGrossVolumeReport } from '../../api/mockData/mockGrossVolumeReport';

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
  chartRef: HTMLCanvasElement

  @Prop() accountId: string;
  @Prop() authToken: string;
  @State() data: GrossVolumeReport = mockGrossVolumeReport;
  @State() loading: boolean;
  @State() errorMessage: string;

  @Watch('accountId')
  @Watch('authToken')
  updateOnPropChange() {
    this.fetchData();
  }

  connectedCallback() {
    this.fetchData();
  }
  
  componentDidRender() {
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
    console.log('renderChart fired');
    if (this.chart) {
      this.chart.update()
    } else if (this.chartRef) {
      Chart.register(
        Colors,
        BarController,
        BarElement,
        CategoryScale,
        LinearScale,
        Legend
      )
      this.chart = new Chart(
        this.chartRef.getContext("2d"),
        {
          type: 'bar',
          options: {
            
          },
          data: {
            labels: [1, 2, 3],
            datasets: [
              {
                label: 'Acquisitions by year',
                data: [1, 2, 3]
                
              }]
          },
        }
      );
      this.chart.render()
    }
  }

  render() {
    console.log('render fired');
    return (
      <Host>
        <canvas id="chart" ref={(elem) => this.chartRef = elem} />
      </Host>
    );
  }

}
