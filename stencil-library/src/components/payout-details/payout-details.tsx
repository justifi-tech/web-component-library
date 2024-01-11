import { Component, Host, h, Prop, State, Watch } from '@stencil/core';
import { Api, IApiResponseCollection, Payout } from '../../api';
import { MapPayoutStatusToBadge, formatCurrency, formatDate, formatTime } from '../../utils/utils';
import { CodeBlock, DetailItem, DetailSection, EntityHeadInfo, EntityHeadInfoItem, ErrorState, LoadingState } from '../details/utils';
import { config } from '../../../config';

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
  * @exportedPart detail-section
  * @exportedPart detail-section-title
  * @exportedPart detail-section-item-title
  * @exportedPart detail-section-item-data
  * @exportedPart detail-head-info
  * @exportedPart detail-head-info-item
  * @exportedPart detail-head-info-item-title
  * @exportedPart detail-head-info-item-data
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

    const response: IApiResponseCollection<Payout> = await Api(this.authToken, config.proxyApiOrigin).get(endpoint);
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
        {this.loading && LoadingState}
        {!this.loading && this.errorMessage && ErrorState(this.errorMessage)}
        {!this.loading && this.payout && (
          <justifi-details error-message={this.errorMessage}>
            <EntityHeadInfo slot="head-info" badge={<span slot='badge' innerHTML={MapPayoutStatusToBadge(this.payout?.status)} />} title={`${formatCurrency(this.payout.amount)} ${this.payout.currency.toUpperCase()}`}>
              <EntityHeadInfoItem
                classes="border-1 border-end"
                title="Updated At"
                value={`${formatDate(this.payout.updated_at)} ${formatTime(this.payout.updated_at)}`}
              />
              <EntityHeadInfoItem
                classes="border-1 border-end"
                title="Created At"
                value={`${formatDate(this.payout.created_at)} ${formatTime(this.payout.created_at)}`}
              />
              <EntityHeadInfoItem title="ID" value={this.payout.id} />
            </EntityHeadInfo>
            <div slot='detail-sections'>
              <DetailSection sectionTitle="Details">
                <DetailItem title="Date paid" value={formatDate(this.payout.deposits_at)} />
                <DetailItem title="Statement Description" value={this.payout.description} />
                <DetailItem title="Payout Method" value={this.payout.delivery_method} />
                <DetailItem title="Amount" value={formatCurrency(this.payout.amount)} />
                <DetailItem title="Fee" value={formatCurrency(this.payout.fees_total)} />
              </DetailSection>
              <DetailSection sectionTitle="Account">
                <DetailItem title="ID" value={this.payout.account_id} />
                <DetailItem title="Account Type" value={this.payout.bank_account.account_type} />
                <DetailItem title="Institution" value={this.payout.bank_account.account_type} />
                <DetailItem title="Routing Number" value={this.payout.bank_account.routing_number} />
                <DetailItem title="Account Number" value={this.payout.bank_account.account_number_last4} />
              </DetailSection>
              <DetailSection sectionTitle='Metadata'>
                <CodeBlock metadata={this.payout.metadata} />
              </DetailSection>
            </div>
          </justifi-details>
        )}
      </Host>
    )
  }
}