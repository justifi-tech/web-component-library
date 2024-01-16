import { Component, Host, h, Prop, State, Watch } from '@stencil/core';
import { Api, IApiResponse, Payment } from '../../api';
import { MapPaymentStatusToBadge, formatCurrency, formatDate, formatTime, snakeCaseToHumanReadable } from '../../utils/utils';
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
    if (!this.paymentId || !this.authToken) {
      this.errorMessage = "Can not fetch any data without a PaymentID and an AuthToken";
      this.loading = false;
      return;
    }
    this.loading = true;

    try {
      const endpoint = `payments/${this.paymentId}`;
      const response: IApiResponse<Payment> = await Api(this.authToken, config.proxyApiOrigin).get(endpoint);

      if (!response.error) {
        this.payment = response.data;
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
    if (this.loading) return LoadingState;
    if (this.errorMessage) return ErrorState(this.errorMessage);
    return (
      <Host>
        {this.payment && (
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
