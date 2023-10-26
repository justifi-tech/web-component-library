import {
  Component,
  Host,
  h,
  Prop,
  State,
  Watch,
  Event,
  EventEmitter,
} from '@stencil/core';
import {
  Api,
  IApiResponseCollection,
  IPaymentMethod,
  Payment,
} from '../../api';
import {
  MapPaymentStatusToBadge,
  formatCurrency,
  formatDate,
  formatTime,
} from '../../utils/utils';
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
 * @exportedPart button-disabled: Disabled state for paging buttons
 * @exportedPart previous-button-text: Text for Previous button
 * @exportedPart next-button-text: Text for Next button
 */
@Component({
  tag: 'justifi-payments-list',
  styleUrl: 'payments-list.scss',
  shadow: true,
})
export class PaymentsList {
  /**
   * The Account ID to fetch payments.
   * This is required to fetch any data.
   * @required
   * @type {string}
   * @memberof PaymentsList
   */
  @Prop() accountId: string;
  /**
   * The Auth Token to fetch payments.
   * This is required to fetch any data.
   * @required
   * @type {string}
   * @memberof PaymentsList
   */
  @Prop() authToken: string;
  @State() payments: Payment[] = [];
  @State() loading: boolean = true;
  @State() errorMessage: string;
  @State() paging: PagingInfo = pagingDefaults;
  /**
   * Emitted when a payment row is clicked.
   * Emits a Payment object.
   */
  @Event({
    eventName: 'payment-row-clicked',
    bubbles: true,
  })
  rowClicked: EventEmitter<Payment>;

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
    };
  };

  async fetchData(direction?: string): Promise<void> {
    if (!this.accountId || !this.authToken) {
      this.errorMessage =
        'Can not fetch any data without an AccountID and an AuthToken';
      this.loading = false;
      return;
    }
    this.loading = true;
    const endpoint = `account/${this.accountId}/payments`;

    const response: IApiResponseCollection<Payment[]> = await Api(
      this.authToken,
    ).get(endpoint, {
      paging: this.paging,
      direction: direction,
    });
    if (!response.error) {
      this.paging = {
        ...this.paging,
        ...response.page_info,
      };

      const data = response?.data?.map(dataItem => new Payment(dataItem));
      this.payments = data;
    } else {
      this.errorMessage =
        typeof response.error === 'string'
          ? response.error
          : response.error.message;
    }

    this.loading = false;
  }

  getPaymentMethod(paymentMethod: IPaymentMethod) {
    return paymentMethod.card || paymentMethod.bank_account;
  }

  render() {
    return (
      <Host>
        <justifi-table
          rowClickHandler={e => {
            const clickedPaymentID = e.target.closest('tr').dataset.rowEntityId;
            if (!clickedPaymentID) {
              return;
            }
            this.rowClicked.emit(
              this.payments.find(payment => payment.id === clickedPaymentID),
            );
          }}
          entityId={this.payments.map(payment => payment.id)}
          columnData={[
            ['Made On', 'The date and time each payment was made'],
            ['Amount', 'The dollar amount of each payment'],
            ['Description', 'The payment description, if you provided one'],
            ['Cardholder', 'The name associated with the payment method'],
            [
              'Payment Method',
              'The brand and last 4 digits of the payment method',
            ],
            ['Status', 'The current status of each payment'],
            ['Payment ID', 'The unique identifier of each payment'],
          ]}
          rowData={this.payments.map(payment => [
            {
              type: 'head',
              value: `
                    <div>${formatDate(payment.created_at)}</div>
                    <div>${formatTime(payment.created_at)}</div>
                  `,
            },
            formatCurrency(payment.amount),
            payment.description,
            this.getPaymentMethod(payment.payment_method).name,
            this.getPaymentMethod(payment.payment_method).acct_last_four,
            {
              type: 'inner',
              value: MapPaymentStatusToBadge(payment.status),
            },
            payment.id,
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
