import { Component, h, Prop, State, Watch, Event, EventEmitter } from '@stencil/core';
import { PagingInfo, Payment, pagingDefaults } from '../../api';
import { TableEmptyState, TableErrorState, TableLoadingState } from '../../ui-components';
import { paymentTableCells, paymentTableColumns } from './payments-table';
import { Table } from '../../utils/table';
import { getRequestParams, onQueryParamsChange } from './payments-list-params-state';
import { ComponentClickEvent, ComponentErrorEvent } from '../../api/ComponentEvents';
import { TableClickActions } from '../../ui-components/table/event-types';
import {
  TableWrapper,
  TableComponent,
  TableHead,
  TableHeadRow,
  TableBody,
  TableRow,
  TableFoot,
  TableFootRow,
  TableFootCell
} from '../../ui-components/table/table';

@Component({
  tag: 'payments-list-core'
})
export class PaymentsListCore {
  @Prop() getPayments: Function;
  @Prop() columns: string;

  @State() payments: Payment[] = [];
  @State() paymentsTable: Table<Payment>;
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

  @Event({ eventName: 'click-event', bubbles: true }) clickEvent: EventEmitter<ComponentClickEvent>;
  @Event({ eventName: 'error-event' }) errorEvent: EventEmitter<ComponentErrorEvent>;

  componentWillLoad() {
    this.paymentsTable = new Table<Payment>(this.payments, this.columns, paymentTableColumns, paymentTableCells);
    if (this.getPayments) {
      this.fetchData();
    }

    onQueryParamsChange('set', () => {
      this.pagingParams = {};
    });

    onQueryParamsChange('reset', () => {
      this.pagingParams = {};
      this.errorMessage = '';
    });
  }

  fetchData(): void {
    this.loading = true;

    this.getPayments({
      params: this.paymentParams,
      onSuccess: ({ payments, pagingInfo }) => {
        this.payments = payments;
        this.paging = pagingInfo;
        this.paymentsTable.collectionData = this.payments;
      },
      onError: ({ error, code, severity }) => {
        this.errorMessage = error;
        this.errorEvent.emit({
          errorCode: code,
          message: error,
          severity,
        });
      },
      final: () => {
        this.loading = false;
      }
    });
  }

  handleClickPrevious = (beforeCursor: string) => {
    this.pagingParams = { before_cursor: beforeCursor };
    this.clickEvent.emit({ name: TableClickActions.previous });
  };

  handleClickNext = (afterCursor: string) => {
    this.pagingParams = { after_cursor: afterCursor };
    this.clickEvent.emit({ name: TableClickActions.next });
  };

  rowClickHandler = (e) => {
    const clickedPaymentID = e.target.closest('tr').dataset.rowEntityId;
    if (!clickedPaymentID) return;

    const paymentData = this.payments.find((payment) => payment.id === clickedPaymentID);
    this.clickEvent.emit({ name: TableClickActions.row, data: paymentData });
  };

  get paymentParams() {
    const requestParams = getRequestParams();
    const params = { ...requestParams, ...this.pagingParams };
    return params;
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
      <TableWrapper>
        <TableComponent>
          <TableHead>
            <TableHeadRow>
              {this.paymentsTable.columnData.map((column) => column)}
            </TableHeadRow>
          </TableHead>
          <TableBody>
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
              <TableRow
                data-test-id="table-row"
                data-row-entity-id={this.entityId[index]}
                onClick={this.rowClickHandler}
              >
                {data}
              </TableRow>
            ))}
          </TableBody>
          {this.paging && (
            <TableFoot>
              <TableFootRow>
                <TableFootCell colSpan={this.paymentsTable.columnData.length}>
                  <pagination-menu
                    paging={{
                      ...this.paging,
                      handleClickPrevious: this.handleClickPrevious,
                      handleClickNext: this.handleClickNext,
                    }}
                  />
                </TableFootCell>
              </TableFootRow>
            </TableFoot>
          )}
        </TableComponent>
      </TableWrapper>
    );
  }
}
