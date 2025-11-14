import { Component, h, Prop, Method } from '@stencil/core';
import { BillingFormFields } from '../checkout/billing-form/billing-form-schema';
import { PaymentMethodPayload } from '../../components';
@Component({
  tag: 'justifi-tokenize-payment-method',
  shadow: true,
})
export class TokenizePaymentMethod {
  @Prop() accountId?: string;
  @Prop() authToken?: string;
  @Prop() disableBankAccount?: boolean;
  @Prop() disableCreditCard?: boolean;
  @Prop() hideBankAccountBillingForm?: boolean;
  @Prop() hideCardBillingForm?: boolean;
  @Prop() hideSubmitButton?: boolean;
  @Prop() paymentMethodGroupId?: string;
  @Prop() submitButtonText?: string = 'Submit';
  @Prop() savePaymentMethodLabel?: string;

  private tokenizePaymentMethodRef?: HTMLInternalTokenizePaymentMethodElement;

  @Method()
  async tokenizePaymentMethod(event?: MouseEvent): Promise<PaymentMethodPayload> {
    return this.tokenizePaymentMethodRef.tokenizePaymentMethod(event);
  }

  @Method()
  async fillBillingForm(fields: BillingFormFields): Promise<void> {
    return this.tokenizePaymentMethodRef.fillBillingForm(fields);
  }

  @Method()
  async validate() {
    return this.tokenizePaymentMethodRef.validate();
  } 

  render() {
    return (
      <internal-tokenize-payment-method
        ref={(el) => this.tokenizePaymentMethodRef = el}
        authToken={this.authToken}
        accountId={this.accountId}
        disableCreditCard={this.disableCreditCard}
        disableBankAccount={this.disableBankAccount}
        hideCardBillingForm={this.hideCardBillingForm}
        hideBankAccountBillingForm={this.hideBankAccountBillingForm}
        hideSubmitButton={this.hideSubmitButton}
        paymentMethodGroupId={this.paymentMethodGroupId}
      />
    );
  }
}
