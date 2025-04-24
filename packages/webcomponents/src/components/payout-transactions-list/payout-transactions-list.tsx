
import { Component, h, Prop, State, Watch, Event, EventEmitter } from '@stencil/core';
import { ComponentClickEvent, ComponentErrorCodes, ComponentErrorEvent, ComponentErrorSeverity, pagingDefaults, PagingInfo, PayoutBalanceTransaction } from '../../api';
import JustifiAnalytics from '../../api/Analytics';
import { checkPkgVersion } from '../../utils/check-pkg-version';
import { makeGetPayoutTransactions } from '../../actions/payout/get-payout-transactions';
import { PayoutService } from '../../api/services/payout.service';
import { Table } from '../../utils/table';
import { TableClickActions } from '../../ui-components/table/event-types';
import { table, tableCell } from '../../styles/parts';
import { StyledHost, TableEmptyState, TableErrorState, TableLoadingState } from '../../ui-components';
import { defaultColumnsKeys, payoutTransactionTableCells, payoutTransactionTableColumns } from './payout-transactions-table';

@Component({
  tag: 'justifi-payout-transactions-list',
  shadow: true
})
export class PayoutTransactionsList {
  @State() balanceTransactions: PayoutBalanceTransaction[] = [];
  @State() transactionsTable: Table<PayoutBalanceTransaction>;
  @State() isLoading: boolean = true;
  @State() errorMessage: string = null;
  @State() paging: PagingInfo = pagingDefaults;
  @State() pagingParams: any = {};

  @Prop() payoutId: string;
  @Prop() authToken: string;
  @Prop() apiOrigin?: string = PROXY_API_ORIGIN;
  @Prop() columns?: string = defaultColumnsKeys;

  @Event({ eventName: 'click-event', bubbles: true }) clickEvent: EventEmitter<ComponentClickEvent>;
  @Event({ eventName: 'error-event' }) errorEvent: EventEmitter<ComponentErrorEvent>;
  
  analytics: JustifiAnalytics;

  componentWillLoad() {
    this.transactionsTable = new Table<PayoutBalanceTransaction>(this.balanceTransactions, this.columns, payoutTransactionTableColumns, payoutTransactionTableCells);
    checkPkgVersion();
    this.analytics = new JustifiAnalytics(this);
    this.initializeApi();
  }

  disconnectedCallback() {
    this.analytics.cleanup();
  }

  @Watch('payoutId')
  @Watch('authToken')
  propChanged() {
    this.initializeApi();
  }

  private handleError(code: ComponentErrorCodes, errorMessage: string, severity: ComponentErrorSeverity) {
    this.isLoading = false;
    this.errorEvent.emit({ errorCode: code, message: errorMessage, severity });
  }

  private initializeApi() {
    if (this.payoutId && this.authToken) {
      const getPayoutTransactions = makeGetPayoutTransactions({
        authToken: this.authToken,
        service: new PayoutService(),
        apiOrigin: this.apiOrigin
      });

      getPayoutTransactions({
        params: this.requestParams,
        onSuccess: ({ balanceTransactions, pagingInfo }) => {
          this.balanceTransactions = balanceTransactions;
          this.paging = pagingInfo;
          this.transactionsTable.collectionData = this.balanceTransactions;
        },
        onError: ({ error, code, severity }) => {
          this.errorMessage = error.message;
          this.handleError(error, code, severity);
        },
        final: () => {
          this.isLoading = false;
        }
      });
    } else {
      this.errorMessage = 'payout-id and auth-token props are required';
      this.handleError(ComponentErrorCodes.MISSING_PROPS, this.errorMessage, ComponentErrorSeverity.ERROR);
    }
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
    const clickedPayoutId = e.target.closest('tr').dataset.rowEntityId;
    if (!clickedPayoutId) return;

    const transactionData = this.balanceTransactions.find((payout) => payout.id === clickedPayoutId);
    this.clickEvent.emit({ name: TableClickActions.row, data: transactionData });
  };

  get entityId() {
    return this.balanceTransactions.map((transaction) => transaction.id);
  }

  get showEmptyState() {
    return !this.isLoading && !this.errorMessage && this.transactionsTable.rowData.length < 1;
  }

  get showErrorState() {
    return !this.isLoading && !!this.errorMessage;
  }

  get showRowData() {
    return !this.showEmptyState && !this.showErrorState && !this.isLoading;
  }

  get requestParams() {
    return {
      payout_id: this.payoutId,
      ...this.pagingParams
    };
  }

  render() {
    return (
      <StyledHost>
        <div class="table-wrapper">
          <table class="table table-hover" part={table}>
            <thead class="table-head sticky-top">
              <tr class="table-light text-nowrap">
                {this.transactionsTable.columnData.map((column) => column)}
              </tr>
            </thead>
            <tbody class="table-body">
              <TableLoadingState
                columnSpan={this.transactionsTable.columnData.length}
                isLoading={this.isLoading}
              />
              <TableEmptyState
                isEmpty={this.showEmptyState}
                columnSpan={this.transactionsTable.columnData.length}
              />
              <TableErrorState
                columnSpan={this.transactionsTable.columnData.length}
                errorMessage={this.errorMessage}
              />
              {this.showRowData && this.transactionsTable.rowData.map((data, index) => (
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
                  <td part={tableCell} colSpan={this.transactionsTable.columnData.length}>
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
      </StyledHost>
    );
  }
}
