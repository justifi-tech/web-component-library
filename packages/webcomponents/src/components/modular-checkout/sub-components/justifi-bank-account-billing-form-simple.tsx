import { Component, h, Prop, Method } from '@stencil/core';
import JustifiAnalytics from '../../../api/Analytics';
import { checkPkgVersion } from '../../../utils/check-pkg-version';
import { waitForConfig } from '../../config-provider/config-state';
import { BillingFormFields } from '../../checkout/billing-form/billing-form-schema';
import { StyledHost } from '../../../ui-components';

@Component({
  tag: 'justifi-bank-account-billing-form-simple',
  shadow: true,
})
export class JustifiBankAccountBillingFormSimple {
  private bankAccountBillingFormSimpleRef?: HTMLBankAccountBillingFormSimpleElement;

  analytics: JustifiAnalytics;

  @Prop({ mutable: true }) legend?: string;

  async componentWillLoad() {
    await waitForConfig();

    checkPkgVersion();
    this.analytics = new JustifiAnalytics(this);
  }

  disconnectedCallback() {
    this.analytics?.cleanup();
  }

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
