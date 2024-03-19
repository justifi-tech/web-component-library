import { Component, Event, EventEmitter, h, Prop, Fragment, State } from '@stencil/core';
import { config } from '../../../config';
import { PaymentMethodTypes } from '../../api';

const PaymentMethodTypeLabels = {
  bankAccount: 'Bank account',
  card: 'Credit or debit card',
};

class PaymentMethodTypeOption {
  id: PaymentMethodTypes;
  label: string;

  constructor(paymentMethodType: PaymentMethodTypes) {
    this.id = paymentMethodType;
    this.label = PaymentMethodTypeLabels[paymentMethodType];
  }
}

@Component({
  tag: 'justifi-new-payment-method-options',
  styleUrl: 'new-payment-method-options.scss',
  shadow: false,
})
export class NewPaymentMethod {
  @Prop() showCard: boolean;
  @Prop() showAch: boolean;
  @Prop({ mutable: true }) iframeOrigin?: string = config.iframeOrigin;
  @Event({ bubbles: true }) paymentMethodSelected: EventEmitter;
  @State() paymentMethodTypeOptions: PaymentMethodTypeOption[];
  @State() selectedPaymentMethodTypeId: string;

  componentWillLoad() {
    this.paymentMethodTypeOptions = [];
    if (this.showCard) {
      this.paymentMethodTypeOptions.push(new PaymentMethodTypeOption(PaymentMethodTypes.card));
    }
    if (this.showAch) {
      this.paymentMethodTypeOptions.push(new PaymentMethodTypeOption(PaymentMethodTypes.bankAccount));
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

  onPaymentMethodTypeOptionClick = (option: PaymentMethodTypeOption) => {
    this.selectedPaymentMethodTypeId = option.id;
  };

  paymentMethodOption = (option: PaymentMethodTypeOption) => {
    const isSelected = this.selectedPaymentMethodTypeId == option.id;
    const isNewPaymentMethod = option.id == PaymentMethodTypes.card || option.id == PaymentMethodTypes.bankAccount;
    return (
      <div class="payment-method">
        <div class="payment-method-header p-3" onClick={() => this.onPaymentMethodTypeOptionClick(option)}>
          <input
            type="radio"
            name="paymentMethodType"
            id={option.id}
            value={option.id}
            checked={isSelected}
            onClick={(event) => event.preventDefault()}
            class="form-check-input me-2"
          />
          <label
            htmlFor={option.id}
            class="form-check-label">
            {option.label}
          </label>
        </div>
        <div class={(isSelected) ? 'd-block mt-2 pb-4 border-bottom' : 'd-none'}>
          <div class="mb-3">
            {isNewPaymentMethod && this.newPaymentMethodForm(option.id)}
          </div>
          <h3 class="fs-6 fw-bold lh-lg">Billing address</h3>
          <justifi-billing-form></justifi-billing-form>
        </div>
      </div>
    );
  };

  render() {
    return (
      <Fragment>
        <div class="d-flex flex-column">
          {this.paymentMethodTypeOptions.map((option) => this.paymentMethodOption(option))}
        </div>
      </Fragment>
    );
  }
}
