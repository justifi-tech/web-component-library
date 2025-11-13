import { Component, h, Prop } from '@stencil/core';
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

  render() {
    return (
      <internal-tokenize-payment-method
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
