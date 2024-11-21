import { Component, h, Prop, State, Watch, Event, EventEmitter } from '@stencil/core';
import { Checkout, ICheckoutsParams, PagingInfo, SubAccount, pagingDefaults } from '../../api';
import { ComponentError } from '../../api/ComponentError';
import { MapCheckoutStatusToBadge, formatCurrency, formatDate, formatTime } from '../../utils/utils';
import { tableExportedParts } from '../../ui-components/table/exported-parts';
import { onFilterChange } from '../../ui-components/filters/utils';
import { StyledHost, TableEmptyState, TableErrorState, TableLoadingState } from '../../ui-components';

const tableColumns = {
  created_at: {
    label: 'Processed On',
    title: 'The date each checkout occurred',
  },
  payment_amount: {
    label: 'Payment Amount',
    title: 'The dollar amount of each checkout',
  },
  payment_description: {
    label: 'Payment Description',
    title: 'The description of each checkout',
  },
  sub_account_name: {
    label: 'Sub Account',
    title: 'The sub account associated with the checkout',
  },
  paymentMode: {
    label: 'Payment Mode',
    title: 'The payment mode of each checkout',
  },
  status: {
    label: 'Status',
    title: 'The current status of each checkout',
  },
}

const tableCells = {
  created_at: (value) => (
    <th>
      <div class="fw-bold">{formatDate(value)}</div>
      <div class="fw-bold">{formatTime(value)}</div>
    </th>
  ),
  payment_amount: (value) => (<td>{formatCurrency(value, true, true)}</td>),
  payment_description: (value) => (<td>{value}</td>),
  sub_account_name: (value) => (<td>{value}</td>),
  paymentMode: (value) => (<td>{value}</td>),
  status: (value) => (<td>{MapCheckoutStatusToBadge(value)}</td>),
}

@Component({
  tag: 'checkouts-list-core'
})
export class CheckoutsListCore {
  @Prop() getCheckouts: Function;
  @Prop() getSubAccounts: Function;
  @Prop() columns: string;

  @State() checkouts: Checkout[] = [];
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
        // this.fetchSubAccounts();
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

  get columnKeys() {
    return this.columns.split(',');
  }

  get columnData() {
    return this.columnKeys.map((key) => tableColumns[key]);
  }

  get rowData() {
    return this.checkouts.map((checkout) => {
      return this.columnKeys.map((key) => {
        return tableCells[key](checkout[key]);
      });
    });
  }

  get showEmptyState() {
    return !this.loading && !this.errorMessage && this.rowData.length < 1;
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
                {this.columnData?.map((column) => (
                  <th part="table-head-cell" scope="col" title={column.title}>
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody class="table-body" part="table-body">
              <TableLoadingState
                columnSpan={this.columnData.length}
                isLoading={this.loading}
              />
              <TableEmptyState
                isEmpty={this.showEmptyState}
                columnSpan={this.columnData.length}
              />
              <TableErrorState
                columnSpan={this.columnData.length}
                errorMessage={this.errorMessage}
              />
              {this.showRowData && this.rowData.map((data) => (<tr>{data}</tr>))}
            </tbody>
            {this.paging && (
              <tfoot class="sticky-bottom">
                <tr class="table-light align-middle">
                  <td part="pagination-bar" colSpan={this.columnData?.length}>
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
