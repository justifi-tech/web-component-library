import { Component, h, Prop, State, Watch, Event, EventEmitter } from '@stencil/core';
import { PagingInfo, SubAccount, Terminal, TerminalsTableFilterParams, pagingDefaults } from '../../api';
import { ComponentError } from '../../api/ComponentError';
import { TableEmptyState, TableErrorState, TableLoadingState } from '../../ui-components';
import { onFilterChange } from '../../ui-components/filters/utils';
import { terminalTableColumns, terminalTableCells } from './terminals-table';
import { Table } from '../../utils/table';

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
  @State() params: TerminalsTableFilterParams = {};

  @Watch('params')
  @Watch('getTerminals')
  @Watch('getSubAccounts')
  @Watch('columns')
  updateOnPropChange() {
    this.fetchTerminals();
  }

  @Event({
    eventName: 'terminal-row-clicked',
    bubbles: true,
  }) rowClicked: EventEmitter<Terminal>;

  @Event({ eventName: 'error-event' }) errorEvent: EventEmitter<ComponentError>;

  componentWillLoad() {
    this.terminalsTable = new Table(this.terminals, this.columns, terminalTableColumns, terminalTableCells);
    if (this.getTerminals && this.getSubAccounts) {
      this.fetchTerminals();
    }
  }

  fetchTerminals(): void {
    this.loading = true;

    this.getTerminals({
      params: this.params,
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
    const clickedTerminalID = e.target.closest('tr').dataset.rowEntityId;
    if (!clickedTerminalID) return;
    this.rowClicked.emit(this.terminals.find((terminal) => terminal.id === clickedTerminalID));
  };

  setParamsOnChange = (name: string, value: string) => {
    let newParams = { [name]: value };
    this.params = onFilterChange(newParams, this.params);
  }

  clearParams = () => {
    this.errorMessage = '';
    this.params = {};
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
        <terminals-list-filters
          params={this.params}
          setParamsOnChange={this.setParamsOnChange}
          clearParams={this.clearParams}
        />
        <div class="table-wrapper">
          <table class="table table-hover">
            <thead class="table-head sticky-top" part="table-head">
              <tr class="table-light text-nowrap" part="table-head-row">
                {this.terminalsTable.columnData.map((column) => column)}
              </tr>
            </thead>
            <tbody class="table-body" part="table-body">
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
                  part={`table-row ${index % 2 ? "table-row-even" : "table-row-odd"}`}
                >
                  {data}
                </tr>
              ))}
            </tbody>
            {this.paging && (
              <tfoot class="sticky-bottom">
                <tr class="table-light align-middle">
                  <td part="pagination-bar" colSpan={this.terminalsTable.columnData.length}>
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
