import { Component, Event, EventEmitter, h, Prop, State, Watch } from '@stencil/core';
import { ComponentErrorCodes, ComponentErrorSeverity } from '../../api/ComponentError';
import JustifiAnalytics from '../../api/Analytics';
import { checkPkgVersion } from '../../utils/check-pkg-version';
import { TerminalService } from '../../api/services/terminal.service';
import { makeGetTerminals } from '../../actions/terminal/get-terminals';
import { SubAccountService } from '../../api/services/subaccounts.service';
import { StyledHost } from '../../ui-components';
import { defaultColumnsKeys, terminalTableColumns, terminalTableCells } from './terminals-table';
import { ComponentClickEvent, ComponentErrorEvent } from '../../api/ComponentEvents';
import { makeGetSubAccounts } from '../../actions/sub-account/get-subaccounts';
import { PagingInfo, SubAccount, Terminal, pagingDefaults } from '../../api';
import { TableEmptyState, TableErrorState, TableLoadingState } from '../../ui-components';
import { Table } from '../../utils/table';
import { getRequestParams, onQueryParamsChange } from './terminals-list-params-state';
import {
  TableWrapper,
  TableComponent,
  TableHead,
  TableHeadRow,
  TableBody,
  TableRow,
  TableFoot,
  TableFootRow,
  TableFootCell,
  TableClickActions
} from '../../ui-components';

@Component({
  tag: 'justifi-terminals-list',
  shadow: true
})

export class JustifiTerminalsList {
  @State() getTerminals: Function;
  @State() getSubAccounts: Function;
  @State() terminals: Terminal[] = [];
  @State() terminalsTable: Table<Terminal>;
  @State() subAccounts: SubAccount[] = [];
  @State() loading: boolean = true;
  @State() errorMessage: string;
  @State() paging: PagingInfo = pagingDefaults;
  @State() pagingParams: any = {};

  @Prop() accountId!: string;
  @Prop() authToken!: string;
  @Prop() columns?: string = defaultColumnsKeys;

  @Event({ eventName: 'click-event', bubbles: true }) clickEvent: EventEmitter<ComponentClickEvent>;
  @Event({ eventName: 'error-event' }) errorEvent: EventEmitter<ComponentErrorEvent>;

  analytics: JustifiAnalytics;

  componentWillLoad() {
    checkPkgVersion();
    this.analytics = new JustifiAnalytics(this);
    this.terminalsTable = new Table<Terminal>(this.terminals, this.columns, terminalTableColumns, terminalTableCells);
    this.initializeGetData();

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

  disconnectedCallback() {
    this.analytics?.cleanup();
  };

  @Watch('accountId')
  @Watch('authToken')
  propChanged() {
    this.initializeGetData();
  }

  @Watch('pagingParams')
  @Watch('getTerminals')
  @Watch('getSubAccounts')
  @Watch('columns')
  updateOnPropChange() {
    this.fetchData();
  }

  private initializeGetData() {
    this.initializeGetTerminals();
    this.initializeGetSubAccounts();
  }

  private initializeGetTerminals() {
    if (this.accountId && this.authToken) {
      this.getTerminals = makeGetTerminals({
        id: this.accountId,
        authToken: this.authToken,
        service: new TerminalService()
      });
    } else {
      this.errorMessage = 'Account ID and Auth Token are required';
      this.errorEvent.emit({
        errorCode: ComponentErrorCodes.MISSING_PROPS,
        message: this.errorMessage,
        severity: ComponentErrorSeverity.ERROR,
      });
    }
  }

  private initializeGetSubAccounts() {
    if (this.accountId && this.authToken) {
      this.getSubAccounts = makeGetSubAccounts({
        primaryAccountId: this.accountId,
        authToken: this.authToken,
        service: new SubAccountService()
      });
    }
  }

  fetchData(): void {
    this.loading = true;

    this.getTerminals({
      params: this.terminalParams,
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

  get terminalParams() {
    const requestParams = getRequestParams();
    const params = { ...requestParams, ...this.pagingParams };
    return params;
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
      <StyledHost>
        <TableWrapper>
          <TableComponent>
            <TableHead>
              <TableHeadRow>
                {this.terminalsTable.columnData.map((column) => column)}
              </TableHeadRow>
            </TableHead>
            <TableBody>
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
                  <TableFootCell colSpan={this.terminalsTable.columnData.length}>
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
      </StyledHost>
    );
  }
};
