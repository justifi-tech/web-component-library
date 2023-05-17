import { Component, Host, h, Prop, State, Watch } from '@stencil/core';
import { Api, IApiResponseCollection, Payment } from '../../api';
import { formatCurrency, formatDate, formatTime } from '../../utils/utils';

@Component({
  tag: 'justifi-payments-list',
  styleUrl: 'payments-list.scss',
  shadow: true,
})
export class PaymentsList {
  @Prop() accountId: string;
  @Prop() authToken: string;
  @State() payments: Payment[] = [];

  @Watch('accountId')
  @Watch('authToken')
  requestPropsChanged() {
    console.log('this.authToken', this.authToken);
    this.fetchData();
  }

  fetchData(): void {
    const accountId = this.accountId;
    const endpoint = `account/${accountId}/payments`;
    Api(this.authToken).get(endpoint)
      .then((response: IApiResponseCollection<Payment[]>) => {
        const data = response.data.map((dataItem) => new Payment(dataItem));
        this.payments = data;
      });
  };

  showEmptyState() {
    return this.payments.length < 1;
  }

  emptyState = (
    <tr>
      <td colSpan={8} style={{ textAlign: 'center' }}>No payments to show</td>
    </tr>
  );

  render() {
    return (
      <Host>
        <table class="table">
          <thead>
            <tr>
              <th scope="col" title="The date and time each payment was made">Made on</th>
              <th scope="col" title="The dollar amount of each payment">Amount</th>
              <th scope="col">Account</th>
              <th scope="col">Description</th>
              <th scope="col">Payment ID</th>
              <th scope="col">Cardholder</th>
              <th scope="col">Payment Method</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {this.showEmptyState() && this.emptyState}
            {this.payments.map((payment) => {
              <tr>
                <td>
                  <div>{formatDate(payment.created_at)}</div>
                  <div>{formatTime(payment.created_at)}</div>
                </td>
                <td>{formatCurrency(payment.amount)}</td>
                <td>{payment.account_id}</td>
                <td>{payment.description}</td>
                <td>{payment.id}</td>
                <td>{payment.payment_method?.card?.name}</td>
                <td>{payment.payment_method?.card?.acct_last_four}</td>
                <td>{payment.status}</td>
              </tr>
            })}
          </tbody>
        </table>
      </Host>
    );
  }

}
