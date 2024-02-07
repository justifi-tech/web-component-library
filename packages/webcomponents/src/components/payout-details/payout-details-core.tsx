import { Component, Host, h, Prop, State, Watch } from '@stencil/core';
import { Payout } from '../../api';
import { MapPayoutStatusToBadge, formatCurrency, formatDate, formatTime } from '../../utils/utils';
import { CodeBlock, DetailItem, DetailSection, EntityHeadInfo, EntityHeadInfoItem, ErrorState, LoadingState } from '../details/utils';
import { PayoutService } from '../payouts-list/payout.service';

@Component({
  tag: 'payout-details-core',
  styleUrl: 'payout-details.scss',
})

export class PayoutDetailsCore {
  @Prop() payoutId: string;
  @Prop() authToken: string;
  @Prop() payoutService: PayoutService;
  @State() payout: Payout;
  @State() loading: boolean = true;
  @State() errorMessage: string = null;

  @Watch('payoutId')
  @Watch('authToken')
  @Watch('payoutService')
  updateOnPropChange() {
    this.fetchData();
  }

  connectedCallback() {
    this.fetchData();
  }

  async fetchData(): Promise<void> {
    if (!this.payoutId || !this.authToken) {
      this.errorMessage = "Can not fetch any data without a PayoutID and an AuthToken";
      this.loading = false;
      return;
    }

    if (!this.payoutService) {
      return;
    }

    this.loading = true;

    try {
      const response = await this.payoutService.fetchPayout(this.payoutId, this.authToken);

      if (!response.error) {
        this.payout = new Payout(response.data);
      } else {
        const responseError = typeof response.error === 'string' ? response.error : response.error.message;
        this.errorMessage = `Error fetching payout details: ${responseError}`;
        console.error(this.errorMessage);
      }
    } catch (error) {
      this.errorMessage = `Error fetching payout details: ${error}`;
      console.error(this.errorMessage);
    } finally {
      this.loading = false;
    }
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
