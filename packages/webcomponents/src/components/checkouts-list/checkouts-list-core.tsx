import { Component, h, Prop, State, Watch, Event, EventEmitter } from '@stencil/core';
import { Checkout, PagingInfo, SubAccount, pagingDefaults } from '../../api';
import { TableEmptyState, TableErrorState, TableLoadingState } from '../../ui-components';
import { checkoutTableColumns, checkoutTableCells } from './checkouts-table';
import { Table } from '../../utils/table';
import { getRequestParams, onQueryParamsChange } from './checkouts-list-params-state';
import { ComponentClickEvent, ComponentErrorEvent } from '../../api/ComponentEvents';
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
  tag: 'checkouts-list-core'
})
export class CheckoutsListCore {
  @Prop() getCheckouts: Function;
  @Prop() getSubAccounts: Function;
  @Prop() columns: string;

  @State() checkouts: Checkout[] = [];
  @State() checkoutsTable: Table<Checkout>;
  @State() subAccounts: SubAccount[] = [];
  @State() loading: boolean = true;
  @State() errorMessage: string;
  @State() paging: PagingInfo = pagingDefaults;
  @State() pagingParams: any = {};

  @Watch('pagingParams')
  @Watch('getCheckouts')
  @Watch('getSubAccounts')
  @Watch('columns')
  updateOnPropChange() {
    this.fetchData();
  }

  @Event({ eventName: 'click-event', bubbles: true }) clickEvent: EventEmitter<ComponentClickEvent>;
  @Event({ eventName: 'error-event' }) errorEvent: EventEmitter<ComponentErrorEvent>;

  componentWillLoad() {
    this.checkoutsTable = new Table<Checkout>(this.checkouts, this.columns, checkoutTableColumns, checkoutTableCells);
    if (this.getCheckouts && this.getSubAccounts) {
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

    this.getCheckouts({
      params: this.checkoutParams,
      onSuccess: async ({ checkouts, pagingInfo }) => {
        this.checkouts = checkouts;
        this.paging = pagingInfo;
        this.checkoutsTable.collectionData = this.checkouts;
        const shouldFetchSubAccounts = this.checkoutsTable.columnKeys.includes('sub_account_name');

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
        this.checkouts = this.checkouts.map((checkout) => {
          checkout.sub_account_name = this.subAccounts.find((subAccount) => subAccount.id === checkout.account_id)?.name;
          return checkout;
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
    const clickedCheckoutID = e.target.closest('tr').dataset.rowEntityId;
    if (!clickedCheckoutID) return;

    const checkoutData = this.checkouts.find((checkout) => checkout.id === clickedCheckoutID);
    this.clickEvent.emit({ name: TableClickActions.row, data: checkoutData });
  };

  get checkoutParams() {
    const requestParams = getRequestParams();
    const params = { ...requestParams, ...this.pagingParams };
    return params;
  }

  get subAccountParams() {
    let accountIdNumbers = this.checkouts.map((checkout) => checkout.account_id);
    let uniqueAccountIds = [...new Set(accountIdNumbers)];
    let accountIdString = uniqueAccountIds.join(',');
    return { sub_account_id: accountIdString };
  }

  get entityId() {
    return this.checkouts.map((checkout) => checkout.id);
  }

  get showEmptyState() {
    return !this.loading && !this.errorMessage && this.checkoutsTable.rowData.length < 1;
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
              {this.checkoutsTable.columnData.map((column) => column)}
            </TableHeadRow>
          </TableHead>
          <TableBody>
            <TableLoadingState
              columnSpan={this.checkoutsTable.columnKeys.length}
              isLoading={this.loading}
            />
            <TableEmptyState
              isEmpty={this.showEmptyState}
              columnSpan={this.checkoutsTable.columnKeys.length}
            />
            <TableErrorState
              columnSpan={this.checkoutsTable.columnKeys.length}
              errorMessage={this.errorMessage}
            />
            {this.showRowData && this.checkoutsTable.rowData.map((data, index) => (
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
                <TableFootCell colSpan={this.checkoutsTable.columnData.length}>
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
