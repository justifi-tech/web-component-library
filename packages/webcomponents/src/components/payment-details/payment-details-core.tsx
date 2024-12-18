import { Component, h, Prop, State, Watch, Event, EventEmitter } from '@stencil/core';
import { Payment } from '../../api';
import { formatCurrency, formatDate, formatTime, snakeCaseToHumanReadable } from '../../utils/utils';
import { CodeBlock, DetailItem, DetailSectionTitle, EntityHeadInfo, EntityHeadInfoItem, ErrorState, LoadingState } from '../../ui-components/details/utils';
import { ComponentError } from '../../api/ComponentError';
import { StyledHost } from '../../ui-components';
import { MapPaymentStatusToBadge } from '../payments-list/payments-status';

@Component({
  tag: 'payment-details-core',
})

export class PaymentDetailsCore {
  @Prop() getPaymentDetails: Function;

  @State() payment: Payment;
  @State() loading: boolean = true;
  @State() errorMessage: string;

  @Event({ eventName: 'error-event' }) errorEvent: EventEmitter<ComponentError>

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
        this.loading = false;
        this.errorMessage = null;
      },
      onError: ({ error, code, severity }) => {
        this.errorMessage = error;
        this.errorEvent.emit({
          errorCode: code,
          message: error,
          severity,
        })
        this.loading = false;
      },
    });
  }

  render() {
    return (
      <StyledHost>
        {this.loading && LoadingState()}
        {!this.loading && this.errorMessage && ErrorState(this.errorMessage)}
        {!this.loading && !this.errorMessage &&
          this.payment && (
            <justifi-details error-message={this.errorMessage}>
              <EntityHeadInfo
                slot="head-info"
                badge={<span slot='badge' part="detail-head-badge" innerHTML={MapPaymentStatusToBadge(this.payment.status)} />}
                title={`${formatCurrency(this.payment.amount)} ${this.payment?.currency.toUpperCase()}`}
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
              <div slot='detail-sections' part="detail-section">
                <DetailSectionTitle sectionTitle="Details" />
                <div class="d-table gap-2 w-100">
                  <DetailItem title="Amount" value={formatCurrency(this.payment.amount)} />
                  <DetailItem title="Fees" value={formatCurrency(this.payment.fee_amount)} />
                  <DetailItem title="Refunded" value={formatCurrency(this.payment.amount_refunded)} />
                  <DetailItem title="Net" value={formatCurrency(this.payment.balance)} />
                  <DetailItem title="Status" value={MapPaymentStatusToBadge(this.payment.status)} />
                  <DetailItem title="Payment ID" value={this.payment.id} />
                  <DetailItem title="Processing Fees" value={formatCurrency(this.payment.fee_amount)} />
                  <DetailItem title="Statement Descriptor" value={this.payment.statement_descriptor} />
                  <DetailItem title="Description" value={this.payment.description} />
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
                    <DetailItem title="Last 4 Numbers" value={this.payment.payment_method.lastFourDigits} />
                    <DetailItem title="Bank Name" value={this.payment.payment_method.bank_account.brand} />
                    <DetailItem title="Account Owner" value={this.payment.payment_method.payersName} />
                  </div>
                ]}
                <DetailSectionTitle sectionTitle='Metadata' />
                <div class="d-table gap-2 w-100">
                  <CodeBlock metadata={this.payment.metadata} />
                </div>
              </div>
            </justifi-details>
          )}
      </StyledHost>
    );
  }
}
