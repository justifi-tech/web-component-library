import { Component, h, Prop, State, Watch, Event, EventEmitter } from '@stencil/core';
import { PagingInfo, Payout, SubAccount, pagingDefaults } from '../../api';
import { ComponentErrorCodes, ComponentErrorSeverity } from '../../api/ComponentError';
import { TableEmptyState, TableErrorState, TableLoadingState } from '../../ui-components';
import { payoutTableCells, payoutTableColumns } from './payouts-table';
import { Table } from '../../utils/table';
import { getRequestParams, onQueryParamsChange } from './payouts-list-params-state';
import { table, tableCell } from '../../styles/parts';
import { ComponentClickEvent, ComponentErrorEvent } from '../../api/ComponentEvents';
import { TableClickActions } from '../../ui-components/table/event-types';

@Component({
  tag: 'payouts-list-core',
})

export class PayoutsListCore {
  @Prop() getPayouts: Function;
  @Prop() getSubAccounts: Function;
  @Prop() getPayoutCSV: Function;
  @Prop() columns: string;

  @State() payouts: Payout[] = [];
  @State() payoutsTable: Table<Payout>;
  @State() subAccounts: SubAccount[] = [];
  @State() loading: boolean = true;
  @State() errorMessage: string;
  @State() paging: PagingInfo = pagingDefaults;
  @State() pagingParams: any = {};

  @Watch('pagingParams')
  @Watch('getPayouts')
  @Watch('getSubAccounts')
  updateOnPropChange() {
    this.fetchData();
  }

  @Event({ eventName: 'click-event', bubbles: true }) clickEvent: EventEmitter<ComponentClickEvent>;
  @Event({ eventName: 'error-event' }) errorEvent: EventEmitter<ComponentErrorEvent>;

  componentWillLoad() {
    this.payoutsTable = new Table<Payout>(this.payouts, this.columns, payoutTableColumns, payoutTableCells(this.downloadCSV));
    if (this.getPayouts && this.getSubAccounts) {
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

    this.getPayouts({
      params: this.payoutParams,
      onSuccess: ({ payouts, pagingInfo }) => {
        this.payouts = payouts;
        this.paging = pagingInfo;
        this.payoutsTable.collectionData = this.payouts;
        const shouldFetchSubAccounts = this.payoutsTable.columnKeys.includes('sub_account_name');

        if (shouldFetchSubAccounts) {
          this.fetchSubAccounts();
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
        this.payouts = this.payouts.map((payout) => {
          payout.sub_account_name = this.subAccounts.find((subAccount) => subAccount.id === payout.account_id)?.name;
          return payout;
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

  downloadCSV = (payoutId: string) => {
    this.getPayoutCSV({
      payoutId,
      onError: () => {
        this.errorEvent.emit({
          errorCode: ComponentErrorCodes.FETCH_ERROR,
          message: 'Failed to download CSV',
          severity: ComponentErrorSeverity.ERROR,
        });
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
    const clickedRow = e.target.closest('tr');
    
    const clickedPayoutID = clickedRow.dataset.rowEntityId;
    if (!clickedPayoutID) return;
    
    const clickedCSV = clickedRow.querySelector('a');
    if (clickedCSV === e.target) return;

    const payoutData = this.payouts.find((payout) => payout.id === clickedPayoutID);
    this.clickEvent.emit({ name: TableClickActions.row, data: payoutData });
  }

  get payoutParams() {
    const requestParams = getRequestParams();
    const params = { ...requestParams, ...this.pagingParams };
    return params;
  }

  get subAccountParams() {
    let accountIdNumbers = this.payouts.map((payout) => payout.account_id);
    let uniqueAccountIds = [...new Set(accountIdNumbers)];
    let accountIdString = uniqueAccountIds.join(',');
    return { sub_account_id: accountIdString };
  }

  get entityId() {
    return this.payouts.map((payout) => payout.id);
  }

  get showEmptyState() {
    return !this.loading && !this.errorMessage && this.payoutsTable.rowData.length < 1;
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
        <div class="table-wrapper" part="table-wrapper">
          <table class="table table-hover" part={table}>
            <thead class="table-head sticky-top" part="table-head">
              <tr class="table-light text-nowrap" part="table-head-row">
                {this.payoutsTable.columnData.map((column) => column)}
              </tr>
            </thead>
            <tbody class="table-body">
              <TableLoadingState
                columnSpan={this.payoutsTable.columnKeys.length}
                isLoading={this.loading}
              />
              <TableEmptyState
                isEmpty={this.showEmptyState}
                columnSpan={this.payoutsTable.columnKeys.length}
              />
              <TableErrorState
                columnSpan={this.payoutsTable.columnKeys.length}
                errorMessage={this.errorMessage}
              />
              {this.showRowData && this.payoutsTable.rowData.map((data, index) => (
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
                  <td part={tableCell} colSpan={this.payoutsTable.columnData.length}>
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
