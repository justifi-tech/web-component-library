import { Component, Host, Prop, State, Watch, h } from '@stencil/core';
import { Api, IApiResponseCollection } from '../../api';
import { Chart, BarController, Colors, BarElement, CategoryScale, LinearScale, Legend, Tooltip} from 'chart.js'
// import { mockGrossVolumeReport } from '../../api/mockData/mockGrossVolumeReport';
import { formatCurrency, formatDisplayDate } from '../../utils/utils';

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
  @State() data: GrossVolumeReport;
  @State() total: number;
  @State() dates: GrossVolumeReportDate[];
  @State() endDate: string;
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
      console.log(response.data);
      this.total = response?.data.total;
      this.dates = response?.data.dates.reverse();
      this.endDate = this.dates[this.dates.length - 1].date;
      console.log(this.endDate);
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
        Tooltip
      )
      this.chart = new Chart(
        this.chartRef.getContext("2d"),
        {
          type: 'bar',
          options: {
            plugins: {
              tooltip: {
                displayColors: false,
                callbacks: {
                  label: (context) => {
                    let index = context.dataIndex;
                    let date = formatDisplayDate(this.dates[index].date, this.endDate);
                    let value = formatCurrency(this.dates[index].value)
                    return [date, value]
                  },
                }
              }
            },
            scales: {
              x: {
                display: false
              },
              y: {
                display: false
              }
            }
          },
          data: {
            labels: this.dates.map(() => ''),
            datasets: [
              {
                label: 'Gross Volume Report',
                data: this.dates.map((date) => date.value),
                minBarLength: 5
                
              }]
          },
        }
      );
      this.chart.render()
    }
  }

  render() {
    return (
      <Host>
        <canvas id="chart" ref={(elem) => this.chartRef = elem} />
      </Host>
    );
  }

}
