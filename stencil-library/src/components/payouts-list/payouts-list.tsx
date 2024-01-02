import { Component, Host, h, Prop, State, Watch, Event, EventEmitter } from '@stencil/core';
import {
  Api,
  IApiResponseCollection,
  PagingInfo,
  Payout,
  PayoutStatuses,
  PayoutStatusesSafeNames,
  pagingDefaults
} from '../../api';
import { formatCurrency, formatDate, formatTime } from '../../utils/utils';
import { config } from '../../../config';


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
  * @exportedPart button-disabled: Disabled state for paging buttons
  * @exportedPart previous-button-text: Text for Previous button
  * @exportedPart next-button-text: Text for Next button
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
  @State() params: any
  @Event({
    eventName: 'payout-row-clicked',
    bubbles: true,
  }) rowClicked: EventEmitter<Payout>;

  @Watch('accountId')
  @Watch('authToken')
  @Watch('params')
  updateOnPropChange() {
    this.fetchData();
  }

  connectedCallback() {
    this.fetchData();
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

  handleClickPrevious = (beforeCursor: string) => {
    const newParams: any = { ...this.params };
    delete newParams.after_cursor;
    this.params = ({ ...newParams, before_cursor: beforeCursor });
  };

  handleClickNext = (afterCursor: string) => {
    const newParams: any = { ...this.params };
    delete newParams.before_cursor;
    this.params = ({ ...newParams, after_cursor: afterCursor });
  };

  async fetchData(): Promise<void> {
    if (!this.accountId || !this.authToken) {
      this.errorMessage = "Can not fetch any data without an AccountID and an AuthToken";
      this.loading = false;
      return;
    }
    this.loading = true;

    const api = Api(this.authToken, config.proxyApiOrigin);
    const endpoint = `account/${this.accountId}/payouts`;

    const response: IApiResponseCollection<Payout[]> = await api.get(endpoint, this.params);
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
          rowClickHandler={(e) => {
            const clickedPayoutID = e.target.closest('tr').dataset.rowEntityId;
            if (!clickedPayoutID) { return }
            this.rowClicked.emit(this.payouts.find((payout) => payout.id === clickedPayoutID));
          }}
          columnData={[
            ['Paid Out On', 'The date each transaction occurred'],
            ['Type', 'The type of each transaction'],
            ['Account', 'The ID of the account associated with each payout'],
            ['Paid Out To', 'The bank account to which each payout was transferred'],
            ['Payments', 'Sum of payments in each payout'],
            ['Refunds', 'Sum of refunds in each payout'],
            ['Fees', 'Sum of fees in each payout'],
            ['Other', 'Sum of less common transactions in each payout (disputes, ACH returns, fee refunds, and forwarded balances due to failed payouts)'],
            ['Payout Amount', 'The net sum of all transactions in each payout. This is the amount you\'ll see reflected on your bank statement'],
            ['Status', 'The real-time status of each payout']
          ]}
          entityId={this.payouts.map((payout) => payout.id)}
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
          params={this.params}
          paging={{
            ...this.paging,
            handleClickNext: this.handleClickNext,
            handleClickPrevious: this.handleClickPrevious
          }}
        />
      </Host>
    );
  }
}
