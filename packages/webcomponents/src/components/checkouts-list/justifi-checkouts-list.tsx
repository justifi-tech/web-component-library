import { Component, Event, EventEmitter, h, Prop, State, Watch } from '@stencil/core';
import { Checkout, PagingInfo, SubAccount, pagingDefaults } from '../../api';
import { makeGetCheckouts } from '../../actions/checkout/get-checkouts';
import { checkPkgVersion } from '../../utils/check-pkg-version';
import JustifiAnalytics from '../../api/Analytics';
import { CheckoutService } from '../../api/services/checkout.service';
import { ComponentErrorCodes, ComponentErrorSeverity } from '../../api/ComponentError';
import { SubAccountService } from '../../api/services/subaccounts.service';
import { makeGetSubAccounts } from '../../actions/sub-account/get-subaccounts';
import {
  StyledHost,
  TableEmptyState,
  TableErrorState,
  TableLoadingState,
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
import { checkoutTableColumns, checkoutTableCells, defaultColumnsKeys } from './checkouts-table';
import { Table } from '../../utils/table';
import { getRequestParams, onQueryParamsChange } from './checkouts-list-params-state';
import { ComponentClickEvent, ComponentErrorEvent } from '../../api/ComponentEvents';

@Component({
  tag: 'justifi-checkouts-list',
  shadow: true,
})
export class JustifiCheckoutsList {
  @Prop() accountId!: string;
  @Prop() authToken!: string;
  @Prop() columns?: string = defaultColumnsKeys;
  @Prop() subAccountId?: string;

  @State() checkouts: Checkout[] = [];
  @State() checkoutsTable: Table<Checkout>;
  @State() subAccounts: SubAccount[] = [];
  @State() loading: boolean = true;
  @State() errorMessage: string;
  @State() paging: PagingInfo = pagingDefaults;
  @State() pagingParams: any = {};

  @State() getCheckouts: Function;
  @State() getSubAccounts: Function;

  @Event({ eventName: 'click-event', bubbles: true }) clickEvent: EventEmitter<ComponentClickEvent>;
  @Event({ eventName: 'error-event' }) errorEvent: EventEmitter<ComponentErrorEvent>;

  analytics: JustifiAnalytics;

  componentWillLoad() {
    checkPkgVersion();
    this.analytics = new JustifiAnalytics(this);
    this.checkoutsTable = new Table<Checkout>(this.checkouts, this.columns, checkoutTableColumns, checkoutTableCells);
    this.initializeGetData();
    if (this.getCheckouts) {
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
  @Watch('subAccountId')
  authPropChanged() {
    this.initializeGetData();
    if (this.getCheckouts) {
      this.fetchData();
    }
  }

  @Watch('pagingParams')
  @Watch('columns')
  pagingOrColumnsChanged() {
    if (this.getCheckouts) {
      this.fetchData();
    }
  }

  private initializeGetData() {
    this.initializeGetCheckouts();
    this.initializeGetSubAccounts();
  }

  private initializeGetCheckouts() {
    const accountToUse = this.subAccountId || this.accountId;
    if (accountToUse && this.authToken) {
      this.getCheckouts = makeGetCheckouts({
        accountId: accountToUse,
        authToken: this.authToken,
        service: new CheckoutService(),
      });
    } else {
      this.errorMessage = 'Account ID/Sub Account ID and Auth Token are required';
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
        service: new SubAccountService(),
      });
    }
  }

  fetchData(): void {
    if (!this.getCheckouts) {
      return;
    }
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
    if (!this.getSubAccounts) {
      this.loading = false;
      return;
    }
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
    const accountIdNumbers = this.checkouts.map((checkout) => checkout.account_id);
    const uniqueAccountIds = [...new Set(accountIdNumbers)];
    const accountIdString = uniqueAccountIds.join(',');
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
      <StyledHost>
        <TableWrapper>
          <TableComponent>
            <TableHead>
              <TableHeadRow>{this.checkoutsTable.columnData.map((column) => column)}</TableHeadRow>
            </TableHead>
            <TableBody>
              <TableLoadingState columnSpan={this.checkoutsTable.columnKeys.length} isLoading={this.loading} />
              <TableEmptyState isEmpty={this.showEmptyState} columnSpan={this.checkoutsTable.columnKeys.length} />
              <TableErrorState columnSpan={this.checkoutsTable.columnKeys.length} errorMessage={this.errorMessage} />
              {this.showRowData &&
                this.checkoutsTable.rowData.map((data, index) => (
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
      </StyledHost>
    );
  }
}
