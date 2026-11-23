import { Component, Event, EventEmitter, h, Prop, State, Watch } from '@stencil/core';
import { PaymentService } from '../../api/services/payment.service';
import { makeGetPayments } from '../../actions/payment/get-payments';
import { ComponentErrorCodes, ComponentErrorSeverity } from '../../api/ComponentError';
import JustifiAnalytics from '../../api/Analytics';
import { detectDuplicateVersion } from '../../utils/detect-duplicate-version';
import { StyledHost } from '../../ui-components';
import { paymentTableCells, paymentTableColumns } from './payments-table';
import { defaultColumnsKeys } from './payments-table';
import { ComponentClickEvent, ComponentErrorEvent } from '../../api/ComponentEvents';
import { PagingInfo, Payment, pagingDefaults } from '../../api';
import { TableEmptyState, TableErrorState, TableLoadingState } from '../../ui-components';
import { Table } from '../../utils/table';
import { getRequestParams, onQueryParamsChange } from './payments-list-params-state';
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
import { emitPublic } from '../../api/emit-public';

@Component({
  tag: 'justifi-payments-list',
  shadow: true
})

export class JustifiPaymentsList {
  @State() getPayments: Function;
  @State() errorMessage: string = null;
  @State() payments: Payment[] = [];
  @State() paymentsTable: Table<Payment>;
  @State() loading: boolean = true;
  @State() paging: PagingInfo = pagingDefaults;
  @State() pagingParams: any = {};

  @Prop() accountId!: string;
  @Prop() authToken!: string;
  @Prop() columns?: string = defaultColumnsKeys;

  @Event({ eventName: 'justifi-error' }) errorEvent: EventEmitter<ComponentErrorEvent>;
  /** @deprecated Listen for `justifi-error`. Removed in the next major. */
  @Event({ eventName: 'error-event' }) errorEventLegacy: EventEmitter<ComponentErrorEvent>;
  @Event({ eventName: 'justifi-click', bubbles: true }) clickEvent: EventEmitter<ComponentClickEvent>;
  /** @deprecated Listen for `justifi-click`. Removed in the next major. */
  @Event({ eventName: 'click-event', bubbles: true }) clickEventLegacy: EventEmitter<ComponentClickEvent>;

  analytics: JustifiAnalytics;

  componentWillLoad() {
    detectDuplicateVersion();
    this.analytics = new JustifiAnalytics(this);
    this.paymentsTable = new Table<Payment>(this.payments, this.columns, paymentTableColumns, paymentTableCells);
    this.initializeGetPayments();

    onQueryParamsChange('set', () => {
      this.pagingParams = {};
      this.errorMessage = '';
    });

    onQueryParamsChange('reset', () => {
      this.pagingParams = {};
      this.errorMessage = '';
    });
  }

  disconnectedCallback() {
    this.analytics?.cleanup();
  };

  @Watch('accountId')
  @Watch('authToken')
  propChanged() {
    this.initializeGetPayments();
  }

  @Watch('pagingParams')
  @Watch('getPayments')
  @Watch('columns')
  updateOnPropChange() {
    this.fetchData();
  }

  private initializeGetPayments() {
    if (this.accountId && this.authToken) {
      this.getPayments = makeGetPayments({
        id: this.accountId,
        authToken: this.authToken,
        service: new PaymentService()
      });
    } else {
      this.errorMessage = 'Account ID and Auth Token are required';
      emitPublic(this.errorEvent, this.errorEventLegacy, {
        errorCode: ComponentErrorCodes.MISSING_PROPS,
        message: this.errorMessage,
        severity: ComponentErrorSeverity.ERROR,
      });
    }
  }

  fetchData(): void {
    if (!this.getPayments) return;

    this.loading = true;

    this.getPayments({
      params: this.paymentParams,
      onSuccess: ({ payments, pagingInfo }) => {
        this.payments = payments;
        this.paging = pagingInfo;
        this.paymentsTable.collectionData = this.payments;
      },
      onError: ({ error, code, severity }) => {
        this.errorMessage = error;
        emitPublic(this.errorEvent, this.errorEventLegacy, {
          errorCode: code,
          message: error,
          severity,
        });
      },
      final: () => {
        this.loading = false;
      }
    });
  }

  handleClickPrevious = (beforeCursor: string) => {
    this.pagingParams = { before_cursor: beforeCursor };
    emitPublic(this.clickEvent, this.clickEventLegacy, { name: TableClickActions.previous });
  };

  handleClickNext = (afterCursor: string) => {
    this.pagingParams = { after_cursor: afterCursor };
    emitPublic(this.clickEvent, this.clickEventLegacy, { name: TableClickActions.next });
  };

  rowClickHandler = (e) => {
    const clickedPaymentID = e.target.closest('tr').dataset.rowEntityId;
    if (!clickedPaymentID) return;

    const paymentData = this.payments.find((payment) => payment.id === clickedPaymentID);
    emitPublic(this.clickEvent, this.clickEventLegacy, { name: TableClickActions.row, data: paymentData });
  };

  get paymentParams() {
    const requestParams = getRequestParams();
    const params = { ...requestParams, ...this.pagingParams };
    return params;
  }

  get entityId() {
    return this.payments.map((payment) => payment.id);
  }

  get showEmptyState() {
    return !this.loading && !this.errorMessage && this.paymentsTable.rowData.length < 1;
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
              <TableHeadRow>
                {this.paymentsTable.columnData.map((column) => column)}
              </TableHeadRow>
            </TableHead>
            <TableBody>
              <TableLoadingState
                columnSpan={this.paymentsTable.columnData.length}
                isLoading={this.loading}
              />
              <TableEmptyState
                isEmpty={this.showEmptyState}
                columnSpan={this.paymentsTable.columnData.length}
              />
              <TableErrorState
                columnSpan={this.paymentsTable.columnData.length}
                errorMessage={this.errorMessage}
              />
              {this.showRowData && this.paymentsTable.rowData.map((data, index) => (
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
                  <TableFootCell colSpan={this.paymentsTable.columnData.length}>
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
