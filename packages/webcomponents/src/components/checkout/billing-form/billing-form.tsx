import { Component, h, Prop, Method } from '@stencil/core';
import { BillingFormFields } from './billing-form-schema';
import { StyledHost } from '../../../ui-components';

@Component({
  tag: 'justifi-billing-form',
  shadow: true,
})
export class JustifiBillingForm {
  private billingFormRef?: HTMLBillingFormElement;

  @Prop({ mutable: true }) legend?: string;
  @Prop() hideCardBillingForm?: boolean;
  @Prop() hideBankAccountBillingForm?: boolean;
  @Prop() paymentMethodType?: string;

  @Method()
  async getValues(): Promise<BillingFormFields> {
    return this.billingFormRef?.getValues() ?? ({} as BillingFormFields);
  }

  @Method()
  async validate(): Promise<{ isValid: boolean, errors: any }> {
    return this.billingFormRef?.validate() ?? { isValid: false, errors: {} };
  }

  render() {
    return (
      <StyledHost>
        <billing-form
          legend={this.legend}
          hideCardBillingForm={this.hideCardBillingForm}
          hideBankAccountBillingForm={this.hideBankAccountBillingForm}
          paymentMethodType={this.paymentMethodType}
          ref={(el) => (this.billingFormRef = el as HTMLBillingFormElement)}
        />
      </StyledHost>
    );
  }
}
