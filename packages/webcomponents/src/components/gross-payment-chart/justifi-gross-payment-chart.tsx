import { Component, Event, EventEmitter, h, Prop, State, Watch } from '@stencil/core';
import {
  Chart,
  BarController,
  Colors,
  BarElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
  Title,
  ChartConfiguration,
} from 'chart.js';
import { ReportsService } from '../../api/services/reports.service';
import { makeGetGrossPaymentChartData } from '../../actions/gross-payment/get-gross-payment-chart-data';
import { ErrorState } from '../../ui-components/details/utils';
import { ComponentErrorCodes, ComponentErrorSeverity } from '../../api/ComponentError';
import JustifiAnalytics from '../../api/Analytics';
import { checkPkgVersion } from '../../utils/check-pkg-version';
import { ComponentErrorEvent } from '../../api/ComponentEvents';
import { GrossVolumeReport } from '../../api/GrossVolume';
import { generateChartOptions } from './chart-utils';
import Spinner from '../../ui-components/spinner';
import { StyledHost } from '../../ui-components';

Chart.register(Colors, BarController, BarElement, CategoryScale, LinearScale, Legend, Tooltip, Title);

@Component({
  tag: 'justifi-gross-payment-chart',
  shadow: true,
})
export class JustifiGrossPaymentChart {
  chart: Chart;
  chartRef: HTMLCanvasElement;

  @Prop() accountId!: string;
  @Prop() authToken!: string;

  @State() getGrossPayment: Function;
  @State() grossVolumeReport: GrossVolumeReport;
  @State() loading: boolean = true;
  @State() errorMessage: string = '';
  @State() wrapperErrorMessage: string = null;

  @Event({ eventName: 'error-event' }) errorEvent: EventEmitter<ComponentErrorEvent>;

  analytics: JustifiAnalytics;

  componentWillLoad() {
    checkPkgVersion();
    this.analytics = new JustifiAnalytics(this);
    this.initializeGetGrossPayment();
  }

  componentDidLoad() {
    if (this.getGrossPayment) {
      this.fetchData();
    }
  }

  disconnectedCallback() {
    this.analytics?.cleanup();
    if (this.chart) {
      this.chart.destroy();
    }
  }

  @Watch('accountId')
  @Watch('authToken')
  authPropChanged() {
    this.initializeGetGrossPayment();
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

  private initializeGetGrossPayment() {
    if (this.accountId && this.authToken) {
      this.wrapperErrorMessage = null;
      this.errorMessage = '';
      this.getGrossPayment = makeGetGrossPaymentChartData({
        id: this.accountId,
        authToken: this.authToken,
        service: new ReportsService(),
      });
    } else {
      this.getGrossPayment = undefined;
      this.wrapperErrorMessage = 'Account ID and Auth Token are required';
      this.errorEvent.emit({
        errorCode: ComponentErrorCodes.MISSING_PROPS,
        message: this.wrapperErrorMessage,
        severity: ComponentErrorSeverity.ERROR,
      });
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
        });
      },
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

  render() {
    if (this.wrapperErrorMessage) {
      return <StyledHost>{ErrorState(this.wrapperErrorMessage)}</StyledHost>;
    }

    return (
      <StyledHost>
        {this.loading && <Spinner />}
        {!this.errorMessage ? (
          <canvas id="chart" ref={(elem) => (this.chartRef = elem)} />
        ) : (
          ErrorState(this.errorMessage)
        )}
      </StyledHost>
    );
  }
}
