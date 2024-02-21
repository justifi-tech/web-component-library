import { Component, Host, Prop, State, Watch, h } from '@stencil/core';
import { Chart, BarController, Colors, BarElement, CategoryScale, LinearScale, Legend, Tooltip, Title, ChartConfiguration } from 'chart.js'
import { GrossVolumeReport, GrossVolumeReportDate } from '../../api/GrossVolume';
import { generateChartOptions } from './chart-utils';
import { ErrorState, LoadingState } from '../details/utils';

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
@Component({
  tag: 'gross-payment-chart-core',
  styleUrl: 'gross-payment-chart.scss',
})

export class GrossPaymentChartCore {
  chart: Chart
  chartRef: HTMLCanvasElement

  @Prop() getGrossPayment: Function;
  @State() total: number;
  @State() dates: GrossVolumeReportDate[];
  @State() endDate: string;
  @State() loading: boolean = true;
  @State() errorMessage: string = '';

  componentDidLoad() {
    if (this.getGrossPayment) {
      this.fetchData();
    }
  }

  @Watch('getGrossPayment')
  propChanged() {
    if (this.getGrossPayment) {
      this.fetchData();
    }
  }

  async fetchData() {
    this.loading = true;

    this.getGrossPayment({
      onSuccess: (data: GrossVolumeReport) => {
        this.total = data.total;
        this.dates = data.dates;
        this.endDate = this.dates[this.dates.length - 1].date;
        this.loading = false;
        this.initChart();
        this.renderChart();
      },
      onError: (error: string) => {
        this.errorMessage = error;
        this.loading = false;
      }
    });
  }

  renderChart() {
    if (!this.chart) {
      this.initChart()
    } else {
      this.chart.update()
    }
  }

  initChart() {
    if (this.chartRef && this.endDate) {
      this.chart = new Chart(
        this.chartRef.getContext("2d"),
        generateChartOptions(this.total, this.dates, this.endDate) as ChartConfiguration
      );
    } else {
      this.errorMessage = 'No data to display';
    }
  }

  render() {
    return (
      <Host>
        {this.loading && LoadingState()}
        {!this.errorMessage ? <canvas id="chart" ref={(elem) => this.chartRef = elem} /> : ErrorState(this.errorMessage)}
      </Host>
    );
  }
} 
