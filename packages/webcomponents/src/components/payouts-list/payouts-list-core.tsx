import { Component, h, Prop, State, Watch, Event, EventEmitter } from '@stencil/core';
import { PagingInfo, Payout, SubAccount, pagingDefaults } from '../../api';
import { ComponentErrorCodes, ComponentErrorSeverity } from '../../api/ComponentError';
import { TableEmptyState, TableErrorState, TableLoadingState } from '../../ui-components';
import { payoutTableCells, payoutTableColumns } from './payouts-table';
import { Table } from '../../utils/table';
import { getRequestParams, onQueryParamsChange } from './payouts-list-params-state';
import { ComponentClickEvent, ComponentErrorEvent } from '../../api/ComponentEvents';
import { TableClickActions } from '../../ui-components/table/event-types';
import {
  TableBody,
  TableComponent,
  TableFoot,
  TableFootCell,
  TableFootRow,
  TableHead,
  TableHeadRow,
  TableRow,
  TableWrapper
} from '../../ui-components/table/table';

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
      <TableWrapper>
        <TableComponent>
          <TableHead>
            <TableHeadRow>
              {this.payoutsTable.columnData.map((column) => column)}
            </TableHeadRow>
          </TableHead>
          <TableBody>
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
                <TableFootCell colSpan={this.payoutsTable.columnData.length}>
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
