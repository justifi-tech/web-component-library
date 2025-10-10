import { Component, h, Prop, State, Watch, Event, EventEmitter } from '@stencil/core';
import { DisputeStatus, Payment, PaymentStatuses } from '../../api';
import { formatDate, formatTime, snakeCaseToHumanReadable } from '../../utils/utils';
import { ComponentErrorEvent } from '../../api/ComponentEvents';
import { MapPaymentStatusToBadge, PaymentStatusBadge } from '../payments-list/payments-status';
import { CodeBlock, DetailItem, DetailSectionTitle, EntityHeadInfo, EntityHeadInfoItem, ErrorState } from '../../ui-components/details/utils';
import { StyledHost } from '../../ui-components';
import PaymentDetailsLoading from './payment-details-loading';
import { Badge, BadgeVariant } from '../../ui-components/badge/badge';

@Component({
  tag: 'payment-details-core',
})

export class PaymentDetailsCore {
  @Prop() getPaymentDetails: Function;

  @State() payment: Payment;
  @State() loading: boolean = true;
  @State() errorMessage: string;

  @Event({ eventName: 'error-event' }) errorEvent: EventEmitter<ComponentErrorEvent>

  componentWillLoad() {
    if (this.getPaymentDetails) {
      this.fetchData();
    }
  }

  @Watch('getPaymentDetails')
  updateOnPropChange() {
    this.fetchData();
  }

  fetchData(): void {
    this.loading = true;

    this.getPaymentDetails({
      onSuccess: ({ payment }) => {
        this.payment = payment;
        this.errorMessage = null;
      },
      onError: ({ error, code, severity }) => {
        this.errorMessage = error;
        this.errorEvent.emit({
          errorCode: code,
          message: error,
          severity,
        })
      },
      final: () => {
        this.loading = false;
      },
    });
  }

  get PaymentStatus() {
    if (this.payment.status === PaymentStatuses.disputed) {
      const disputeWasLost = this.payment.disputes.some(
        (dispute) => dispute.status === DisputeStatus.lost
      );
      if (disputeWasLost) {
        return PaymentStatusBadge.DISPUTE_LOST;
      }
    }
    return this.payment.status;
  }

  render() {
    return (
      <StyledHost>
        {this.loading && <PaymentDetailsLoading />}
        {!this.loading && this.errorMessage && ErrorState(this.errorMessage)}
        {!this.loading && !this.errorMessage &&
          this.payment && (
            <justifi-details error-message={this.errorMessage}>
              <EntityHeadInfo
                slot="head-info"
                badge={(
                  <div class="d-flex gap-1">
                    {MapPaymentStatusToBadge(this.PaymentStatus)}
                    {this.payment.expedited ? (
                      <Badge
                        variant={BadgeVariant.WARNING}
                        title="Expedited"
                        text="Expedited"
                      />
                    ) : null}
                  </div>
                )}
                title={this.payment.formattedPaymentAmount(this.payment.amount)}
              >
                <EntityHeadInfoItem
                  classes="border-1 border-end"
                  title="Updated At"
                  value={`${formatDate(this.payment.updated_at)} ${formatTime(this.payment.updated_at)}`}
                />
                <EntityHeadInfoItem
                  classes="border-1 border-end"
                  title="Created At"
                  value={`${formatDate(this.payment.created_at)} ${formatTime(this.payment.created_at)}`}
                />
                <EntityHeadInfoItem title="ID" value={this.payment.id} />
              </EntityHeadInfo>
              <div slot='detail-sections'>
                <DetailSectionTitle sectionTitle="Details" />
                <div class="d-table gap-2 w-100">
                  <DetailItem title="Amount" value={this.payment.formattedPaymentAmount(this.payment.amount)} />
                  <DetailItem title="Fees" value={this.payment.formattedPaymentAmount(this.payment.fee_amount)} />
                  <DetailItem title="Refunded" value={this.payment.formattedPaymentAmount(this.payment.amount_refunded)} />
                  <DetailItem title="Net" value={this.payment.formattedPaymentAmount(this.payment.balance)} />
                  <DetailItem title="Status" value={MapPaymentStatusToBadge(this.PaymentStatus)} />
                  <DetailItem title="Payment ID" value={this.payment.id} />
                  <DetailItem title="Processing Fees" value={this.payment.formattedPaymentAmount(this.payment.fee_amount)} />
                  <DetailItem title="Statement Descriptor" value={this.payment.statement_descriptor} />
                  <DetailItem title="Description" value={this.payment.description} />
                  <DetailItem title="Expedited" value={this.payment.expedited ? 'Yes' : 'No'} />
                </div>
                {this.payment.payment_method.card && [
                  <DetailSectionTitle sectionTitle="Payment Method" />,
                  <div class="d-table gap-2 w-100">
                    <DetailItem title="ID" value={this.payment.payment_method.card.id} />
                    <DetailItem title="Payment Type" value="Card" />
                    <DetailItem title="Last 4 Numbers" value={this.payment.payment_method.lastFourDigits} />
                    <DetailItem title="Brand" value={snakeCaseToHumanReadable(this.payment.payment_method.card.brand)} />
                    <DetailItem title="Cardholder" value={this.payment.payment_method.payersName} />
                  </div>
                ]}
                {this.payment.payment_method.bank_account && [
                  <DetailSectionTitle sectionTitle="Payment Method" />,
                  <div class="d-table gap-2 w-100">
                    <DetailItem title="ID" value={this.payment.payment_method.bank_account.id} />
                    <DetailItem title="Last 4 Numbers" value={this.payment.last_four_digits} />
                    <DetailItem title="Bank Name" value={this.payment.payment_method.bank_account.brand} />
                    <DetailItem title="Account Owner" value={this.payment.payment_method.payersName} />
                  </div>
                ]}
                {this.payment.metadata && [
                  <DetailSectionTitle sectionTitle='Metadata' />,
                  <div class="d-table gap-2 w-100">
                    <CodeBlock metadata={this.payment.metadata} />
                  </div>
                ]}
              </div>
            </justifi-details>
          )}
      </StyledHost>
    );
  }
}
