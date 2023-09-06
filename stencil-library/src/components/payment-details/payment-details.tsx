import { Component, Host, h, Prop, State, Watch } from '@stencil/core';
import { Api, IApiResponseCollection, Payment } from '../../api';
import { MapPaymentStatusToBadge, formatCurrency, formatDate, formatTime } from '../../utils/utils';
import { ErrorState, LoadingState } from '../details/utils';

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

    const response: IApiResponseCollection<Payment> = await Api(this.authToken).get(endpoint);
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
              title: `${formatCurrency(this.payment.amount)} ${this.payment.currency}`,
              entityHeadInfo: [
                {title: "Updated At", value: `${formatDate(this.payment.updated_at)} ${formatTime(this.payment.updated_at)}`},
                {title: "Created At", value: `${formatDate(this.payment.created_at)} ${formatTime(this.payment.created_at)}`},
                {title: "ID", value: this.payment.id}
              ],
              entitySections: [
                {
                  sectionTitle: "Details",
                  sectionDetails: [
                    {title: "Amount", value: formatCurrency(this.payment.amount)},
                    {title: "Fees", value: formatCurrency(this.payment.fee_amount)},
                    {title: "Refunded", value: this.payment.amount_refunded},
                    {title: "Net", value: this.payment.balance},
                    {title: "Status", value: MapPaymentStatusToBadge(this.payment.status)},
                    {title: "Payment ID", value: this.payment.id},
                    {title: "Processing Fees", value: this.payment.fee_amount},
                    {title: "Statement Descriptor", value: this.payment.description},
                    {title: "Description", value: this.payment.description},
                  ]
                },
                {
                  sectionTitle: "Payment Method",
                  sectionDetails: [
                    {title: "ID", value: this.payment.payment_method.card.id},
                    {title: "Payment Type", value: "Card"},
                    {title: "Last 4 Numbers", value: this.payment.payment_method.card.acct_last_four},
                    {title: "Brand", value: this.payment.payment_method.card.brand},
                    {title: "Cardholder", value: this.payment.payment_method.card.name},
                  ]
                }
              ],
              metadata: this.payment.metadata
            }}
          >
            <span slot='badge' innerHTML={MapPaymentStatusToBadge(this.payment?.status)} />
          </justifi-details>
          }
      </Host>
    );
  }
}
