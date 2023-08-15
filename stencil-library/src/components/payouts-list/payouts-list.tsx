import { Component, Host, h, Prop, State, Watch } from '@stencil/core';
import { Api, IApiResponseCollection, Payout, PayoutStatuses, PayoutStatusesSafeNames } from '../../api';
import { formatCurrency, formatDate, formatTime } from '../../utils/utils';
import { PagingInfo, pagingDefaults } from '../table/table-utils';

/**
  * @exportedPart table-head: Table head
  * @exportedPart table-head-row: Head row
  * @exportedPart table-head-cell: Individual head cell
  * @exportedPart table-body: Body of the table
  * @exportedPart table-row: Row of the table
  * @exportedPart table-cell: Individual cell of the table
  * @exportedPart loading-state-cell: Row for loading state
  * @exportedPart loading-state-spinner: Spinner element for loading state
  * @exportedPart error-state: Row for Error state
  * @exportedPart empty-state: Row for Emtpy state
  * @exportedPart pagination-bar: Pagination bar
  * @exportedPart arrow: Both paging buttons
  * @exportedPart arrow-left: Previous page button
  * @exportedPart arrow-right: Next page button
  * @exportedPart arrow-disabled: Disabled state for paging buttons
*/
@Component({
  tag: 'justifi-payouts-list',
  styleUrl: 'payouts-list.scss',
  shadow: true,
})

export class PayoutsList {
  @Prop() accountId: string;
  @Prop() authToken: string;
  @State() payouts: Payout[] = [];
  @State() loading: boolean = true;
  @State() errorMessage: string;
  @State() paging: PagingInfo = pagingDefaults;

  @Watch('accountId')
  @Watch('authToken')
  updateOnPropChange() {
    this.fetchData();
  }

  connectedCallback() {
    this.fetchData();
  }

  onPageChange = (direction: string) => {
    return () => {
      this.fetchData(direction);
    }
  }

  mapStatusToBadge = (status: PayoutStatuses) => {
    switch (status) {
      case PayoutStatuses.scheduled:
        return `<span class="badge bg-primary" title='Batched and scheduled to be transferred'>${PayoutStatusesSafeNames[status]}</span>`;
      case PayoutStatuses.in_transit:
        return `<span class="badge bg-primary" title='Transfer to your bank account has been initiated'>${PayoutStatusesSafeNames[status]}</span>`;
      case PayoutStatuses.failed:
        return `<span class="badge bg-danger" title='Transfer to your bank account failed'>${PayoutStatusesSafeNames[status]}</span>`;
      case PayoutStatuses.canceled:
        return `<span class="badge bg-danger" title='Transfer to your bank account failed'>${PayoutStatusesSafeNames[status]}</span>`;
      case PayoutStatuses.forwarded:
        return `<span class="badge bg-secondary" title='This payout initially failed; the funds have been forwarded to your next successful payout'>${PayoutStatusesSafeNames[status]}</span>`;
      case PayoutStatuses.paid:
        return `<span class="badge bg-success" title='Successfully deposited into your bank account'>${PayoutStatusesSafeNames[status]}</span>`;
    }
  }

  async fetchData(direction?: string): Promise<void> {
    if (!this.accountId || !this.authToken) {
      this.errorMessage = "Can not fetch any data without an AccountID and an AuthToken";
      this.loading = false;
      return;
    }
    this.loading = true;
    const endpoint = `account/${this.accountId}/payouts`;

    const response: IApiResponseCollection<Payout[]> = await Api(this.authToken).get(endpoint, {
      paging: this.paging,
      direction: direction
    });
    if (!response.error) {
      this.paging = {
        ...this.paging,
        ...response.page_info
      }

      const data = response?.data?.map(dataItem => new Payout(dataItem));
      this.payouts = data;
    } else {
      this.errorMessage = typeof response.error === 'string' ? response.error : response.error.message;
    }

    this.loading = false;
  }

  render() {
    return (
      <Host>
        <justifi-table
          columnData={[
            'Paid Out On',
            'Type',
            'Account',
            'Paid Out To',
            'Payments',
            'Refunds',
            'Fees',
            'Other',
            'Payout Amount',
            'Status'
          ]}
          rowData={
            this.payouts.map((payout) => (
              [
                {
                  type: 'head',
                  value: `
                    <div>${formatDate(payout.created_at)}</div>
                    <div>${formatTime(payout.created_at)}</div>
                  `,
                },
                payout.payout_type,
                payout.account_id,
                `${payout.bank_account.full_name} ${payout.bank_account.account_number_last4}`,
                formatCurrency(payout.payments_total),
                formatCurrency(payout.refunds_total),
                formatCurrency(payout.fees_total),
                formatCurrency(payout.other_total),
                formatCurrency(payout.amount),
                {
                  type: 'inner',
                  value: this.mapStatusToBadge(payout.status)
                }
              ]
            ))
          }
          loading={this.loading}
          error-message={this.errorMessage}
          paging={{
            ...this.paging,
            onPrev: this.onPageChange('prev'),
            onNext: this.onPageChange('next')
          }}
        />
      </Host>
    );
  }
}
