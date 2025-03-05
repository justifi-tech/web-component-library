import { Component, h, Prop, State, Watch, Event, EventEmitter } from '@stencil/core';
import { Table } from '../../utils/table';
import { table, tableCell } from '../../styles/parts';
import { TableEmptyState, TableErrorState, TableLoadingState } from '../../ui-components';
import { pagingDefaults, PagingInfo } from '../../api';
import { terminalOrdersTableCells, terminalOrdersTableColumns } from './terminal-orders-table';
import { TerminalOrder } from '../../api';
import mockTerminalOrders from '../../../../../mockData/mockTerminalOrdersListSuccess.json';

@Component({
  tag: 'terminal-orders-list-core',
})

export class TerminalOrdersListCore {
  @Prop() getTerminalOrders: Function;
  @Prop() columns: string;

  @State() terminalOrders: TerminalOrder[] = mockTerminalOrders.data as TerminalOrder[];
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

  @Event({ eventName: 'error-event' }) errorEvent: EventEmitter<any>;

  componentWillLoad() {
    this.terminalOrdersTable = new Table<TerminalOrder>(this.terminalOrders, this.columns, terminalOrdersTableColumns, terminalOrdersTableCells);
    if (this.getTerminalOrders) {
      this.fetchData();
    }
  }

  fetchData(): void {
    this.loading = true;
    
    this.getTerminalOrders({
      params: {},
      onSuccess: async ({ terminalOrders, pagingInfo }) => {
        this.terminalOrders = terminalOrders;
        this.paging = pagingInfo;
        this.terminalOrdersTable.collectionData = this.terminalOrders;
      },
      onError: ({ error, code, severity }) => {
        this.errorMessage = error;
        this.errorEvent.emit({ error, code, severity });
      },
      final: () => { this.loading = false },
    });
  }

  handleClickPrevious = (beforeCursor: string) => {
    this.pagingParams = { before_cursor: beforeCursor };
  };

  handleClickNext = (afterCursor: string) => {
    this.pagingParams = { after_cursor: afterCursor };
  };

  rowClickHandler = (e) => {
    const clickedOrderId = e.target.closest('tr').dataset.rowEntityId;
    if (!clickedOrderId) return;
    console.log('clickedOrderId', clickedOrderId);
  };

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
      <div>
        <div class="table-wrapper">
          <table class="table table-hover" part={table}>
            <thead class="table-head sticky-top">
              <tr class="table-light text-nowrap">
                {this.terminalOrdersTable.columnData.map((column) => column)}
              </tr>
            </thead>
            <tbody class="table-body">
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
                  <td part={tableCell} colSpan={this.terminalOrdersTable.columnData.length}>
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
