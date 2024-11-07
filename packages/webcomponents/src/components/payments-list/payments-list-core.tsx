import { Component, h, Prop, State, Watch, Event, EventEmitter } from '@stencil/core';
import { PagingInfo, Payment, PaymentsParams, pagingDefaults } from '../../api';
import { MapPaymentStatusToBadge, formatCurrency, formatDate, formatTime } from '../../utils/utils';
import { ComponentError } from '../../api/ComponentError';
import { tableExportedParts } from '../table/exported-parts';
import { StyledHost, TableEmptyState, TableErrorState, TableLoadingState } from '../../ui-components';
import { onFilterChange } from '../../ui-components/filters/utils';

@Component({
  tag: 'payments-list-core'
})
export class PaymentsListCore {
  @State() payments: Payment[] = [];
  @State() loading: boolean = true;
  @State() errorMessage: string;
  @State() paging: PagingInfo = pagingDefaults;
  @State() params: PaymentsParams = {};
  
  @Prop() getPayments: Function;

  @Watch('params')
  @Watch('getPayments')
  updateOnPropChange() {
    this.fetchData();
  }

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
  }

  handleClickPrevious = (beforeCursor: string) => {
    const newParams: any = { ...this.params };
    delete newParams.after_cursor;
    this.params = { ...newParams, before_cursor: beforeCursor };
  };

  handleClickNext = (afterCursor: string) => {
    const newParams: any = { ...this.params };
    delete newParams.before_cursor;
    this.params = { ...newParams, after_cursor: afterCursor };
  };

  rowClickHandler = (e) => {
    const clickedPaymentID = e.target.closest('tr').dataset.rowEntityId;
    if (!clickedPaymentID) return;
    this.rowClicked.emit(this.payments.find((payment) => payment.id === clickedPaymentID));
  };

  setParamsOnChange = (name: string, value: string) => {
    let newParams = { [name]: value };
    this.params = onFilterChange(newParams, this.params);
  }

  clearParams = () => {
    this.params = {};
  }

  get entityId() {
    return this.payments.map((payment) => payment.id);
  }

  get columnData() {
    return [
      ['Date', 'The date and time each payment was made'],
      ['Amount', 'The dollar amount of each payment'],
      ['Status', 'The current status of each payment'],
      ['Type', 'The type of each payment'],
      ['Description', 'The payment description, if you provided one'],
      ['Account Holder', 'The name associated with the payment method'],
      ['Payment Method', 'The brand and last 4 digits of the payment method'],
    ];
  }

  get rowData() {
    return this.payments.map((payment) => [
      {
        type: 'head',
        value: `
          <div class="fw-bold">${formatDate(payment.created_at)}</div>
          <div class="fw-bold">${formatTime(payment.created_at)}</div>
        `,
      },
      formatCurrency(payment.amount),
      {
        type: 'inner',
        value: MapPaymentStatusToBadge(payment.status),
      },
      'payment type!',
      payment.description,
      payment.payment_method.payersName,
      payment.payment_method.lastFourDigits,
    ]);
  }

  get showEmptyState() {
    return !this.loading && !this.errorMessage && this.rowData.length < 1;
  }

  get showErrorState() {
    return !this.loading && !!this.errorMessage;
  }

  get showRowData() {
    return !this.showEmptyState && !this.showErrorState;
  }

  render() {
    return (
      <StyledHost exportparts={tableExportedParts}>
        <payments-list-filters 
          params={this.params} 
          setParamsOnChange={this.setParamsOnChange}
          clearParams={this.clearParams}
        />
        <div class="table-wrapper">
          <table class="table table-hover">
            <thead class="table-head sticky-top" part="table-head">
              <tr class="table-light text-nowrap" part="table-head-row">
                {this.columnData?.map((column) => (
                  <th part="table-head-cell" scope="col" title={Array.isArray(column) ? column[1] : ""}>
                    {!Array.isArray(column) ? column : column[0]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody class="table-body" part="table-body">
              <TableLoadingState
                columnSpan={this.columnData.length}
                isLoading={this.loading}
              />
              <TableEmptyState
                isEmpty={this.showEmptyState}
                columnSpan={this.columnData.length}
              />
              <TableErrorState
                columnSpan={this.columnData.length}
                errorMessage={this.errorMessage}
              />
              {this.showRowData &&
                this.rowData.map((data, index) => (
                  <tr
                    data-test-id="table-row"
                    data-row-entity-id={this.entityId[index]}
                    onClick={this.rowClickHandler}
                    part={`table-row ${index % 2 ? "table-row-even" : "table-row-odd"}`}
                  >
                    {data.map((dataEntry: any) => {
                      let nestedHtml = dataEntry?.type;
                      if (nestedHtml) {
                        return <td part="table-cell" innerHTML={dataEntry.value}></td>;
                      } else {
                        return <td part="table-cell">{dataEntry}</td>;
                      }
                    })}
                  </tr>
                ))}
            </tbody>
            {this.paging && (
              <tfoot class="sticky-bottom">
                <tr class="table-light align-middle">
                  <td part="pagination-bar" colSpan={this.columnData?.length}>
                    <pagination-menu
                      paging={{
                        ...this.paging,
                        handleClickPrevious: this.handleClickPrevious,
                        handleClickNext: this.handleClickNext,
                      }}
                      params={this.params}
                    />
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </StyledHost>
    );
  }
}
