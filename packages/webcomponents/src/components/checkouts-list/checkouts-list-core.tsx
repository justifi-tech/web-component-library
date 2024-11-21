import { Component, h, Prop, State, Watch, Event, EventEmitter } from '@stencil/core';
import { Checkout, ICheckoutsParams, PagingInfo, SubAccount, pagingDefaults } from '../../api';
import { ComponentError } from '../../api/ComponentError';
import { tableExportedParts } from '../../ui-components/table/exported-parts';
import { onFilterChange } from '../../ui-components/filters/utils';
import { StyledHost, TableEmptyState, TableErrorState, TableLoadingState } from '../../ui-components';
import CheckoutsTable, { defaultColumnsKeys } from './checkouts-table';

@Component({
  tag: 'checkouts-list-core'
})
export class CheckoutsListCore {
  @Prop() getCheckouts: Function;
  @Prop() getSubAccounts: Function;
  @Prop() columns: string = defaultColumnsKeys;

  @State() checkouts: Checkout[] = [];
  @State() checkoutsTable: CheckoutsTable;
  @State() subAccounts: SubAccount[] = [];
  @State() loading: boolean = true;
  @State() errorMessage: string;
  @State() paging: PagingInfo = pagingDefaults;
  @State() params: ICheckoutsParams = {};

  @Watch('params')
  @Watch('getCheckouts')
  @Watch('getSubAccounts')
  @Watch('columns')
  updateOnPropChange() {
    this.fetchCheckouts();
  }

  @Event({
    eventName: 'checkout-row-clicked',
    bubbles: true,
  }) rowClicked: EventEmitter<Checkout>;

  @Event({ eventName: 'error-event' }) errorEvent: EventEmitter<ComponentError>;

  componentWillLoad() {
    if (this.getCheckouts && this.getSubAccounts) {
      this.fetchCheckouts();
    }
  }

  fetchCheckouts(): void {
    this.loading = true;

    this.getCheckouts({
      params: this.params,
      onSuccess: ({ checkouts, pagingInfo }) => {
        this.checkouts = checkouts;
        this.paging = pagingInfo;
        this.checkoutsTable = new CheckoutsTable(this.checkouts, this.columns);
        this.loading = false; // temp
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
    const clickedCheckoutID = e.target.closest('tr').dataset.rowEntityId;
    if (!clickedCheckoutID) return;
    this.rowClicked.emit(this.checkouts.find((checkout) => checkout.id === clickedCheckoutID));
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
      <StyledHost exportparts={tableExportedParts}>
        <checkouts-list-filters
          params={this.params}
          setParamsOnChange={this.setParamsOnChange}
          clearParams={this.clearParams}
        />
        <div class="table-wrapper">
          <table class="table table-hover">
            <thead class="table-head sticky-top" part="table-head">
              <tr class="table-light text-nowrap" part="table-head-row">
                {this.checkoutsTable?.columnData?.map((column) => (
                  <th part="table-head-cell" scope="col" title={column.title}>
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody class="table-body" part="table-body">
              {/* fix this, not working with new checkoutsTable */}
              <TableLoadingState
                columnSpan={this.checkoutsTable?.columnData.length}
                isLoading={this.loading}
              />
              <TableEmptyState
                isEmpty={this.showEmptyState}
                columnSpan={this.checkoutsTable?.columnData.length}
              />
              <TableErrorState
                columnSpan={this.checkoutsTable?.columnData.length}
                errorMessage={this.errorMessage}
              />
              {this.showRowData && this.checkoutsTable?.rowData.map((data) => (<tr>{data}</tr>))}
            </tbody>
            {this.paging && (
              <tfoot class="sticky-bottom">
                <tr class="table-light align-middle">
                  <td part="pagination-bar" colSpan={this.checkoutsTable?.columnData?.length}>
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
      </StyledHost>
    );
  }
}
