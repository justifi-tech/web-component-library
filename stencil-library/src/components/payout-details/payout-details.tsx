import { Component, Host, h, Prop, State, Watch } from '@stencil/core';
import { Api, IApiResponseCollection, Payout } from '../../api';
import { MapPayoutStatusToBadge, formatCurrency, formatDate, formatTime } from '../../utils/utils';
import { ErrorState, LoadingState } from '../details/utils';

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
        {
          this.loading ? LoadingState :
          !this.payout ? ErrorState(this.errorMessage) :
          <justifi-details
            error-message={this.errorMessage}
            entity={{
              title: `${formatCurrency(this.payout.amount)} ${this.payout.currency}`,
              entityHeadInfo: [
                {title: "Updated At", value: `${formatDate(this.payout.updated_at)} ${formatTime(this.payout.updated_at)}`},
                {title: "Created At", value: `${formatDate(this.payout.created_at)} ${formatTime(this.payout.created_at)}`},
                {title: "ID", value: this.payout.id}
              ],
              entitySections: [
                {
                  sectionTitle: "Details",
                  sectionDetails: [
                    {title: "Date paid", value: formatDate(this.payout.deposits_at)},
                    {title: "Statement Description", value: this.payout.description},
                    {title: "Payout Method", value: this.payout.delivery_method},
                    {title: "Amount", value: formatCurrency(this.payout.amount)},
                    {title: "Fee", value: formatCurrency(this.payout.fees_total)},
                  ]
                },
                {
                  sectionTitle: "Account",
                  sectionDetails: [
                    {title: "ID", value: this.payout.account_id},
                    {title: "Account Type", value: this.payout.bank_account.account_type},
                    {title: "Institution", value: this.payout.bank_account.account_type},
                    {title: "Routing Number", value: this.payout.bank_account.routing_number},
                    {title: "Account Number", value: this.payout.bank_account.account_number_last4},
                  ]
                }
              ],
              metadata: this.payout.metadata
            }}
          >
            <span slot='badge' innerHTML={MapPayoutStatusToBadge(this.payout?.status)} />
          </justifi-details>
        }
      </Host>
    )
  }
}
