import { Component, h, Prop, State, Watch, Event, EventEmitter } from '@stencil/core';
import { Payout } from '../../api';
import { capitalizeFirstLetter, formatDate, formatTime } from '../../utils/utils';
import { CodeBlock, DetailItem, DetailSectionTitle, EntityHeadInfo, EntityHeadInfoItem, ErrorState } from '../../ui-components/details/utils';
import { ComponentErrorEvent, RecordClickEvent } from '../../api/ComponentEvents';
import { Button, StyledHost } from '../../ui-components';
import { MapPayoutStatusToBadge } from '../payouts-list/payouts-status';
import PayoutDetailsLoading from './payout-details-loading';
import { Badge, BadgeVariant } from '../../ui-components/badge/badge';


@Component({
  tag: 'payout-details-core',
})

export class PayoutDetailsCore {
  @Prop() getPayout!: Function;
  @Prop() getPayoutCSV!: Function;
  @Prop() enableRecordClick: boolean = false;

  @State() payout: Payout;
  @State() loading: boolean = true;
  @State() errorMessage: string = null;

  @Event({ eventName: 'error-event' }) errorEvent: EventEmitter<ComponentErrorEvent>;
  @Event({ eventName: 'record-click-event', bubbles: true }) recordClickEvent: EventEmitter<RecordClickEvent>;


  componentWillLoad() {
    if (this.getPayout) {
      this.fetchData();
    }
  }

  @Watch('getPayout')
  getPayoutWatcher() {
    this.fetchData();
  }

  fetchData(): void {
    this.loading = true;

    this.getPayout({
      onSuccess: (payout: Payout) => {
        this.errorMessage = null;
        this.payout = payout;
        this.loading = false;
      },
      onError: ({ error, code, severity }) => {
        this.errorMessage = error;
        this.errorEvent.emit({
          message: error,
          errorCode: code,
          severity,
        });
        this.loading = false;
      },
    });
  }

  downloadCSV = () => {
    this.getPayoutCSV({
      payoutId: this.payout.id,
      onError: ({ error, code, severity }) => {
        this.errorMessage = error;
        this.errorEvent.emit({
          message: error,
          errorCode: code,
          severity,
        });
      },
    });
  }

  formatMethod(deliveryMethod: string): string {
    if (deliveryMethod === "ach") return "ACH";

    return capitalizeFirstLetter(deliveryMethod);
  }


  handleRecordClick = (id: string) => {
    this.recordClickEvent.emit({
      id,
      type: 'account'
    });
  }

  render() {
    return (
      <StyledHost>
        {this.loading && <PayoutDetailsLoading />}
        {!this.loading && this.errorMessage && ErrorState(this.errorMessage)}
        {!this.loading && this.payout && (
          <justifi-details errorMessage={this.errorMessage}>
            <EntityHeadInfo
              slot="head-info"
              badge={(
                <div class="d-flex gap-1">
                  {MapPayoutStatusToBadge(this.payout?.status)}
                  {this.payout.settlement_priority === 'expedited' ? (
                    <Badge
                      variant={BadgeVariant.WARNING}
                      title="Expedited"
                      text="Expedited"
                    />
                  ) : (
                    <Badge
                      variant={BadgeVariant.SECONDARY}
                      title="Standard"
                      text="Standard"
                    />
                  )}
                </div>
              )}
              title={this.payout.formattedPaymentAmount(this.payout.amount)}
            >
              <EntityHeadInfoItem
                classes="border-1 border-end"
                title="Updated At"
                value={`${formatDate(this.payout.updated_at)} ${formatTime(this.payout.updated_at)}`}
              />
              <EntityHeadInfoItem
                classes="border-1 border-end"
                title="Created At"
                value={`${formatDate(this.payout.created_at)} ${formatTime(this.payout.created_at)}`}
              />
              <EntityHeadInfoItem title="ID" value={this.payout.id} />
              <div class="m-4">
                <Button variant="outline-secondary" class="btn btn-outline-secondary d-flex align-items-center" onClick={this.downloadCSV}>
                  Export CSV
                </Button>
              </div>
            </EntityHeadInfo>
            <div slot='detail-sections'>
              <DetailSectionTitle sectionTitle="Details" />
              <div class="d-flex flex-column gap-2 w-100">
                <DetailItem title="Date paid" value={formatDate(this.payout.deposits_at)} />
                <DetailItem title="Statement Description" value={this.payout.description} />
                <DetailItem title="Payout Method" value={this.formatMethod(this.payout.delivery_method)} />
                <DetailItem title="Amount" value={this.payout.formattedPaymentAmount(this.payout.amount)} />
                <DetailItem title="Fee" value={this.payout.formattedPaymentAmount(this.payout.fees_total)} />
              </div>
              <DetailSectionTitle sectionTitle="Account" />
              <div class="d-flex flex-column gap-2 w-100">
                <DetailItem title="ID" value={this.payout.account_id} onClick={this.enableRecordClick ? () => this.handleRecordClick(this.payout.account_id) : undefined} />
                <DetailItem title="Account Type" value={this.payout.bank_account.account_type} />
                <DetailItem title="Institution" value={this.payout.bank_account.account_type} />
                <DetailItem title="Routing Number" value={this.payout.bank_account.routing_number} />
                <DetailItem title="Account Number" value={`**** ${this.payout.bank_account.account_number_last4}`} />
              </div>
              {this.payout.metadata && [
                <DetailSectionTitle sectionTitle='Metadata' />,
                <div class="d-table gap-2 w-100">
                  <CodeBlock metadata={this.payout.metadata} />
                </div>
              ]}
            </div>
          </justifi-details>
        )}
      </StyledHost>
    )
  }
}
