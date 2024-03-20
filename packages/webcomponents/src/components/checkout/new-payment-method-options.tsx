import { Component, Event, EventEmitter, h, Prop, Fragment, State } from '@stencil/core';
import { config } from '../../../config';
import { PaymentMethodTypes } from '../../api';

const PaymentMethodTypeLabels = {
  bankAccount: 'Bank account',
  card: 'Credit or debit card',
};

@Component({
  tag: 'justifi-new-payment-method-options',
  styleUrl: 'new-payment-method-options.scss',
  shadow: false,
})
export class NewPaymentMethod {
  @Prop() showCard: boolean;
  @Prop() showAch: boolean;
  @Prop() clientId: string;
  @Prop() accountId: string;
  @Prop({ mutable: true }) iframeOrigin?: string = config.iframeOrigin;

  @State() paymentMethodTypeOptions: PaymentMethodTypes[];
  @State() selectedPaymentMethodType: string;

  @Event({ bubbles: true }) paymentMethodSelected: EventEmitter;

  private billingFormRef?: HTMLJustifiBillingFormElement;
  private paymentMethodFormRef?: HTMLJustifiPaymentMethodFormElement;

  componentWillLoad() {
    this.paymentMethodTypeOptions = [];
    if (this.showCard) {
      this.paymentMethodTypeOptions.push(PaymentMethodTypes.card);
    }
    if (this.showAch) {
      this.paymentMethodTypeOptions.push(PaymentMethodTypes.bankAccount);
    }
  }

  newPaymentMethodForm = (paymentMethodType: PaymentMethodTypes) => {
    return (
      <justifi-payment-method-form
        payment-method-form-type={paymentMethodType}
        iframe-origin={this.iframeOrigin}
      />
    );
  };

  onPaymentMethodTypeOptionClick = (type: PaymentMethodTypes) => {
    this.selectedPaymentMethodType = type;
  };

  async tokenize() {
    try {
      const billingFormFieldValues = await this.billingFormRef.getValues();
      const paymentMethodData = { ...billingFormFieldValues };
      const clientId = this.clientId;
      const tokenizeResponse = await this.paymentMethodFormRef.tokenize(clientId, paymentMethodData, this.accountId);

      if (tokenizeResponse.error) {
        console.error(`An error occured submitting the form: ${tokenizeResponse.error.message}`);
        return null;
      }

      const data = tokenizeResponse.data;
      const tokenizedPaymentMethod = (data as any).card || (data as any).ach; // fix the response types to avoid this
      return tokenizedPaymentMethod.token;
    } catch (error) {
      console.error(`An error occured submitting the form: ${error}`);
      return null;
    }
  }

  paymentMethodOption = (type: PaymentMethodTypes) => {
    const isSelected = this.selectedPaymentMethodType == type;
    return (
      <div class="payment-method">
        <div class="payment-method-header p-3" onClick={() => this.onPaymentMethodTypeOptionClick(type)}>
          <input
            type="radio"
            name="paymentMethodType"
            id={type}
            value={type}
            checked={isSelected}
            onClick={(event) => event.preventDefault()}
            class="form-check-input me-2"
          />
          <label
            htmlFor={type}
            class="form-check-label">
            {PaymentMethodTypeLabels[type]}
          </label>
        </div>
        <div class={(isSelected) ? 'd-block mt-2 pb-4 border-bottom' : 'd-none'}>
          <div class="mb-3">
            {this.newPaymentMethodForm(type)}
          </div>
          <h3 class="fs-6 fw-bold lh-lg mb-4">Billing address</h3>
          <justifi-billing-form></justifi-billing-form>
        </div>
      </div>
    );
  };

  render() {
    return (
      <Fragment>
        <div class="d-flex flex-column">
          {this.paymentMethodTypeOptions.map((type) => this.paymentMethodOption(type))}
        </div>
      </Fragment>
    );
  }
}
