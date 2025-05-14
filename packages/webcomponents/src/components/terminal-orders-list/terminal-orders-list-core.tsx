import { Component, h, Prop, State, Watch, Event, EventEmitter } from '@stencil/core';
import { Table } from '../../utils/table';
import { TableEmptyState, TableErrorState, TableLoadingState } from '../../ui-components';
import { ComponentClickEvent, ComponentErrorEvent, pagingDefaults, PagingInfo } from '../../api';
import { terminalOrdersTableCells, terminalOrdersTableColumns } from './terminal-orders-table';
import { TerminalOrder } from '../../api';
import { TableClickActions } from '../../ui-components/table/event-types';
import { getRequestParams, onQueryParamsChange } from './terminal-orders-list-params-state';
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
  tag: 'terminal-orders-list-core',
})

export class TerminalOrdersListCore {
  @Prop() getTerminalOrders: Function;
  @Prop() columns: string;

  @State() terminalOrders: TerminalOrder[] = [];
  @State() terminalOrdersTable: Table<TerminalOrder>;
  @State() loading: boolean = true;
  @State() errorMessage: string;
  @State() paging: PagingInfo = pagingDefaults;
  @State() pagingParams: any = {};

  @Watch('pagingParams')
  @Watch('getTerminalOrders')
  @Watch('columns')
  updateOnPropChange() {
    this.fetchData();
  }

  @Event({ eventName: 'click-event', bubbles: true }) clickEvent: EventEmitter<ComponentClickEvent>;
  @Event({ eventName: 'error-event' }) errorEvent: EventEmitter<ComponentErrorEvent>;
  
  componentWillLoad() {
    this.terminalOrdersTable = new Table<TerminalOrder>(this.terminalOrders, this.columns, terminalOrdersTableColumns, terminalOrdersTableCells);
    if (this.getTerminalOrders) {
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
    
    this.getTerminalOrders({
      params: this.terminalOrderParams,
      onSuccess: async ({ terminalOrders, pagingInfo }) => {
        this.terminalOrders = terminalOrders;
        this.paging = pagingInfo;
        this.terminalOrdersTable.collectionData = this.terminalOrders;
      },
      onError: ({ error, code, severity }) => {
        this.errorMessage = error;
        this.errorEvent.emit({
          errorCode: code,
          message: error,
          severity,
        });
      },
      final: () => { this.loading = false },
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
    const clickedOrderId = e.target.closest('tr').dataset.rowEntityId;
    if (!clickedOrderId) return;

    const orderData = this.terminalOrders.find((order) => order.id === clickedOrderId);
    this.clickEvent.emit({ name: TableClickActions.row, data: orderData });
  };

  get terminalOrderParams() {
    const requestParams = getRequestParams();
    const params = { ...requestParams, ...this.pagingParams };
    return params;
  }

  get entityId() {
    return this.terminalOrders.map((terminalOrder) => terminalOrder.id);
  }

  get showEmptyState() {
    return !this.loading && !this.errorMessage && this.terminalOrdersTable.rowData.length < 1;
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
              {this.terminalOrdersTable.columnData.map((column) => column)}
            </TableHeadRow>
          </TableHead>
          <TableBody>
            <TableLoadingState
              columnSpan={this.terminalOrdersTable.columnKeys.length}
              isLoading={this.loading}
            />
            <TableEmptyState
              isEmpty={this.showEmptyState}
              columnSpan={this.terminalOrdersTable.columnKeys.length}
            />
            <TableErrorState
              columnSpan={this.terminalOrdersTable.columnKeys.length}
              errorMessage={this.errorMessage}
            />
            {this.showRowData && this.terminalOrdersTable.rowData.map((data, index) => (
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
                <TableFootCell colSpan={this.terminalOrdersTable.columnData.length}>
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
