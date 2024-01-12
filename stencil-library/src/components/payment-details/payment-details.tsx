import { Component, Host, h, Prop, State, Watch } from '@stencil/core';
import { Api, IApiResponse, IPayment, Payment } from '../../api';
import { MapPaymentStatusToBadge, formatCurrency, formatDate, formatTime } from '../../utils/utils';
import { CodeBlock, DetailItem, DetailSection, EntityHeadInfo, EntityHeadInfoItem, ErrorState, LoadingState } from '../details/utils';
import { config } from '../../../config';

/**
  * @exportedPart detail-loading-spinner
  * @exportedPart detail-loading-state
  * @exportedPart detail-empty-state
  * @exportedPart detail-head
  * @exportedPart detail-title
  * @exportedPart detail-method
  * @exportedPart detail-info
  * @exportedPart detail-info-item
  * @exportedPart detail-info-item-title
  * @exportedPart detail-info-item-data
  * @exportedPart detail-metadata
  * @exportedPart detail-metadata-title
  * @exportedPart detail-method-title
  * @exportedPart detail-method-data
  * @exportedPart detail-section
  * @exportedPart detail-section-title
  * @exportedPart detail-section-item-title
  * @exportedPart detail-section-item-data
  * @exportedPart detail-head-info
  * @exportedPart detail-head-info-item
  * @exportedPart detail-head-info-item-title
  * @exportedPart detail-head-info-item-data
*/
@Component({
  tag: 'justifi-payment-details',
  styleUrl: 'payment-details.scss',
  shadow: true,
})

export class PaymentDetails {
  @Prop() paymentId: string;
  @Prop() authToken: string;
  @State() payment: Payment;
  @State() loading: boolean = true;
  @State() errorMessage: string;

  @Watch('paymentId')
  @Watch('authToken')
  updateOnPropChange() {
    this.fetchData();
  }

  connectedCallback() {
    this.fetchData();
  }

  async fetchData(): Promise<void> {
    this.errorMessage = '';
    if (!this.paymentId || !this.authToken) {
      this.errorMessage = "Can not fetch any data without a PaymentID and an AuthToken";
      this.loading = false;
      return;
    }
    this.loading = true;
    const endpoint = `payments/${this.paymentId}`;
    const response: IApiResponse<IPayment> = await Api(this.authToken, config.proxyApiOrigin).get(endpoint);

    if (!response.error) {
      this.payment = new Payment(response.data);
    } else {
      this.errorMessage = typeof response.error === 'string' ? response.error : response.error.message;
    }

    this.loading = false;
  }

  render() {
    return (
      <Host>
        {this.loading && LoadingState}
        {!this.loading && this.errorMessage && ErrorState(this.errorMessage)}
        {!this.loading && this.payment && (
          <justifi-details error-message={this.errorMessage}>
            <EntityHeadInfo slot="head-info" badge={<span slot='badge' innerHTML={MapPaymentStatusToBadge(this.payment.status)} />} title={`${formatCurrency(this.payment.amount)} ${this.payment.currency.toUpperCase()}`}>
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
                  <DetailItem title="Last 4 Numbers" value={this.payment.lastFourDigits} />
                  <DetailItem title="Brand" value={this.payment.payment_method.card.brand} />
                  <DetailItem title="Cardholder" value={this.payment.payment_method.card.name} />
                </DetailSection>
              )}
              {this.payment.payment_method.bank_account && (
                <DetailSection sectionTitle="Payment Method">
                  <DetailItem title="ID" value={this.payment.payment_method.bank_account.id} />
                  <DetailItem title="Last 4 Numbers" value={this.payment.lastFourDigits} />
                  <DetailItem title="Bank Name" value={this.payment.payment_method.bank_account.bank_name} />
                  <DetailItem title="Account Owner" value={this.payment.payment_method.bank_account.account_owner_name} />
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