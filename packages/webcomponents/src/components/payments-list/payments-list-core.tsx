import { Component, h, Prop, State, Watch, Event, EventEmitter } from '@stencil/core';
import { PagingInfo, Payment, pagingDefaults } from '../../api';
import { MapPaymentStatusToBadge, formatCurrency, formatDate, formatTime } from '../../utils/utils';
import { ComponentError } from '../../api/ComponentError';
import StyledHost from '../../utils/styled-host/styled-host';

@Component({
  tag: 'payments-list-core'
})

export class PaymentsListCore {
  @Prop() getPayments: Function;

  @State() payments: Payment[] = [];
  @State() loading: boolean = true;
  @State() errorMessage: string;
  @State() paging: PagingInfo = pagingDefaults;
  @State() params: any;

  @Event({
    eventName: 'payment-row-clicked',
    bubbles: true,
  }) rowClicked: EventEmitter<Payment>;

  @Event({ eventName: 'error-event' }) errorEvent: EventEmitter<ComponentError>;

  componentWillLoad() {
    if (this.getPayments) {
      this.fetchData();
    }
  }

  @Watch('params')
  @Watch('getPayments')
  updateOnPropChange() {
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

  fetchData(): void {
    this.loading = true;

    this.getPayments({
      params: this.params,
      onSuccess: ({ payments, pagingInfo }) => {
        this.payments = payments;
        this.paging = pagingInfo;
        this.loading = false;
      },
      onError: ({ error, code, severity }) => {
        this.errorMessage = error;
        this.errorEvent.emit({
          errorCode: code,
          message: error,
          severity,
        });
        this.loading = false;
      },
    });
  };

  handleDateChange = (name: string, value: string) => {
    this.params = { ...this.params, [name]: value };
  }

  render() {
    return (
      <StyledHost>
        <div class="row gy-3 mb-4">
          <div class="col-2">
            <form-control-date
              name="created_after"
              label="Start Date"
              inputHandler={this.handleDateChange}
            />
          </div>
          <div class="col-2">
            <form-control-date
              name="created_before"
              label="End Date"
              inputHandler={this.handleDateChange}
            />
          </div>
        </div>
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
                    <div class='fw-bold'>${formatDate(payment.created_at)}</div>
                    <div class='fw-bold'>${formatTime(payment.created_at)}</div>
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
      </StyledHost>
    );
  }
}
