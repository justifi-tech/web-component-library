import { Component, h, Prop, State, Watch, Event, EventEmitter } from '@stencil/core';
import { PagingInfo, SubAccount, Terminal, pagingDefaults } from '../../api';
import { ComponentError } from '../../api/ComponentError';
import { TableEmptyState, TableErrorState, TableLoadingState } from '../../ui-components';
import { terminalTableColumns, terminalTableCells } from './terminals-table';
import { Table } from '../../utils/table';
import { queryParams, onQueryParamsChange } from './terminals-list-params-state';
import { table, tableCell } from '../../styles/parts';
import { ComponentClickEvent, TableClickActions } from '../../api/ComponentEvents';

@Component({
  tag: 'terminals-list-core'
})
export class TerminalsListCore {
  @Prop() getTerminals: Function;
  @Prop() getSubAccounts: Function;
  @Prop() columns: string;

  @State() terminals: Terminal[] = [];
  @State() terminalsTable: Table;
  @State() subAccounts: SubAccount[] = [];
  @State() loading: boolean = true;
  @State() errorMessage: string;
  @State() paging: PagingInfo = pagingDefaults;
  @State() pagingParams: any = {};
  
  @Watch('queryParams')
  @Watch('pagingParams')
  @Watch('getTerminals')
  @Watch('getSubAccounts')
  @Watch('columns')
  updateOnPropChange() {
    this.fetchData();
  }

  @Event({ eventName: 'click-event', bubbles: true }) clickEvent: EventEmitter<ComponentClickEvent>;
  @Event({ eventName: 'error-event' }) errorEvent: EventEmitter<ComponentError>;

  componentWillLoad() {
    this.terminalsTable = new Table(this.terminals, this.columns, terminalTableColumns, terminalTableCells);
    if (this.getTerminals && this.getSubAccounts) {
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

    this.getTerminals({
      params: this.requestParams,
      onSuccess: async ({ terminals, pagingInfo }) => {
        this.terminals = terminals;
        this.paging = pagingInfo;
        this.terminalsTable.collectionData = this.terminals;
        const shouldFetchSubAccounts = this.terminalsTable.columnKeys.includes('sub_account_name');

        if (shouldFetchSubAccounts) {
          await this.fetchSubAccounts();
        } else {
          this.loading = false;
        }

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

  async fetchSubAccounts(): Promise<void> {
    this.getSubAccounts({
      params: this.subAccountParams,
      onSuccess: ({ subAccounts }) => {
        this.subAccounts = subAccounts;
        this.terminals = this.terminals.map((terminal) => {
          terminal.sub_account_name = this.subAccounts.find((subAccount) => subAccount.id === terminal.account_id)?.name;
          return terminal;
        });
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
    this.pagingParams = { before_cursor: beforeCursor };
    this.clickEvent.emit({ name: TableClickActions.previous });
  };

  handleClickNext = (afterCursor: string) => {
    this.pagingParams = { after_cursor: afterCursor };
    this.clickEvent.emit({ name: TableClickActions.next });
  };

  rowClickHandler = (e) => {
    const clickedTerminalID = e.target.closest('tr').dataset.rowEntityId;
    if (!clickedTerminalID) return;

    const terminalData = this.terminals.find((terminal) => terminal.id === clickedTerminalID);
    this.clickEvent.emit({ name: TableClickActions.row, data: terminalData });
  };

  get requestParams() {
    const combinedParams = { ...queryParams, ...this.pagingParams };
    return combinedParams;
  }

  get subAccountParams() {
    let accountIdNumbers = this.terminals.map((terminal) => terminal.account_id);
    let uniqueAccountIds = [...new Set(accountIdNumbers)];
    let accountIdString = uniqueAccountIds.join(',');
    return { sub_account_id: accountIdString };
  }

  get entityId() {
    return this.terminals.map((terminal) => terminal.id);
  }

  get showEmptyState() {
    return !this.loading && !this.errorMessage && this.terminalsTable.rowData.length < 1;
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
                {this.terminalsTable.columnData.map((column) => column)}
              </tr>
            </thead>
            <tbody class="table-body">
              <TableLoadingState
                columnSpan={this.terminalsTable.columnKeys.length}
                isLoading={this.loading}
              />
              <TableEmptyState
                isEmpty={this.showEmptyState}
                columnSpan={this.terminalsTable.columnKeys.length}
              />
              <TableErrorState
                columnSpan={this.terminalsTable.columnKeys.length}
                errorMessage={this.errorMessage}
              />
              {this.showRowData && this.terminalsTable.rowData.map((data, index) => (
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
                  <td part={tableCell} colSpan={this.terminalsTable.columnData.length}>
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
