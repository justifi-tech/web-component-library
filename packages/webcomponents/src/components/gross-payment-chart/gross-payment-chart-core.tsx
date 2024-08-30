import { Component, Event, EventEmitter, Host, Prop, State, Watch, h } from '@stencil/core';
import { Chart, BarController, Colors, BarElement, CategoryScale, LinearScale, Legend, Tooltip, Title, ChartConfiguration } from 'chart.js'
import { GrossVolumeReport } from '../../api/GrossVolume';
import { generateChartOptions } from './chart-utils';
import { ErrorState, LoadingState } from '../details/utils';
import { ComponentError } from '../../api/ComponentError';

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
  styleUrl: 'gross-payment-chart.css',
})

export class GrossPaymentChartCore {
  chart: Chart
  chartRef: HTMLCanvasElement

  @Prop() getGrossPayment: Function;
  @State() grossVolumeReport: GrossVolumeReport;
  @State() loading: boolean = true;
  @State() errorMessage: string = '';
  @Event({ eventName: 'error-event' }) errorEvent: EventEmitter<ComponentError>;

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

  @Watch('grossVolumeReport')
  grossVolumeReportChanged(grossVolumeReport: GrossVolumeReport) {
    if (grossVolumeReport) {
      if (!this.chart) {
        this.initChart(grossVolumeReport);
      } else {
        this.updateChartData(grossVolumeReport);
      }
    }
  }

  async fetchData() {
    this.loading = true;

    this.getGrossPayment({
      onSuccess: (data: GrossVolumeReport) => {
        this.loading = false;
        this.grossVolumeReport = data;
      },
      onError: ({ error, code, severity }) => {
        this.loading = false;
        this.errorMessage = error;

        this.errorEvent.emit({
          errorCode: code,
          message: error,
          severity,
        })
      }
    });
  }

  initChart(grossVolumeReport: GrossVolumeReport) {
    const { dates, total } = grossVolumeReport;
    const reversedDates = dates.reverse();
    const endDate = reversedDates[dates.length - 1].date;
    const chartOptions = generateChartOptions(total, reversedDates, endDate) as ChartConfiguration;
    this.chart = new Chart(this.chartRef.getContext('2d'), chartOptions);
  }

  updateChartData(grossVolumeReport: GrossVolumeReport) {
    const newData = grossVolumeReport.dates.map((date) => date.value);
    this.chart.data.datasets.forEach((dataset) => {
      dataset.data = newData;
    });
    this.chart.update();
  }

  disconnectedCallback() {
    if (this.chart) {
      this.chart.destroy();
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
