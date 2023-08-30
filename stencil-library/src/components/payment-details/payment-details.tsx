import { Component, Host, h, Prop, State, Watch } from '@stencil/core';
import { Api, IApiResponseCollection, Payment } from '../../api';
import { MapPaymentStatusToBadge, formatCurrency, formatDate, formatTime } from '../../utils/utils';

/**
  * @exportedPart payment-loading-spinner
  * @exportedPart payment-loading-state
  * @exportedPart payment-empty-state
  * @exportedPart payment-head
  * @exportedPart payment-title
  * @exportedPart payment-method
  * @exportedPart payment-info
  * @exportedPart payment-info-item
  * @exportedPart payment-info-item-title
  * @exportedPart payment-info-item-data
  * @exportedPart payment-metadata
  * @exportedPart payment-metadata-title
  * @exportedPart payment-method-title
  * @exportedPart payment-method-data
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
      <Host
        exportParts='payment-loading-spinner,payment-loading-state,payment-empty-state,
        payment-head,payment-title,payment-method,payment-info,payment-info-item,
        payment-info-item-title,payment-info-item-data,payment-metadata,payment-metadata-title,
        payment-method-title,payment-method-data'
      >
        {this.loading ?
          <main part='payment-loading-state' class="p-2 d-flex justify-content-center">
            <div part='payment-loading-spinner' class="spinner-border spinner-border-sm" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </main>
        :
        !this.payment || this.errorMessage ?
          <main part='payment-empty-state' class="p-2 d-flex justify-content-center">
            <div>{this.errorMessage}</div>
          </main>
        :
          <main class="p-2">
            <div part='payment-head' class="p-2">
              <h1 part='payment-title'>Payment for {this.payment.description}</h1>
              <div class="d-flex flex-row align-items-center gap-2">
                <span class="fs-1">{formatCurrency(this.payment.amount)}</span>
                <span innerHTML={MapPaymentStatusToBadge(this.payment.status)}></span>
              </div>
              <div part="payment-info" class="d-flex flex-row align-items-top gap-4">
                <div part="payment-info-item" class="d-flex flex-column">
                  <span part="payment-info-item-title" class="text-uppercase">Updated</span>
                  <span part="payment-info-item-data">{formatDate(this.payment.updated_at)}</span>
                  <span part="payment-info-item-data">{formatTime(this.payment.updated_at)}</span>
                </div>
                <div part="payment-info-item" class="d-flex flex-column">
                  <span part="payment-info-item-title" class="text-uppercase">Created</span>
                  <span part="payment-info-item-data">{formatDate(this.payment.created_at)}</span>
                  <span part="payment-info-item-data">{formatTime(this.payment.created_at)}</span>
                </div>
                <div part="payment-info-item" class="d-flex flex-column">
                  <span part="payment-info-item-title" class="text-uppercase">Refunded</span>
                  <span part="payment-info-item-data">{formatCurrency(this.payment.amount_refunded)}</span>
                </div>
                <div part="payment-info-item" class="d-flex flex-column">
                  <span part="payment-info-item-title" class="text-uppercase">Fees</span>
                  <span part="payment-info-item-data">{formatCurrency(this.payment.fee_amount)}</span>
                </div>
                <div part="payment-info-item" class="d-flex flex-column">
                  <span part="payment-info-item-title" class="text-uppercase">Balance</span>
                  <span part="payment-info-item-data">{formatCurrency(this.payment.balance)}</span>
                </div>
              </div>
            </div>
            <div part="payment-method" class="mt-4">
              <h2 part="payment-method-title" class="fw-bold fs-5">Payment Method Details</h2>
              <hr/>
              <div class="d-flex flex-row flex-wrap gap-4">
                <div class="d-flex flex-column">
                  <span part="payment-method-item-title" class="text-uppercase">Card Holder</span>
                  <span part="payment-method-item-data">{this.payment.payment_method.card.name}</span>
                </div>
                <div class="d-flex flex-column">
                  <span part="payment-method-item-title" class="text-uppercase">Card Info</span>
                  <span part="payment-method-item-data">{this.payment.payment_method.card.acct_last_four}</span>
                </div>
              </div>
            </div>
            <div class="mt-4">
              <h2 part="payment-metadata-title" class="fw-bold fs-5">Metadata</h2>
              <hr/>
              <pre part="payment-metadata" class="p-2" aria-label="metadata content">
                <code>
                  {JSON.stringify(this.payment.metadata, null, 2)}
                </code>
              </pre>
            </div>
          </main>
        }
      </Host>
    );
  }
}
