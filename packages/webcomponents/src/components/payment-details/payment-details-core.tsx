import { Component, Host, h, Prop, State, Watch } from '@stencil/core';
import { Payment } from '../../api';
import { MapPaymentStatusToBadge, formatCurrency, formatDate, formatTime, snakeCaseToHumanReadable } from '../../utils/utils';
import { CodeBlock, DetailItem, DetailSection, EntityHeadInfo, EntityHeadInfoItem, ErrorState, LoadingState } from '../details/utils';
import { PaymentService } from '../payments-list/payment.service';

@Component({
  tag: 'payment-details-core',
  styleUrl: 'payment-details.scss',
})

export class PaymentDetailsCore {
  @Prop() paymentId: string;
  @Prop() authToken: string;
  @Prop() paymentService: PaymentService;
  @State() payment: Payment;
  @State() loading: boolean = true;
  @State() errorMessage: string;

  @Watch('paymentId')
  @Watch('authToken')
  @Watch('paymentService')
  updateOnPropChange() {
    this.fetchData();
  }

  connectedCallback() {
    this.fetchData();
  }

  async fetchData(): Promise<void> {
    if (!this.paymentId || !this.authToken) {
      this.errorMessage = "Can not fetch any data without a PaymentID and an AuthToken";
      this.loading = false;
      return;
    }

    if (!this.paymentService) {
      return;
    }

    this.loading = true;

    try {
      const response = await this.paymentService.fetchPayment(this.paymentId, this.authToken);

      if (!response.error) {
        this.payment = new Payment(response.data)
        this.errorMessage = null;
      } else {
        const responseError = typeof response.error === 'string' ? response.error : response.error.message;
        this.errorMessage = `Error trying to fetch data : ${responseError}`;
        console.error(this.errorMessage);
      }
    } catch (error) {
      this.errorMessage = `Error trying to fetch data : ${error}`;
      console.error(this.errorMessage);
    } finally {
      this.loading = false;
    }
  }

  render() {
    return (
      <Host>
        {this.loading && LoadingState}
        {!this.loading && this.errorMessage && ErrorState(this.errorMessage)}
        {!this.loading && !this.errorMessage &&
          this.payment && (
            <justifi-details error-message={this.errorMessage}>
              <EntityHeadInfo
                slot="head-info"
                badge={<span slot='badge' innerHTML={MapPaymentStatusToBadge(this.payment.status)} />}
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
              <div slot='detail-sections'>
                <DetailSection sectionTitle="Details">
                  <DetailItem title="Amount" value={formatCurrency(this.payment.amount)} />
                  <DetailItem title="Fees" value={formatCurrency(this.payment.fee_amount)} />
                  <DetailItem title="Refunded" value={formatCurrency(this.payment.amount_refunded)} />
                  <DetailItem title="Net" value={formatCurrency(this.payment.balance)} />
                  <DetailItem title="Status" value={MapPaymentStatusToBadge(this.payment.status)} />
                  <DetailItem title="Payment ID" value={this.payment.id} />
                  <DetailItem title="Processing Fees" value={formatCurrency(this.payment.fee_amount)} />
                  <DetailItem title="Statement Descriptor" value={this.payment.statement_descriptor} />
                  <DetailItem title="Description" value={this.payment.description} />
                </DetailSection>
                {this.payment.payment_method.card && (
                  <DetailSection sectionTitle="Payment Method">
                    <DetailItem title="ID" value={this.payment.payment_method.card.id} />
                    <DetailItem title="Payment Type" value="Card" />
                    <DetailItem title="Last 4 Numbers" value={this.payment.payment_method.lastFourDigits} />
                    <DetailItem title="Brand" value={snakeCaseToHumanReadable(this.payment.payment_method.card.brand)} />
                    <DetailItem title="Cardholder" value={this.payment.payment_method.payersName} />
                  </DetailSection>
                )}
                {this.payment.payment_method.bank_account && (
                  <DetailSection sectionTitle="Payment Method">
                    <DetailItem title="ID" value={this.payment.payment_method.bank_account.id} />
                    <DetailItem title="Last 4 Numbers" value={this.payment.payment_method.lastFourDigits} />
                    <DetailItem title="Bank Name" value={this.payment.payment_method.bank_account.brand} />
                    <DetailItem title="Account Owner" value={this.payment.payment_method.payersName} />
                  </DetailSection>
                )}
                <DetailSection sectionTitle='Metadata'>
                  <CodeBlock metadata={this.payment.metadata} />
                </DetailSection>
              </div>
            </justifi-details>
          )}
      </Host>
    );
  }
}
