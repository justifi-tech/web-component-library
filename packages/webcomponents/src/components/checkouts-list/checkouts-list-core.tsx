import { Component, h, Prop, State, Watch, Event, EventEmitter } from '@stencil/core';
import { Checkout, PagingInfo, SubAccount, pagingDefaults } from '../../api';
import { ComponentError } from '../../api/ComponentError';
import { TableEmptyState, TableErrorState, TableLoadingState } from '../../ui-components';
import { checkoutTableColumns, checkoutTableCells } from './checkouts-table';
import { Table } from '../../utils/table';
import { queryParams, onQueryParamsChange } from './checkouts-list-params-state';


@Component({
  tag: 'checkouts-list-core'
})
export class CheckoutsListCore {
  @Prop() getCheckouts: Function;
  @Prop() getSubAccounts: Function;
  @Prop() columns: string;

  @State() checkouts: Checkout[] = [];
  @State() checkoutsTable: Table;
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

  @Event({
    eventName: 'row-clicked',
    bubbles: true,
  }) rowClicked: EventEmitter<Checkout>;

  @Event({ eventName: 'error-event' }) errorEvent: EventEmitter<ComponentError>;

  componentWillLoad() {
    this.checkoutsTable = new Table(this.checkouts, this.columns, checkoutTableColumns, checkoutTableCells);
    if (this.getCheckouts && this.getSubAccounts) {
      this.fetchData();
    }

    onQueryParamsChange('set', () => {
      delete this.pagingParams.before_cursor;
      delete this.pagingParams.after_cursor;
      this.fetchData();
    });

    onQueryParamsChange('reset', () => {
      this.pagingParams = {};
    });
  }

  fetchData(): void {
    this.loading = true;

    this.getCheckouts({
      params: this.requestParams,
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
  };

  handleClickNext = (afterCursor: string) => {
    this.pagingParams = { after_cursor: afterCursor };
  };

  rowClickHandler = (e) => {
    const clickedCheckoutID = e.target.closest('tr').dataset.rowEntityId;
    if (!clickedCheckoutID) return;
    this.rowClicked.emit(this.checkouts.find((checkout) => checkout.id === clickedCheckoutID));
  };

  get requestParams() {
    const combinedParams = { ...queryParams, ...this.pagingParams };
    return combinedParams;
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
      <div>
        <div class="table-wrapper">
          <table class="table table-hover">
            <thead class="table-head sticky-top" part="table-head">
              <tr class="table-light text-nowrap" part="table-head-row">
                {this.checkoutsTable.columnData.map((column) => column)}
              </tr>
            </thead>
            <tbody class="table-body" part="table-body">
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
                  <td part="pagination-bar" colSpan={this.checkoutsTable.columnData.length}>
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
