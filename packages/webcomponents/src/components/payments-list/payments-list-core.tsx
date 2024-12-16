import { Component, h, Prop, State, Watch, Event, EventEmitter } from '@stencil/core';
import { PagingInfo, Payment, pagingDefaults } from '../../api';
import { ComponentError } from '../../api/ComponentError';
import { TableEmptyState, TableErrorState, TableLoadingState } from '../../ui-components';
import { paymentTableCells, paymentTableColumns } from './payments-table';
import { Table } from '../../utils/table';
import { queryParams, onQueryParamsChange } from './payments-list-params-state';

@Component({
  tag: 'payments-list-core'
})
export class PaymentsListCore {
  @Prop() getPayments: Function;
  @Prop() columns: string;

  @State() payments: Payment[] = [];
  @State() paymentsTable: Table;
  @State() loading: boolean = true;
  @State() errorMessage: string;
  @State() paging: PagingInfo = pagingDefaults;
  @State() pagingParams: any = {};
  
  @Watch('pagingParams')
  @Watch('getPayments')
  @Watch('columns')
  updateOnPropChange() {
    this.fetchData();
  }

  @Event({
    eventName: 'payment-row-clicked',
    bubbles: true,
  }) rowClicked: EventEmitter<Payment>;

  @Event({ eventName: 'error-event' }) errorEvent: EventEmitter<ComponentError>;

  componentWillLoad() {
    this.paymentsTable = new Table(this.payments, this.columns, paymentTableColumns, paymentTableCells);
    if (this.getPayments) {
      this.fetchData();
    }

    onQueryParamsChange('set', () => {
      Object.keys(this.pagingParams).forEach((key) => {
        delete this.pagingParams[key];
      });
      this.fetchData();
    });

    onQueryParamsChange('reset', () => {
      this.pagingParams = {};
    });
  }

  fetchData(): void {
    this.loading = true;
    let requestParams = this.requestParams;
    this.getPayments({
      params: requestParams,
      onSuccess: ({ payments, pagingInfo }) => {
        this.payments = payments;
        this.paging = pagingInfo;
        this.paymentsTable.collectionData = this.payments;
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
    const newParams: any = { ...this.pagingParams };
    delete newParams.after_cursor;
    this.pagingParams = { ...newParams, before_cursor: beforeCursor };
  };

  handleClickNext = (afterCursor: string) => {
    const newParams: any = { ...this.pagingParams };
    delete newParams.before_cursor;
    this.pagingParams = { ...newParams, after_cursor: afterCursor };
  };

  rowClickHandler = (e) => {
    const clickedPaymentID = e.target.closest('tr').dataset.rowEntityId;
    if (!clickedPaymentID) return;
    this.rowClicked.emit(this.payments.find((payment) => payment.id === clickedPaymentID));
  };

  get entityId() {
    return this.payments.map((payment) => payment.id);
  }

  get showEmptyState() {
    return !this.loading && !this.errorMessage && this.paymentsTable.rowData.length < 1;
  }

  get showErrorState() {
    return !this.loading && !!this.errorMessage;
  }

  get showRowData() {
    return !this.showEmptyState && !this.showErrorState && !this.loading;
  }

  get requestParams() {
    const combinedParams = { ...queryParams, ...this.pagingParams };
    return combinedParams;
  }

  render() {
    return (
      <div>
        <div class="table-wrapper">
          <table class="table table-hover">
            <thead class="table-head sticky-top" part="table-head">
              <tr class="table-light text-nowrap" part="table-head-row">
                {this.paymentsTable.columnData.map((column) => column)}
              </tr>
            </thead>
            <tbody class="table-body" part="table-body">
              <TableLoadingState
                columnSpan={this.paymentsTable.columnData.length}
                isLoading={this.loading}
              />
              <TableEmptyState
                isEmpty={this.showEmptyState}
                columnSpan={this.paymentsTable.columnData.length}
              />
              <TableErrorState
                columnSpan={this.paymentsTable.columnData.length}
                errorMessage={this.errorMessage}
              />
              {this.showRowData && this.paymentsTable.rowData.map((data, index) => (
                <tr
                  data-test-id="table-row"
                  data-row-entity-id={this.entityId[index]}
                  onClick={this.rowClickHandler}
                  part={`table-row ${index % 2 ? "table-row-even" : "table-row-odd"}`}
                >
                  {data}
                </tr>
              ))}
            </tbody>
            {this.paging && (
              <tfoot class="sticky-bottom">
                <tr class="table-light align-middle">
                  <td part="pagination-bar" colSpan={this.paymentsTable.columnData.length}>
                    <pagination-menu
                      paging={{
                        ...this.paging,
                        handleClickPrevious: this.handleClickPrevious,
                        handleClickNext: this.handleClickNext,
                      }}
                    />
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    );
  }
}
