import { Component, h, Prop, State, Watch, Event, EventEmitter } from '@stencil/core';
import { ComponentClickEvent, ComponentErrorCodes, ComponentErrorEvent, ComponentErrorSeverity, pagingDefaults, PagingInfo, PaymentBalanceTransaction } from '../../api';
import JustifiAnalytics from '../../api/Analytics';
import { checkPkgVersion } from '../../utils/check-pkg-version';
import { makeGetPaymentTransactions } from '../../actions/payment/get-payment-transactions';
import { PaymentService } from '../../api/services/payment.service';
import { Table } from '../../utils/table';
import { TableClickActions } from '../../ui-components/table/event-types';
import { table, tableCell } from '../../styles/parts';
import { StyledHost, TableEmptyState, TableErrorState, TableLoadingState } from '../../ui-components';
import { defaultColumnsKeys, paymentTransactionTableCells, paymentTransactionTableColumns } from './payment-transactions-table';

@Component({
  tag: 'justifi-payment-transactions-list',
  shadow: true
})
export class PaymentTransactionsList {
  @State() balanceTransactions: PaymentBalanceTransaction[] = [];
  @State() transactionsTable: Table<PaymentBalanceTransaction>;
  @State() isLoading: boolean = true;
  @State() errorMessage: string = null;
  @State() paging: PagingInfo = pagingDefaults;
  @State() pagingParams: any = {};

  @Prop() paymentId: string;
  @Prop() authToken: string;
  @Prop() apiOrigin?: string = PROXY_API_ORIGIN;
  @Prop() columns?: string = defaultColumnsKeys;

  @Event({ eventName: 'click-event', bubbles: true }) clickEvent: EventEmitter<ComponentClickEvent>;
  @Event({ eventName: 'error-event' }) errorEvent: EventEmitter<ComponentErrorEvent>;
  
  analytics: JustifiAnalytics;

  componentWillLoad() {
    this.transactionsTable = new Table<PaymentBalanceTransaction>(this.balanceTransactions, this.columns, paymentTransactionTableColumns, paymentTransactionTableCells);
    checkPkgVersion();
    this.analytics = new JustifiAnalytics(this);
    this.initializeApi();
  }

  disconnectedCallback() {
    this.analytics.cleanup();
  }

  @Watch('paymentId')
  @Watch('authToken')
  propChanged() {
    this.initializeApi();
  }

  private handleError(code: ComponentErrorCodes, errorMessage: string, severity: ComponentErrorSeverity) {
    this.errorEvent.emit({ errorCode: code, message: errorMessage, severity });
  }

  private initializeApi() {
    if (this.paymentId && this.authToken) {
      const getPaymentTransactions = makeGetPaymentTransactions({
        id: this.paymentId,
        authToken: this.authToken,
        service: new PaymentService(),
        apiOrigin: this.apiOrigin
      });

      getPaymentTransactions({
        params: this.pagingParams,
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
      this.errorMessage = 'payment-id and auth-token props are required';
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
    const clickedPaymentID = e.target.closest('tr').dataset.rowEntityId;
    if (!clickedPaymentID) return;

    const transactionData = this.balanceTransactions.find((payment) => payment.id === clickedPaymentID);
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

  render() {
    return (
      <StyledHost>
        <div>
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
        </div>
      </StyledHost>
    );
  }
}
