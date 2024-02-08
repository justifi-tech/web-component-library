import { Component, Host, h, Prop, State, Watch, Event, EventEmitter } from '@stencil/core';
import { PagingInfo, Payment, pagingDefaults } from '../../api';
import { MapPaymentStatusToBadge, formatCurrency, formatDate, formatTime } from '../../utils/utils';
import { PaymentService } from '../../api/services/payment.service';

@Component({
  tag: 'payments-list-core',
  styleUrl: 'payments-list.scss',
})

export class PaymentsListCore {
  @Prop() accountId: string;
  @Prop() authToken: string;
  @Prop() paymentService: PaymentService;
  @State() payments: Payment[] = [];
  @State() loading: boolean = true;
  @State() errorMessage: string;
  @State() paging: PagingInfo = pagingDefaults;
  @State() params: any;
  @Event({
    eventName: 'payment-row-clicked',

    bubbles: true,
  }) rowClicked: EventEmitter<Payment>;

  @Watch('accountId')
  @Watch('authToken')
  @Watch('params')
  @Watch('paymentService')
  updateOnPropChange() {
    this.fetchData();
  }

  connectedCallback() {
    this.fetchData();
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

  onError(errorMessage) {
    this.payments = [];
    this.paging = pagingDefaults;
    this.errorMessage = errorMessage;
    this.loading = false;
    console.error(`Error fetching payments: ${errorMessage}`);
  }

  async fetchData(): Promise<void> {
    if (!this.accountId || !this.authToken) {
      this.onError('Cannot fetch data without an AccountID and an AuthToken');
      return;
    }

    if (!this.paymentService) {
      return;
    }

    this.loading = true;

    try {
      const response = await this.paymentService.fetchPayments(this.accountId, this.authToken, this.params);
      if (!response.error) {
        const pagingInfo = {
          ...response.page_info,
        };

        const payments =
          response.data?.map((dataItem) => new Payment(dataItem)) || [];

        this.payments = payments;
        this.paging = pagingInfo;
        this.loading = false;
      } else {
        const responseError =
          typeof response.error === 'string'
            ? response.error
            : response.error.message;

        return this.onError(responseError);
      }
    } catch (error) {
      return this.onError(error.message || error);
    }
  };

  render() {
    return (
      <Host>
        <justifi-table
          rowClickHandler={e => {
            const clickedPaymentID = e.target.closest('tr').dataset.rowEntityId;
            if (!clickedPaymentID) { return }
            this.rowClicked.emit(this.payments.find((payment) => payment.id === clickedPaymentID));
          }}
          entityId={this.payments.map((payment) => payment.id)}
          columnData={[
            ['Made On', 'The date and time each payment was made'],
            ['Amount', 'The dollar amount of each payment'],
            ['Description', 'The payment description, if you provided one'],
            ['Cardholder', 'The name associated with the payment method'],
            ['Payment Method', 'The brand and last 4 digits of the payment method'],
            ['Status', 'The current status of each payment'],
            ['Payment ID', 'The unique identifier of each payment']
          ]}
          rowData={
            this.payments.map((payment) => (
              [
                {
                  type: 'head',
                  value: `
                    <div>${formatDate(payment.created_at)}</div>
                    <div>${formatTime(payment.created_at)}</div>
                  `,
                },
                formatCurrency(payment.amount),
                payment.description,
                payment.payment_method.payersName,
                payment.payment_method.lastFourDigits,
                {
                  type: 'inner',
                  value: MapPaymentStatusToBadge(payment.status)
                },
                payment.id
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
