import {
  Component,
  Host,
  h,
  Prop,
  State,
  Watch,
  Event,
  EventEmitter,
} from '@stencil/core';
import { Api, IApiResponseCollection } from '../../api';
import { formatCurrency, formatDate } from '../../utils/utils';
import { PagingInfo, pagingDefaults } from '../table/table-utils';
import {
  Proceed,
  ProceedStatuses,
  ProceedStatusesSafeNames,
} from '../../api/Proceed';

/**
 * @exportedPart table-head: Table head
 * @exportedPart table-head-row: Head row
 * @exportedPart table-head-cell: Individual head cell
 * @exportedPart table-body: Body of the table
 * @exportedPart table-row: Row of the table
 * @exportedPart table-cell: Individual cell of the table
 * @exportedPart loading-state-cell: Row for loading state
 * @exportedPart loading-state-spinner: Spinner element for loading state
 * @exportedPart error-state: Row for Error state
 * @exportedPart empty-state: Row for Emtpy state
 * @exportedPart pagination-bar: Pagination bar
 * @exportedPart arrow: Both paging buttons
 * @exportedPart arrow-left: Previous page button
 * @exportedPart arrow-right: Next page button
 * @exportedPart button-disabled: Disabled state for paging buttons
 * @exportedPart previous-button-text: Text for Previous button
 * @exportedPart next-button-text: Text for Next button
 */
@Component({
  tag: 'justifi-proceeds-list',
  styleUrl: 'proceeds-list.scss',
  shadow: true,
})
export class ProceedsList {
  /**
   * The Account ID to fetch payments.
   * This is required to fetch any data.
   * @required
   * @type {string}
   */
  @Prop() accountId: string;
  /**
   * The Auth Token to fetch payments.
   * This is required to fetch any data.
   * @required
   * @type {string}
   */
  @Prop() authToken: string;
  @State() proceeds: Proceed[] = [];
  @State() loading: boolean = true;
  @State() errorMessage: string;
  @State() paging: PagingInfo = pagingDefaults;
  /**
   * @event proceed-row-clicked
   * @type {Proceed}
   * @description
   * Event emitted when a row is clicked.
   * @memberof ProceedsList
   */
  @Event({
    eventName: 'proceed-row-clicked',
    bubbles: true,
  })
  rowClicked: EventEmitter<Proceed>;

  @Watch('accountId')
  @Watch('authToken')
  updateOnPropChange() {
    this.fetchData();
  }

  connectedCallback() {
    this.fetchData();
  }

  onPageChange = (direction: string) => {
    return () => {
      this.fetchData(direction);
    };
  };

  mapStatusToBadge = (status: ProceedStatuses) => {
    switch (status) {
      case ProceedStatuses.scheduled:
        return `<span class="badge bg-primary" title='Batched and scheduled to be transferred'>${ProceedStatusesSafeNames[status]}</span>`;
      case ProceedStatuses.in_transit:
        return `<span class="badge bg-primary" title='Transfer to your bank account has been initiated'>${ProceedStatusesSafeNames[status]}</span>`;
      case ProceedStatuses.failed:
        return `<span class="badge bg-danger" title='Transfer to your bank account failed'>${ProceedStatusesSafeNames[status]}</span>`;
      case ProceedStatuses.canceled:
        return `<span class="badge bg-danger" title='Transfer to your bank account failed'>${ProceedStatusesSafeNames[status]}</span>`;
      case ProceedStatuses.forwarded:
        return `<span class="badge bg-secondary" title='This payout initially failed; the funds have been forwarded to your next successful batch of proceeds'>${ProceedStatusesSafeNames[status]}</span>`;
      case ProceedStatuses.paid:
        return `<span class="badge bg-success" title='Successfully deposited into your bank account'>${ProceedStatusesSafeNames[status]}</span>`;
    }
  };

  async fetchData(direction?: string): Promise<void> {
    if (!this.accountId || !this.authToken) {
      this.errorMessage =
        'Can not fetch any data without an AccountID and an AuthToken';
      this.loading = false;
      return;
    }
    this.loading = true;
    const endpoint = `account/${this.accountId}/proceeds`;

    const response: IApiResponseCollection<Proceed[]> = await Api(
      this.authToken,
    ).get(endpoint, {
      paging: this.paging,
      direction: direction,
    });
    if (!response.error) {
      this.paging = {
        ...this.paging,
        ...response.page_info,
      };

      const data = response?.data?.map(dataItem => new Proceed(dataItem));
      this.proceeds = data;
    } else {
      this.errorMessage =
        typeof response.error === 'string'
          ? response.error
          : response.error.message;
    }

    this.loading = false;
  }

  render() {
    return (
      <Host>
        <justifi-table
          rowClickHandler={e => {
            const clickedProceedID = e.target.closest('tr').dataset.rowEntityId;
            if (!clickedProceedID) {
              return;
            }
            this.rowClicked.emit(
              this.proceeds.find(proceed => proceed.id === clickedProceedID),
            );
          }}
          entityId={this.proceeds.map(proceed => proceed.id)}
          columnData={[
            [
              'Paid Out On',
              'The date each batch of proceeds is transferred to your bank account',
            ],
            ['Paid Out To', 'The bank account to which each payout is sent'],
            [
              'From Payments',
              'The amount added related to payments in each payout',
            ],
            [
              'From Refunds',
              'The amount deducted related to refunds in each payout',
            ],
            [
              'Other',
              'The amount related to less common transactions in each payout (disputes, ACH returns, fee refunds, and forwarded balances due to failed payouts)',
            ],
            [
              'Proceeds Amount',
              "The net sum of all transactions in each payout. This is the amount you'll see reflected on your bank statement.",
            ],
            ['Status', 'The real-time status of each payout'],
          ]}
          rowData={this.proceeds.map(proceed => [
            {
              type: 'head',
              value: formatDate(proceed.deposits_at),
            },
            proceed.bank_account.full_name,
            formatCurrency(proceed.payments_total),
            formatCurrency(proceed.refunds_total),
            formatCurrency(proceed.other_total),
            formatCurrency(proceed.amount),
            {
              type: 'inner',
              value: this.mapStatusToBadge(proceed.status),
            },
          ])}
          loading={this.loading}
          error-message={this.errorMessage}
          paging={{
            ...this.paging,
            onPrev: this.onPageChange('prev'),
            onNext: this.onPageChange('next'),
          }}
        />
      </Host>
    );
  }
}
