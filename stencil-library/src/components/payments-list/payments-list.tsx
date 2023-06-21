import { Component, Host, h, Prop, State, Watch } from '@stencil/core';
import { Api, IApiResponseCollection, Payment } from '../../api';
import { formatCurrency, formatDate, formatTime } from '../../utils/utils';

/**
   *
   * @exportedPart table-head-row: Head row
   * @exportedPart table-head-cell: Individual head cell
   * @exportedPart table-body: Body of the table
   * @exportedPart table-row: Row of the table
   * @exportedPart table-cell: Individual cell of the table
   * @exportedPart loading-state-cell: Row for loading state
   * @exportedPart loading-state-spinner: Spinner element for loading state
   * @exportedPart error-state: Row for Error state
   * @exportedPart empty-state: Row for Emtpy state
   *
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
      this.errorMessage = "Can not fetch any data without an AccountID and an AuthToken"
      this.loading = false;
      return;
    }
    this.loading = true;
    const endpoint = `account/${this.accountId}/payments`;

    const response: IApiResponseCollection<Payment[]> = await Api(this.authToken).get(endpoint);
    if (!response.error) {
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
      <td part="empty-state" colSpan={8} style={{ textAlign: 'center' }}>No payments to show</td>
    </tr>
  );

  errorState = () => (
    <tr>
      <td part="error-state" colSpan={8} style={{ textAlign: 'center' }}>
        An unexpected error occurred: {this.errorMessage}
      </td>
    </tr>
  );

  loadingState = (
    <tr>
      <td part="loading-state-cell" colSpan={8} style={{ textAlign: 'center' }}>
        <div part="loading-state-spinner" class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </td>
    </tr>
  );

  render() {
    return (
      <Host exportparts="
        table-head-row,table-head-cell,table-body,
        loading-state-cell,loading-state-spinner,error-state,
        empty-state,table-row,table-cell
      ">
        <table class="table">
          <thead>
            <tr part='table-head-row'>
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
          <tbody part='table-body'>
            {
              this.loading ? this.loadingState :
              this.errorMessage ? this.errorState() :
              this.showEmptyState() ? this.emptyState :
              this.payments?.map(payment =>
                <tr part="table-row">
                  <td part="table-cell">
                    <div>{formatDate(payment.created_at)}</div>
                    <div>{formatTime(payment.created_at)}</div>
                  </td>
                  <td part="table-cell" >{formatCurrency(payment.amount)}</td>
                  <td part="table-cell" >{payment.description}</td>
                  <td part="table-cell" >{payment.payment_method?.card?.name}</td>
                  <td part="table-cell" >{payment.payment_method?.card?.acct_last_four}</td>
                  <td part="table-cell" >{payment.status}</td>
                  <td part="table-cell" >{payment.id}</td>
                </tr>
              )
            }
          </tbody>
        </table>
      </Host>
    );
  }
}
