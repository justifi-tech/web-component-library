import { Component, h, Prop, State, Watch, Event, EventEmitter } from '@stencil/core';
import { PagingInfo, Payment, PaymentsParams, pagingDefaults } from '../../api';
import { ComponentError } from '../../api/ComponentError';
import { TableEmptyState, TableErrorState, TableLoadingState } from '../../ui-components';
import { onFilterChange } from '../../ui-components/filters/utils';
import { paymentTableCells, paymentTableColumns } from './payments-table';
import { Table } from '../../utils/table';
import { table, tableCell } from '../../styles/parts';

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
  @State() params: PaymentsParams = {};

  @Watch('params')
  @Watch('getPayments')
  @Watch('columns')
  updateOnPropChange() {
    this.fetchData();
  }

  @Event({
    eventName: 'row-clicked',
    bubbles: true,
  }) rowClicked: EventEmitter<Payment>;

  @Event({ eventName: 'error-event' }) errorEvent: EventEmitter<ComponentError>;

  componentWillLoad() {
    this.paymentsTable = new Table(this.payments, this.columns, paymentTableColumns, paymentTableCells);
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
    this.errorMessage = '';
    this.params = {};
  }

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

  render() {
    return (
      <div>
        <payments-list-filters
          params={this.params}
          setParamsOnChange={this.setParamsOnChange}
          clearParams={this.clearParams}
        />
        <div class="table-wrapper">
          <table class="table table-hover" part={table}>
            <thead class="table-head sticky-top">
              <tr class="table-light text-nowrap">
                {this.paymentsTable.columnData.map((column) => column)}
              </tr>
            </thead>
            <tbody class="table-body">
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
                >
                  {data}
                </tr>
              ))}
            </tbody>
            {this.paging && (
              <tfoot class="sticky-bottom">
                <tr class="table-light align-middle">
                  <td part={tableCell} colSpan={this.paymentsTable.columnData.length}>
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
      </div>
    );
  }
}
