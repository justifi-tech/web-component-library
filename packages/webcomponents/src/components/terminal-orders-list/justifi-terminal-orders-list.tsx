import { Component, Event, EventEmitter, h, Prop, State, Watch } from '@stencil/core';
import { StyledHost } from '../../ui-components';
import { checkPkgVersion } from '../../utils/check-pkg-version';
import {
  defaultColumnsKeys,
  terminalOrdersTableCells,
  terminalOrdersTableColumns,
} from './terminal-orders-table';
import { makeGetTerminalOrders } from '../../actions/terminal/get-terminal-orders';
import { TerminalOrderService } from '../../api/services/terminal_orders.service';
import { ComponentErrorCodes, ComponentErrorEvent, ComponentErrorSeverity } from '../../api';
import JustifiAnalytics from '../../api/Analytics';
import { Table } from '../../utils/table';
import { TableEmptyState, TableErrorState, TableLoadingState } from '../../ui-components';
import { ComponentClickEvent, pagingDefaults, PagingInfo, TerminalOrder } from '../../api';
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
  TableFootCell,
  TableClickActions,
} from '../../ui-components';

@Component({
  tag: 'justifi-terminal-orders-list',
  shadow: true,
})
export class JustifiTerminalOrdersList {
  @Prop() accountId!: string;
  @Prop() authToken!: string;
  @Prop() columns?: string = defaultColumnsKeys;

  @State() terminalOrders: TerminalOrder[] = [];
  @State() terminalOrdersTable: Table<TerminalOrder>;
  @State() loading: boolean = true;
  @State() errorMessage: string;
  @State() paging: PagingInfo = pagingDefaults;
  @State() pagingParams: any = {};

  @State() getTerminalOrders: Function;

  @Event({ eventName: 'click-event', bubbles: true }) clickEvent: EventEmitter<ComponentClickEvent>;
  @Event({ eventName: 'error-event' }) errorEvent: EventEmitter<ComponentErrorEvent>;

  analytics: JustifiAnalytics;

  componentWillLoad() {
    checkPkgVersion();
    this.analytics = new JustifiAnalytics(this);
    this.terminalOrdersTable = new Table<TerminalOrder>(
      this.terminalOrders,
      this.columns,
      terminalOrdersTableColumns,
      terminalOrdersTableCells,
    );
    this.initializeGetData();
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

  disconnectedCallback() {
    this.analytics?.cleanup();
  }

  @Watch('accountId')
  @Watch('authToken')
  authPropChanged() {
    this.initializeGetData();
    if (this.getTerminalOrders) {
      this.fetchData();
    }
  }

  @Watch('pagingParams')
  @Watch('columns')
  pagingOrColumnsChanged() {
    if (this.getTerminalOrders) {
      this.fetchData();
    }
  }

  private initializeGetData() {
    if (this.accountId && this.authToken) {
      this.getTerminalOrders = makeGetTerminalOrders({
        id: this.accountId,
        authToken: this.authToken,
        service: new TerminalOrderService(),
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

  fetchData(): void {
    if (!this.getTerminalOrders) {
      return;
    }
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
      final: () => {
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
      <StyledHost>
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
              {this.showRowData &&
                this.terminalOrdersTable.rowData.map((data, index) => (
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
      </StyledHost>
    );
  }
}
