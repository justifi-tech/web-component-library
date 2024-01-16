import { Component, Host, h, Prop, State, Watch, Event, EventEmitter } from '@stencil/core';
import { Api, IApiResponseCollection, PagingInfo, Payment, pagingDefaults } from '../../api';
import { MapPaymentStatusToBadge, formatCurrency, formatDate, formatTime } from '../../utils/utils';
import { config } from '../../../config';

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
  @Prop() accountId: string;
  @Prop() authToken: string;
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

  async fetchData(): Promise<void> {
    if (!this.accountId || !this.authToken) {
      this.errorMessage = "Can not fetch any data without an AccountID and an AuthToken";
      this.loading = false;
      return;
    }

    this.loading = true;

    try {
      const api = Api(this.authToken, config.proxyApiOrigin);
      const endpoint = `account/${this.accountId}/payments`;

      const response: IApiResponseCollection<Payment[]> = await api.get(endpoint, this.params);

      if (!response.error) {
        this.paging = {
          ...this.paging,
          ...response.page_info
        }

        const data = response?.data?.map(dataItem => new Payment(dataItem));
        this.payments = data;
      } else {
        const responseError = typeof response.error === 'string' ? response.error : response.error.message;
        console.error(`Error fetching payments: ${responseError}`)
        this.errorMessage = 'No results';
      }
    } catch (error) {
      console.error(`Error fetching payments: ${error.message}`);
      this.errorMessage = 'No results';
    } finally {
      this.loading = false;
    }
  }

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
