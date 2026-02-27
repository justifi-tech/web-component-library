import { Component, h, Prop, Method } from '@stencil/core';
import { BillingFormFields } from '../../checkout/billing-form/billing-form-schema';
import { StyledHost } from '../../../ui-components';

@Component({
  tag: 'justifi-card-billing-form-simple',
  shadow: true,
})
export class JustifiCardBillingFormSimple {
  private cardBillingFormSimpleRef?: HTMLCardBillingFormSimpleElement;

  @Prop({ mutable: true }) legend?: string;

  @Method()
  async getValues(): Promise<BillingFormFields> {
    return this.cardBillingFormSimpleRef?.getValues() ?? ({} as BillingFormFields);
  }

  @Method()
  async validate(): Promise<{ isValid: boolean, errors: any }> {
    return this.cardBillingFormSimpleRef?.validate() ?? { isValid: false, errors: {} };
  }

  render() {
    return (
      <StyledHost>
        <card-billing-form-simple
          legend={this.legend}
          ref={(el) => (this.cardBillingFormSimpleRef = el as HTMLCardBillingFormSimpleElement)}
        />
      </StyledHost>
    );
  }
}
