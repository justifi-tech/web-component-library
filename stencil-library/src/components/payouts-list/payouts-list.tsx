import { Component, Host, h, Prop, State, Watch } from '@stencil/core';
import { Api, IApiResponseCollection, Payout, PayoutStatuses } from '../../api';
import { formatCurrency, formatDate, formatTime } from '../../utils/utils';

interface PagingInfo {
  amount: number,
  start_cursor: string,
  end_cursor: string,
  has_previous: boolean,
  has_next: boolean,
}

const pagingDefaults = {
  amount: 25,
  start_cursor: '',
  end_cursor: '',
  has_previous: false,
  has_next: false,
}

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

  // onChangeAmount = (e) => {
  //   const newVal = e?.target?.value;
  //   if (newVal) {
  //     this.paging = pagingDefaults;
  //     this.paging.amount = newVal;
  //     this.fetchData();
  //   }
  // }

  onPageChange = (direction: string) => {
    return () => {
      this.fetchData(direction);
    }
  }

  mapStatusToBadge = (status: PayoutStatuses) => {
    switch (status) {
      case PayoutStatuses.scheduled || PayoutStatuses.in_transit:
        return 'bg-primary';
      case PayoutStatuses.failed || PayoutStatuses.canceled:
        return 'bg-danger';
      case PayoutStatuses.forwarded:
        return 'bg-secondary';
      case PayoutStatuses.paid:
        return 'bg-success';
      default:
        return 'bg-secondary';
    }
  }

  async fetchData(direction?: string): Promise<void> {
    if (!this.accountId || !this.authToken) {
      this.errorMessage = "Can not fetch any data without an AccountID and an AuthToken";
      this.loading = false;
      return;
    }
    this.loading = true;
    const limit = this.paging.amount;
    const cursor = `${
      direction === 'prev'
      ? '&before_cursor='+this.paging.start_cursor
      : direction === 'next'
        ? '&after_cursor='+this.paging.end_cursor
        : ''
    }`;
    const endpoint = `account/${this.accountId}/payouts?limit=${limit}${cursor ? cursor : ''}`;

    const response: IApiResponseCollection<Payout[]> = await Api(this.authToken).get(endpoint);
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

  showEmptyState() {
    return this.payouts ? this.payouts.length < 1 : true;
  }

  emptyState = (
    <tr>
      <td class="empty-state" part="empty-state" colSpan={10} style={{ textAlign: 'center' }}>No payouts to show</td>
    </tr>
  );

  errorState = () => (
    <tr>
      <td class="error-state" part="error-state" colSpan={10} style={{ textAlign: 'center' }}>
        An unexpected error occurred: {this.errorMessage}
      </td>
    </tr>
  );

  loadingState = (
    <tr>
      <td class="loading-state" part="loading-state-cell" colSpan={10} style={{ textAlign: 'center' }}>
        <div part="loading-state-spinner" class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </td>
    </tr>
  );

  paginationBar = () => {
    return (
      <div class="pagination-bar d-flex justify-content-center gap-3">
        <button
          onClick={this.onPageChange('prev')}
          part={`arrow arrow-left${this.paging.has_previous ? '' : ' arrow-disabled'}`}
          disabled={!this.paging.has_previous}
          class={`btn btn-primary pagination-btn pagination-prev-btn${this.paging.has_previous ? '' : ' disabled'}`}
        >&larr;</button>
        {/* <select class="amount-select" part="amount-select" onChange={this.onChangeAmount}>
          <option selected={this.paging.amount === 10} value={10}>10</option>
          <option selected={this.paging.amount === 25} value={25}>25</option>
          <option selected={this.paging.amount === 50} value={50}>50</option>
        </select> */}
        <button
          onClick={this.onPageChange('next')}
          part={`arrow arrow-right${this.paging.has_next ? '' : ' arrow-disabled'}`}
          disabled={!this.paging.has_next}
          class={`btn btn-primary pagination-btn pagination-next-btn${this.paging.has_next ? '' : ' disabled'}`}
        >&rarr;</button>
      </div>
    )
  };

  render() {
    return (
      <Host exportparts="
        table-head,table-head-row,table-head-cell,table-body,table-row,table-cell,
        loading-state-cell,loading-state-spinner,error-state,empty-state,
        pagination-bar,arrow,arrow-left,arrow-right,arrow-disabled
      ">
        <table class="table table-hover">
          <thead class="table-head sticky-top" part="table-head">
            <tr class="table-light" part='table-head-row'>
              <th part="table-head-cell" scope="col" title="The date and time each payment was made">
                Paid Out On
              </th>
              <th part="table-head-cell" scope="col">
                Type
              </th>
              <th part="table-head-cell" scope="col">Account</th>
              <th part="table-head-cell" scope="col">Paid Out To</th>
              <th part="table-head-cell" scope="col">Payments</th>
              <th part="table-head-cell" scope="col">Refunds</th>
              <th part="table-head-cell" scope="col">Fees</th>
              <th part="table-head-cell" scope="col">Other</th>
              <th part="table-head-cell" scope="col">Payout Amount</th>
              <th part="table-head-cell" scope="col">Status</th>
            </tr>
          </thead>
          <tbody class="table-body" part='table-body'>
            {
              this.loading ? this.loadingState :
              this.errorMessage ? this.errorState() :
              this.showEmptyState() ? this.emptyState :
              this.payouts?.map((payout, index) =>
                <tr part={`table-row${index%2 ? ' table-row-even' : ' table-row-odd'}`}>
                  <th scope="row" part="table-cell">
                    <div>{formatDate(payout.created_at)}</div>
                    <div>{formatTime(payout.created_at)}</div>
                  </th>
                  <td part="table-cell">{payout.payout_type}</td>
                  <td part="table-cell">{payout.account_id}</td>
                  <td part="table-cell">{payout.bank_account.full_name} {payout.bank_account.account_number_last4}</td>
                  <td part="table-cell">{formatCurrency(payout.payments_total)}</td>
                  <td part="table-cell">{formatCurrency(payout.refunds_total)}</td>
                  <td part="table-cell">{formatCurrency(payout.fees_total)}</td>
                  <td part="table-cell">{formatCurrency(payout.other_total)}</td>
                  <td part="table-cell">{formatCurrency(payout.amount)}</td>
                  <td part="table-cell"><span class={`badge ${this.mapStatusToBadge(payout.status)}`}>{payout.status}</span></td>
                </tr>
              )
            }
          </tbody>
          {this.paging &&
            <tfoot class="sticky-bottom">
              <tr class="table-light align-middle">
                <td part="pagination-bar" colSpan={10}>
                  {this.paginationBar()}
                </td>
              </tr>
            </tfoot>
          }
        </table>
      </Host>
    );
  }
}
