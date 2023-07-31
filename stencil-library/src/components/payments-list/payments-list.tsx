import { Component, Host, h, Prop, State, Watch } from '@stencil/core';
import { Api, IApiResponseCollection, Payment } from '../../api';
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
  tag: 'justifi-payments-list',
  styleUrl: 'payments-list.scss',
  shadow: true,
})

export class PaymentsList {
  @Prop() accountId: string;
  @Prop() authToken: string;
  @State() payments: Payment[] = [];
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
    const endpoint = `account/${this.accountId}/payments?limit=${limit}${cursor ? cursor : ''}`;

    const response: IApiResponseCollection<Payment[]> = await Api(this.authToken).get(endpoint);
    if (!response.error) {
      this.paging = {
        ...this.paging,
        ...response.page_info
      }

      const data = response?.data?.map(dataItem => new Payment(dataItem));
      this.payments = data;
    } else {
      this.errorMessage = typeof response.error === 'string' ? response.error : response.error.message;
    }

    this.loading = false;
  }

  showEmptyState() {
    return this.payments ? this.payments.length < 1 : true;
  }

  emptyState = (
    <tr>
      <td class="empty-state" part="empty-state" colSpan={8} style={{ textAlign: 'center' }}>No payments to show</td>
    </tr>
  );

  errorState = () => (
    <tr>
      <td class="error-state" part="error-state" colSpan={8} style={{ textAlign: 'center' }}>
        An unexpected error occurred: {this.errorMessage}
      </td>
    </tr>
  );

  loadingState = (
    <tr>
      <td class="loading-state" part="loading-state-cell" colSpan={8} style={{ textAlign: 'center' }}>
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
                Made on
              </th>
              <th part="table-head-cell" scope="col" title="The dollar amount of each payment">
                Amount
              </th>
              <th part="table-head-cell" scope="col">Description</th>
              <th part="table-head-cell" scope="col">Cardholder</th>
              <th part="table-head-cell" scope="col">Payment Method</th>
              <th part="table-head-cell" scope="col">Status</th>
              <th part="table-head-cell" scope="col">Payment ID</th>
            </tr>
          </thead>
          <tbody class="table-body" part='table-body'>
            {
              this.loading ? this.loadingState :
              this.errorMessage ? this.errorState() :
              this.showEmptyState() ? this.emptyState :
              this.payments?.map((payment, index) =>
                <tr part={`table-row${index%2 ? ' table-row-even' : ' table-row-odd'}`}>
                  <th scope="row" part="table-cell">
                    <div>{formatDate(payment.created_at)}</div>
                    <div>{formatTime(payment.created_at)}</div>
                  </th>
                  <td part="table-cell">{formatCurrency(payment.amount)}</td>
                  <td part="table-cell">{payment.description}</td>
                  <td part="table-cell">{payment.payment_method?.card?.name}</td>
                  <td part="table-cell">{payment.payment_method?.card?.acct_last_four}</td>
                  <td part="table-cell">{payment.status}</td>
                  <td part="table-cell">{payment.id}</td>
                </tr>
              )
            }
          </tbody>
          {this.paging &&
            <tfoot class="sticky-bottom">
              <tr class="table-light align-middle">
                <td part="pagination-bar" colSpan={7}>
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
