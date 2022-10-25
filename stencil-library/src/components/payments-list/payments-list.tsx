import { Component, Host, h, Prop, State, Watch } from '@stencil/core';
import { Api, IApiResponseCollection, Payment } from '../../api';
import { formatCurrency, formatDate, formatTime } from '../../utils/utils';

@Component({
  tag: 'justifi-payments-list',
  styleUrl: 'payments-list.css',
  shadow: true,
})
export class PaymentsList {
  @Prop() accountId: string;
  @Prop() auth: { token?: string } = {};
  @State() payments: Payment[] = [];

  @Watch('accountId')
  @Watch('auth')
  requestPropsChanged() {
    this.fetchData();
  }

  fetchData(): void {
    const accountId = this.accountId;
    const endpoint = `account/${accountId}/payments`;
    Api(this.auth.token).get(endpoint)
      .then((response: IApiResponseCollection<Payment[]>) => {
        const data = response.data.map((dataItem) => new Payment(dataItem));
        this.payments = data;
      });
  };

  render() {
    return (
      <Host>
        <table class="justifi-table">
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
