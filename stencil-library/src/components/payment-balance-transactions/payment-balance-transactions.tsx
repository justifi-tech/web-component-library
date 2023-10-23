import { Component, Host, h, Prop, State } from '@stencil/core';
import {
  Api,
  IApiResponseCollection,
  IPaymentBalanceTransaction,
  PaymentBalanceTransaction,
} from '../../api';
import { PagingInfo, pagingDefaults } from '../table/table-utils';
import {
  formatCurrency,
  formatDate,
  formatTime,
  snakeCaseToHumanReadable,
} from '../../utils/utils';

@Component({
  tag: 'justifi-payment-balance-transactions',
  styleUrl: 'payment-balance-transactions.scss',
  shadow: true,
})
export class PaymentBalanceTransactions {
  @Prop() accountId: string;
  @Prop() authToken: string;
  @Prop() paymentId: string;
  @State() balanceTransactions: IPaymentBalanceTransaction[] = [];
  @State() loading: boolean = true;
  @State() errorMessage: string;
  @State() paging: PagingInfo = pagingDefaults;

  connectedCallback() {
    this.fetchData();
  }

  onPageChange = (direction: string) => {
    return () => {
      this.fetchData(direction);
    };
  };

  async fetchData(direction?: string): Promise<void> {
    this.loading = true;

    if (!this.accountId || !this.paymentId) {
      this.errorMessage = 'Missing required props: accountId or paymentId';
      this.loading = false;
      return;
    }
    const endpoint = `account/${this.accountId}/payments/${this.paymentId}/payment_balance_transactions`;

    const response: IApiResponseCollection<IPaymentBalanceTransaction[]> =
      await Api(this.authToken).get(endpoint, {
        paging: this.paging,
        direction: direction,
      });

    if (!response.error) {
      this.paging = {
        ...this.paging,
        ...response.page_info,
      };
      this.balanceTransactions = response.data.map(
        dataItem => new PaymentBalanceTransaction(dataItem),
      );
    } else {
      this.errorMessage =
        typeof response.error === 'string'
          ? response.error
          : response.error.message;
    }
    this.loading = false;
  }

  render() {
    return (
      <Host>
        <justifi-table
          columnData={[
            ['Processed On', 'The date each transaction occurred'],
            ['Type', 'The type of each transaction'],
            ['ID', 'The unique identifier of each transaction'],
            ['Amout', 'The dollar amount of each transaction'],
            [
              'Balance',
              'The running total amount of this payment that belongs to you',
            ],
          ]}
          entityId={this.balanceTransactions.map(transaction => transaction.id)}
          rowData={this.balanceTransactions.map(balanceTransaction => [
            <div>
              <div>{formatDate(balanceTransaction.created_at)}</div>
              <div>{formatTime(balanceTransaction.created_at)}</div>
            </div>,
            snakeCaseToHumanReadable(
              balanceTransaction.payment_balance_txn_type,
            ),
            balanceTransaction.payment_id,
            formatCurrency(balanceTransaction.amount),
            formatCurrency(balanceTransaction.balance),
          ])}
          loading={this.loading}
          error-message={this.errorMessage}
          paging={{
            ...this.paging,
            onPrev: this.onPageChange('prev'),
            onNext: this.onPageChange('next'),
          }}
        />
      </Host>
    );
  }
}
