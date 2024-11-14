import { Component, h, Prop, State, Watch, Event, EventEmitter } from '@stencil/core';
import { Checkout, ICheckoutsParams, PagingInfo, pagingDefaults } from '../../api';
import { ComponentError } from '../../api/ComponentError';
import { MapPaymentStatusToBadge, formatCurrency, formatDate, formatTime } from '../../utils/utils';
import { tableExportedParts } from '../table/exported-parts';
import { onFilterChange } from '../../ui-components/filters/utils';
import { StyledHost, TableEmptyState, TableErrorState, TableLoadingState } from '../../ui-components';

@Component({
  tag: 'checkouts-list-core'
})
export class CheckoutsListCore {
  @State() checkouts: Checkout[] = [];
  @State() loading: boolean = true;
  @State() errorMessage: string;
  @State() paging: PagingInfo = pagingDefaults;
  @State() params: ICheckoutsParams = {};

  @Prop() getCheckoutsList: Function;

  @Watch('params')
  @Watch('getCheckouts')
  updateOnPropChange() {
    this.fetchData();
  }

  @Event({
    eventName: 'checkout-row-clicked',
    bubbles: true,
  }) rowClicked: EventEmitter<Checkout>;

  @Event({ eventName: 'error-event' }) errorEvent: EventEmitter<ComponentError>;

  componentWillLoad() {
    if (this.getCheckoutsList) {
      this.fetchData();
    }
  }

  fetchData(): void {
    this.loading = true;

    this.getCheckoutsList({
      params: this.params,
      onSuccess: ({ checkouts, pagingInfo }) => {
        this.checkouts = checkouts;
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
    this.params = {};
  }

  get entityId() {
    return this.checkouts.map((checkout) => checkout.id);
  }

  get columnData() {
    return [
      ['Processed On', 'The date each checkout occurred'],
      ['Payment Amount', 'The dollar amount of each checkout'],
      ['Payment Description', 'The description of each checkout'],
      ['Account ID', 'The unique identifier of the account associated with each checkout'],
      ['Payment Mode', 'The payment mode of each checkout'],
      ['Status', 'The current status of each checkout'],
    ];
  }

  get rowData() {
    return this.checkouts.map((checkout) => [
      {
        type: 'head',
        value: `
          <div class="fw-bold">${formatDate(checkout.created_at)}</div>
          <div class="fw-bold">${formatTime(checkout.created_at)}</div>
        `,
      },
      formatCurrency(checkout.payment_amount, true, true),
      checkout.description,
      checkout.account_id,
      'ecom',
      {
        type: 'inner',
        value: MapPaymentStatusToBadge(checkout.status),
      },
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
                  <th part="table-head-cell" scope="col" title={Array.isArray(column) ? column[1] : ""}>
                    {!Array.isArray(column) ? column : column[0]}
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
                    part={`table-row ${index % 2 ? "table-row-even" : "table-row-odd"}`}
                  >
                    {data.map((dataEntry: any) => {
                      let nestedHtml = dataEntry?.type;
                      if (nestedHtml) {
                        return <td part="table-cell" innerHTML={dataEntry.value}></td>;
                      } else {
                        return <td part="table-cell">{dataEntry}</td>;
                      }
                    })}
                  </tr>
                ))}
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
