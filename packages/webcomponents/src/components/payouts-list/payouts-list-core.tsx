import { Component, h, Prop, State, Watch, Event, EventEmitter } from '@stencil/core';
import { PagingInfo, Payout, pagingDefaults } from '../../api';
import { formatCurrency, formatDate, formatTime } from '../../utils/utils';
import { ComponentError, ComponentErrorCodes, ComponentErrorSeverity } from '../../api/ComponentError';
import { DownloadIcon } from '../../assets/download-icon';
import { TableEmptyState, TableErrorState, TableLoadingState } from '../../ui-components';
import { MapPayoutStatusToBadge } from './payouts-status';

@Component({
  tag: 'payouts-list-core',
})

export class PayoutsListCore {
  @Prop() getPayouts: Function;
  @Prop() getPayoutCSV: Function;

  @State() payouts: Payout[] = [];
  @State() loading: boolean = true;
  @State() errorMessage: string;
  @State() paging: PagingInfo = pagingDefaults;
  @State() params: any;

  @Event({
    eventName: 'payout-row-clicked',
    bubbles: true,
  }) rowClicked: EventEmitter<Payout>;

  @Event({ eventName: 'error-event' }) errorEvent: EventEmitter<ComponentError>;

  @Watch('params')
  @Watch('getPayouts')
  updateOnPropChange() {
    this.fetchData();
  }

  componentWillLoad() {
    if (this.getPayouts) {
      this.fetchData();
    }
  }

  fetchData(): void {
    this.loading = true;

    this.getPayouts({
      params: this.params,
      onSuccess: ({ payouts, pagingInfo }) => {
        this.payouts = payouts;
        this.paging = pagingInfo;
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

  handleDateChange = (name: string, value: string) => {
    this.params = { ...this.params, [name]: value };
  }

  handleClickPrevious = (beforeCursor: string) => {
    const newParams = { ...this.params };
    delete newParams.after_cursor;
    this.params = { ...newParams, before_cursor: beforeCursor };
  }

  handleClickNext = (afterCursor: string) => {
    const newParams = { ...this.params };
    delete newParams.before_cursor;
    this.params = { ...newParams, after_cursor: afterCursor };
  }

  rowClickHandler = (e) => {
    const clickedPayoutID = e.target.closest('tr').dataset.rowEntityId;
    if (!clickedPayoutID) return;
    this.rowClicked.emit(this.payouts.find((payout) => payout.id === clickedPayoutID));
  }

  get entityId() {
    return this.payouts.map((payout) => payout.id);
  }

  get columnData() {
    return [
      ['Paid Out On', 'The date each transaction occurred'],
      // ['Type', 'The type of each transaction'],
      ['Sub Account Name', 'The name of the account associated with each payout'],
      // ['Paid Out To', 'The bank account to which each payout was transferred'],
      ['Payments', 'Sum of payments in each payout'],
      ['Refunds', 'Sum of refunds in each payout'],
      ['Fees', 'Sum of fees in each payout'],
      ['Other', 'Sum of less common transactions in each payout'],
      ['Payout Amount', 'The net sum of all transactions in each payout'],
      ['Status', 'The real-time status of each payout'],
      ['Actions', ''],
    ];
  }

  get rowData() {
    return this.payouts.map((payout) => [
      formatDate(payout.created_at),
      // payout.payout_type,
      payout.sub_account_name,
      // `${payout.bank_account.full_name} ${payout.bank_account.account_number_last4}`,
      formatCurrency(payout.payments_total),
      formatCurrency(payout.refunds_total),
      formatCurrency(payout.fees_total),
      formatCurrency(payout.other_total),
      formatCurrency(payout.amount),
      { type: 'inner', value: MapPayoutStatusToBadge(payout.status) },
      (
        <DownloadIcon
          title="Export CSV"
          onClick={() => this.downloadCSV(payout.id)}
          style={{ height: '24px', width: '24px', cursor: 'pointer' }}
        />
      ),
    ]);
  }

  get showEmptyState() {
    return !this.loading && !this.errorMessage && this.rowData.length < 1;
  }

  get showErrorState() {
    return !this.loading && !!this.errorMessage;
  }

  get showRowData() {
    return !this.showEmptyState && !this.showErrorState;
  }

  render() {
    return (
      <div>
        <div class="row gy-3 mb-4">
          <div class="col-2">
            <form-control-date
              name="created_after"
              label="Date from:"
              inputHandler={this.handleDateChange}
            />
          </div>
          <div class="col-2">
            <form-control-date
              name="created_before"
              label="Date to:"
              inputHandler={this.handleDateChange}
            />
          </div>
        </div>
        <div class="table-wrapper">
          <table class="table table-hover">
            <thead class="table-head sticky-top" part="table-head">
              <tr class="table-light text-nowrap" part="table-head-row">
                {this.columnData.map((column) => (
                  <th part="table-head-cell" scope="col" title={Array.isArray(column) ? column[1] : ''}>
                    {Array.isArray(column) ? column[0] : column}
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
              {this.showRowData &&
                this.rowData.map((data, index) => (
                  <tr
                    data-test-id="table-row"
                    data-row-entity-id={this.entityId[index]}
                    onClick={this.rowClickHandler}
                    part={`table-row ${index % 2 ? 'table-row-even' : 'table-row-odd'}`}
                  >
                    {data.map((dataEntry: any) => (
                      dataEntry?.type ? (
                        <td part="table-cell" innerHTML={dataEntry.value}></td>
                      ) : (
                        <td part="table-cell">{dataEntry}</td>
                      )
                    ))}
                  </tr>
                ))}
            </tbody>
            {this.paging && (
              <tfoot class="sticky-bottom">
                <tr class="table-light align-middle">
                  <td part="pagination-bar" colSpan={this.columnData.length}>
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
      </div>
    );
  }
}
