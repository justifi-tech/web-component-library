import { Component, Host, h, Prop, State, Watch } from '@stencil/core';
import { IPayout, Payout } from '../../api';
import { MapPayoutStatusToBadge, formatCurrency, formatDate, formatTime } from '../../utils/utils';
import { CodeBlock, DetailItem, DetailSection, EntityHeadInfo, EntityHeadInfoItem, ErrorState, LoadingState } from '../details/utils';

@Component({
  tag: 'payout-details-core',
  styleUrl: 'payout-details.scss',
})

export class PayoutDetailsCore {
  @Prop() getPayout: Function;
  @State() payout: Payout;
  @State() loading: boolean = true;
  @State() errorMessage: string = null;

  componentWillLoad() {
    if (this.getPayout) {
      this.fetchData();
    }
  }

  @Watch('getPayout')
  getPayoutWatcher() {
    this.fetchData();
  }

  fetchData(): void {
    this.loading = true;

    this.getPayout({
      onSuccess: (payout: IPayout) => {
        this.errorMessage = null;
        this.payout = payout;
        this.loading = false;
      },
      onError: (errorMessage) => {
        this.errorMessage = errorMessage;
        console.error(this.errorMessage);
        this.loading = false;
      },
    });
  }

  render() {
    return (
      <Host>
        {this.loading && LoadingState()}
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
