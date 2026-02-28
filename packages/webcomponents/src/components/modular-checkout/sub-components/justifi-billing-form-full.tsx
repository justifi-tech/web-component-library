import { Component, h, Prop, Method } from '@stencil/core';
import { BillingFormFields } from '../../checkout/billing-form/billing-form-schema';
import { StyledHost } from '../../../ui-components';

@Component({
  tag: 'justifi-billing-form-full',
  shadow: true,
})
export class JustifiBillingFormFull {
  private billingFormFullRef?: HTMLBillingFormFullElement;

  @Prop({ mutable: true }) legend?: string;

  @Method()
  async getValues(): Promise<BillingFormFields> {
    return this.billingFormFullRef?.getValues() ?? ({} as BillingFormFields);
  }

  @Method()
  async validate(): Promise<{ isValid: boolean, errors: any }> {
    return this.billingFormFullRef?.validate() ?? { isValid: false, errors: {} };
  }

  render() {
    return (
      <StyledHost>
        <billing-form-full
          legend={this.legend}
          ref={(el) => (this.billingFormFullRef = el as HTMLBillingFormFullElement)}
        />
      </StyledHost>
    );
  }
}
