import { Component, Host, h, Prop, State, Watch } from '@stencil/core';
import { Api, IApiResponseCollection, Payout } from '../../api';

/**
  * @exportedPart detail-loading-spinner
  * @exportedPart detail-loading-state
  * @exportedPart detail-empty-state
  * @exportedPart detail-head
  * @exportedPart detail-title
  * @exportedPart detail-method
  * @exportedPart detail-info
  * @exportedPart detail-info-item
  * @exportedPart detail-info-item-title
  * @exportedPart detail-info-item-data
  * @exportedPart detail-metadata
  * @exportedPart detail-metadata-title
  * @exportedPart detail-method-title
  * @exportedPart detail-method-data
*/
@Component({
  tag: 'justifi-payout-details',
  styleUrl: 'payout-details.scss',
  shadow: true,
})

export class PaymentDetails {
  @Prop() payoutId: string;
  @Prop() authToken: string;
  @State() payout: Payout;
  @State() loading: boolean = true;
  @State() errorMessage: string;

  @Watch('payoutId')
  @Watch('authToken')
  updateOnPropChange() {
    this.fetchData();
  }

  connectedCallback() {
    this.fetchData();
  }

  async fetchData(): Promise<void> {
    this.errorMessage = '';
    if (!this.payoutId || !this.authToken) {
      this.errorMessage = "Can not fetch any data without a PayoutID and an AuthToken";
      this.loading = false;
      return;
    }
    this.loading = true;
    const endpoint = `payouts/${this.payoutId}`;

    const response: IApiResponseCollection<Payout> = await Api(this.authToken).get(endpoint);
    if (!response.error) {
      this.payout = response.data;
    } else {
      this.errorMessage = typeof response.error === 'string' ? response.error : response.error.message;
    }

    this.loading = false;
  }

  render() {
    return (
      <Host>
        <justifi-details
          loading={this.loading}
          error-message={this.errorMessage}
          entity={this.payout}
        />
      </Host>
    );
  }
}
