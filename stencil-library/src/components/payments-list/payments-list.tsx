import { Component, Host, h, Prop, State, Watch } from '@stencil/core';
import { Api, IApiResponseCollection, Payment } from '../../api';
import { formatCurrency, formatDate, formatTime } from '../../utils/utils';

/**
   *
   * @exportedPart table-head: Head of the table
   * @exportedPart table-body: Body of the table
   * @exportedPart loading-state: Row for loading state
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
    <tr part="empty-state">
      <td colSpan={8} style={{ textAlign: 'center' }}>No payments to show</td>
    </tr>
  );

  errorState = () => (
    <tr part="error-state">
      <td colSpan={8} style={{ textAlign: 'center' }}>
        <span>An unexpected error occurred: {this.errorMessage}</span>
      </td>
    </tr>
  );

  loadingState = (
    <tr part="loading-state">
      <td colSpan={8} style={{ textAlign: 'center' }}>
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </td>
    </tr>
  );

  render() {
    return (
      <Host exportparts="table-head,table-body,loading-state,error-state,empty-state">
        <table class="table">
          <thead part='table-head'>
            <tr>
              <th scope="col" title="The date and time each payment was made">
                Made on
              </th>
              <th scope="col" title="The dollar amount of each payment">
                Amount
              </th>
              <th scope="col">Description</th>
              <th scope="col">Cardholder</th>
              <th scope="col">Payment Method</th>
              <th scope="col">Status</th>
              <th scope="col">Payment ID</th>
            </tr>
          </thead>
          <tbody part='table-body'>
            {
              this.loading ? this.loadingState :
              this.errorMessage ? this.errorState() :
              this.showEmptyState() ? this.emptyState :
              this.payments?.map(payment =>
                <tr>
                  <td>
                    <div>{formatDate(payment.created_at)}</div>
                    <div>{formatTime(payment.created_at)}</div>
                  </td>
                  <td>{formatCurrency(payment.amount)}</td>
                  <td>{payment.description}</td>
                  <td>{payment.payment_method?.card?.name}</td>
                  <td>{payment.payment_method?.card?.acct_last_four}</td>
                  <td>{payment.status}</td>
                  <td>{payment.id}</td>
                </tr>
              )
            }
          </tbody>
        </table>
      </Host>
    );
  }
}
