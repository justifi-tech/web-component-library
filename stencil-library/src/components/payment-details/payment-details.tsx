import { Component, Host, h, Prop, State, Watch } from '@stencil/core';
import { Api, IApiResponseCollection, Payment } from '../../api';
import { MapPaymentStatusToBadge, formatCurrency, formatDate, formatTime } from '../../utils/utils';
import { DetailItem, EntityHeadInfo, EntityHeadInfoItem, ErrorState, LoadingState } from '../details/utils';
import { DetailSection } from '../details/utils';

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

    const response: IApiResponseCollection<Payment> = await Api(this.authToken, process.env.PROXY_API_ORIGIN).get(endpoint);
    if (!response.error) {
      this.payment = response.data;
    } else {
      this.errorMessage = typeof response.error === 'string' ? response.error : response.error.message;
    }

    this.loading = false;
  }

  render() {
    return (
      <Host>
        {
          this.loading ? LoadingState :
            !this.payment ? ErrorState(this.errorMessage) :
              <justifi-details
                error-message={this.errorMessage}
                entity={{
                  metadata: this.payment.metadata
                }}
              >
                <EntityHeadInfo slot="head-info" badge={<span slot='badge' innerHTML={MapPaymentStatusToBadge(this.payment?.status)} />} title={`${formatCurrency(this.payment.amount)} ${this.payment.currency.toUpperCase()}`}>
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
                  <DetailSection sectionTitle="Payment Method">
                    <DetailItem title="ID" value={this.payment.payment_method.card.id} />
                    <DetailItem title="Payment Type" value="Card" />
                    <DetailItem title="Last 4 Numbers" value={this.payment.payment_method.card.acct_last_four} />
                    <DetailItem title="Brand" value={this.payment.payment_method.card.brand} />
                    <DetailItem title="Cardholder" value={this.payment.payment_method.card.name} />
                  </DetailSection>
                </div>
              </justifi-details>
        }
      </Host>
    );
  }
}
