import { Component, h, Prop, Method } from '@stencil/core';
import { BillingFormFields } from './billing-form-schema';

@Component({
  tag: 'justifi-billing-form',
})
export class BillingForm {
  @Prop({ mutable: true }) legend?: string;
  @Prop() hideCardBillingForm?: boolean;
  @Prop() hideBankAccountBillingForm?: boolean;
  @Prop() paymentMethodType?: string;

  private selectedFormRef?: any;

  private get showSimpleCardBillingForm() {
    return this.paymentMethodType === 'card' && this.hideCardBillingForm;
  }

  private get showSimpleBankAccountBillingForm() {
    return this.paymentMethodType === 'bankAccount' && this.hideBankAccountBillingForm;
  }

  @Method()
  async getValues(): Promise<BillingFormFields> {
    return this.selectedFormRef?.getValues();
  }

  @Method()
  async fill(fields: BillingFormFields) {
    this.selectedFormRef?.fill(fields);
  }

  @Method()
  async validate(): Promise<{ isValid: boolean, errors: any }> {
    return this.selectedFormRef?.validate();
  }

  render() {
    if (this.showSimpleBankAccountBillingForm) {
      return (
        <justifi-bank-account-billing-form-simple
          legend={this.legend}
          ref={(el: any) => (this.selectedFormRef = el)}
        />
      );
    }

    if (this.showSimpleCardBillingForm) {
      return (
        <justifi-card-billing-form-simple
          legend={this.legend}
          ref={(el: any) => (this.selectedFormRef = el)}
        />
      );
    }

    return (
      <justifi-billing-form-full
        legend={this.legend}
        ref={(el) => (this.selectedFormRef = el)}
      />
    );
  }
}
