import { Component, Host, Prop, State, Watch, h } from '@stencil/core';
import { Api, IApiResponseCollection } from '../../api';
import { Chart, BarController, Colors, BarElement, CategoryScale, LinearScale, Legend, Tooltip, Title, ChartConfiguration } from 'chart.js'
import { GrossVolumeReport, GrossVolumeReportDate } from '../../api/GrossVolume';
import { generateChartOptions } from './chart-utils';
import { ErrorState } from '../details/utils';
import { config } from '../../../config';
import { ChartDataService } from './chart-data.service';

@Component({
  tag: 'gross-payment-chart-core',
  styleUrl: 'gross-payment-chart.scss',
  shadow: true,
})

export class GrossPaymentChartCore {
  chart: Chart
  chartRef: HTMLCanvasElement

  @Prop() accountId: string;
  @Prop() authToken: string;
  @Prop() dataService: ChartDataService
  @State() data: GrossVolumeReport;
  @State() total: number;
  @State() dates: GrossVolumeReportDate[];
  @State() endDate: string;
  @State() loading: boolean = true;
  @State() errorMessage: string = '';

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

    try {
      const api = Api(this.authToken, config.proxyApiOrigin);
      const endpoint = `account/${this.accountId}/reports/gross_volume`;
      const response: IApiResponseCollection<GrossVolumeReport> = await api.get(endpoint);
      console.log('response', response);

      if (!response.error) {
        this.total = response?.data.total;
        this.dates = response?.data.dates.reverse();
        this.endDate = this.dates[this.dates.length - 1].date;
      } else {
        this.errorMessage = `Error trying to fetch data : ${response.error}`;
        console.error(this.errorMessage);
      }
    } catch (error) {
      this.errorMessage = `Error trying to fetch data : ${error}`;
      console.error(this.errorMessage);
    } finally {
      this.loading = false;
    }
  }

  renderChart() {
    if (this.chart) {
      this.chart.update()
    } else if (this.chartRef && this.endDate) {
      Chart.register(
        Colors,
        BarController,
        BarElement,
        CategoryScale,
        LinearScale,
        Legend,
        Tooltip,
        Title
      )
      this.chart = new Chart(
        this.chartRef.getContext("2d"),
        generateChartOptions(this.total, this.dates, this.endDate) as ChartConfiguration
      );
      this.chart.render()
    }
  }

  render() {
    return (
      <Host>
        {
          this.errorMessage ? ErrorState(this.errorMessage)
            : <canvas id="chart" ref={(elem) => this.chartRef = elem} />
        }
      </Host>
    );
  }
}

