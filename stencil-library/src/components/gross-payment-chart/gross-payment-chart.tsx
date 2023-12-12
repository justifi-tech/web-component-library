import { Component, Host, Prop, State, Watch, h } from '@stencil/core';
import { Api, IApiResponseCollection } from '../../api';

@Component({
  tag: 'justifi-gross-payment-chart',
  styleUrl: 'gross-payment-chart.scss',
  shadow: true,
})
export class GrossPaymentChart {
  @Prop() accountId: string;
  @Prop() authToken: string;
  @State() loading: boolean = true;
  @State() errorMessage: string;

  @Watch('accountId')
  @Watch('authToken')
  updateOnPropChange() {
    this.fetchData();
  }

  connectedCallback() {
    this.fetchData();
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
    const response: IApiResponseCollection<any> = await api.get(endpoint);

    if (!response.error) {
      const data = response?.data;
      console.log(data);
    }
  }

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
