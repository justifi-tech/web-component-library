import { Component, Host, h, Prop, State, Watch, Event, EventEmitter } from '@stencil/core';
import {
  PagingInfo,
  Payout,
  PayoutStatuses,
  PayoutStatusesSafeNames,
  pagingDefaults
} from '../../api';
import { formatCurrency, formatDate, formatTime } from '../../utils/utils';
import { tableExportedParts } from '../table/exported-parts';
import { ComponentError } from '../../api/ComponentError';

@Component({
  tag: 'payouts-list-core',
  styleUrl: 'payouts-list.scss',
})

export class PayoutsListCore {
  @Prop() getPayouts: Function;

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

  componentWillLoad() {
    if (this.getPayouts) {
      this.fetchData();
    }
  }

  @Watch('params')
  @Watch('getPayouts')
  updateOnPropChange() {
    this.fetchData();
  }

  mapStatusToBadge = (status: PayoutStatuses) => {
    switch (status) {
      case PayoutStatuses.scheduled:
        return `<span class="badge bg-primary" title='Batched and scheduled to be transferred'>${PayoutStatusesSafeNames[status]}</span>`;
      case PayoutStatuses.in_transit:
        return `<span class="badge bg-primary" title='Transfer to your bank account has been initiated'>${PayoutStatusesSafeNames[status]}</span>`;
      case PayoutStatuses.failed:
        return `<span class="badge bg-danger" title='Transfer to your bank account failed'>${PayoutStatusesSafeNames[status]}</span>`;
      case PayoutStatuses.canceled:
        return `<span class="badge bg-danger" title='Transfer to your bank account failed'>${PayoutStatusesSafeNames[status]}</span>`;
      case PayoutStatuses.forwarded:
        return `<span class="badge bg-secondary" title='This payout initially failed; the funds have been forwarded to your next successful payout'>${PayoutStatusesSafeNames[status]}</span>`;
      case PayoutStatuses.paid:
        return `<span class="badge bg-success" title='Successfully deposited into your bank account'>${PayoutStatusesSafeNames[status]}</span>`;
    }
  }

  handleClickPrevious = (beforeCursor: string) => {
    const newParams: any = { ...this.params };
    delete newParams.after_cursor;
    this.params = ({ ...newParams, before_cursor: beforeCursor });
  };

  handleClickNext = (afterCursor: string) => {
    const newParams: any = { ...this.params };
    delete newParams.before_cursor;
    this.params = ({ ...newParams, after_cursor: afterCursor });
  };

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
          severity
        });
        this.loading = false;
      },
    });
  };

  render() {
    return (
      <Host exportedparts={tableExportedParts}>
        <justifi-table
          rowClickHandler={(e) => {
            const clickedPayoutID = e.target.closest('tr').dataset.rowEntityId;
            if (!clickedPayoutID) { return }
            this.rowClicked.emit(this.payouts.find((payout) => payout.id === clickedPayoutID));
          }}
          columnData={[
            ['Paid Out On', 'The date each transaction occurred'],
            ['Type', 'The type of each transaction'],
            ['Account', 'The ID of the account associated with each payout'],
            ['Paid Out To', 'The bank account to which each payout was transferred'],
            ['Payments', 'Sum of payments in each payout'],
            ['Refunds', 'Sum of refunds in each payout'],
            ['Fees', 'Sum of fees in each payout'],
            ['Other', 'Sum of less common transactions in each payout (disputes, ACH returns, fee refunds, and forwarded balances due to failed payouts)'],
            ['Payout Amount', 'The net sum of all transactions in each payout. This is the amount you\'ll see reflected on your bank statement'],
            ['Status', 'The real-time status of each payout']
          ]}
          entityId={this.payouts.map((payout) => payout.id)}
          rowData={
            this.payouts.map((payout) => (
              [
                {
                  type: 'head',
                  value: `
                    <div class='fw-bold'>${formatDate(payout.created_at)}</div>
                    <div class='fw-bold'>${formatTime(payout.created_at)}</div>
                  `,
                },
                payout.payout_type,
                payout.account_id,
                `${payout.bank_account.full_name} ${payout.bank_account.account_number_last4}`,
                formatCurrency(payout.payments_total),
                formatCurrency(payout.refunds_total),
                formatCurrency(payout.fees_total),
                formatCurrency(payout.other_total),
                formatCurrency(payout.amount),
                {
                  type: 'inner',
                  value: this.mapStatusToBadge(payout.status)
                }
              ]
            ))
          }
          loading={this.loading}
          error-message={this.errorMessage}
          params={this.params}
          paging={{
            ...this.paging,
            handleClickNext: this.handleClickNext,
            handleClickPrevious: this.handleClickPrevious
          }}
        />
      </Host>
    );
  }
}
