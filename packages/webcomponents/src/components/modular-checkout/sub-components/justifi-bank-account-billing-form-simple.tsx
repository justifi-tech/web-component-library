import { Component, h, Prop, Method } from '@stencil/core';
import { BillingFormFields } from '../../checkout/billing-form/billing-form-schema';
import { StyledHost } from '../../../ui-components';

@Component({
  tag: 'justifi-bank-account-billing-form-simple',
  shadow: true,
})
export class JustifiBankAccountBillingFormSimple {
  private bankAccountBillingFormSimpleRef?: HTMLBankAccountBillingFormSimpleElement;

  @Prop({ mutable: true }) legend?: string;

  @Method()
  async getValues(): Promise<BillingFormFields> {
    return this.bankAccountBillingFormSimpleRef?.getValues() ?? ({} as BillingFormFields);
  }

  @Method()
  async validate(): Promise<{ isValid: boolean, errors: any }> {
    return this.bankAccountBillingFormSimpleRef?.validate() ?? { isValid: false, errors: {} };
  }

  render() {
    return (
      <StyledHost>
        <bank-account-billing-form-simple
          legend={this.legend}
          ref={(el) => (this.bankAccountBillingFormSimpleRef = el as HTMLBankAccountBillingFormSimpleElement)}
        />
      </StyledHost>
    );
  }
}
