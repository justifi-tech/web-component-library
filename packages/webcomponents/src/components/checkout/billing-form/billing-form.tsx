import { Component, h, Prop, Method } from '@stencil/core';
import { billingForm } from '../../../styles/parts';
import { BillingFormFields } from '../../../components';

@Component({
  tag: 'justifi-billing-form',
})
export class BillingForm {
  private formRef: HTMLJustifiBillingInformationFormElement | HTMLJustifiPostalCodeFormElement;

  @Prop({ mutable: true }) legend?: string;
  @Prop() hideCardBillingForm?: boolean;
  @Prop() hideBankAccountBillingForm?: boolean;
  @Prop() paymentMethodType?: string;

  private get isPostalOnlyMode() {
    return this.paymentMethodType === 'card' && this.hideCardBillingForm;
  }

  private get hideAllBillingFields() {
    return this.paymentMethodType === 'bankAccount' && this.hideBankAccountBillingForm;
  }

  @Method()
  async getValues(): Promise<BillingFormFields> {
    return this.formRef?.getValues() ?? {};
  }

  @Method()
  async fill(fields: BillingFormFields) {
    return this.formRef?.fill(fields);
  }

  @Method()
  async validate(): Promise<{ isValid: boolean, errors: any }> {
    const { isValid, errors } = await this.formRef?.validate() ?? { isValid: false, errors: {} };
    return { isValid, errors };
  }

  render() {
    const showHeader = !this.isPostalOnlyMode && !this.hideAllBillingFields;

    return (
      <div part={billingForm} class="mt-4" hidden={this.hideAllBillingFields}>
        {showHeader && <justifi-header text="Billing address" level="h3" class="fs-6 fw-bold lh-lg mb-4" />}
        {this.legend && <legend>{this.legend}</legend>}
        {this.isPostalOnlyMode ? (
          <justifi-postal-code-form ref={(el) => this.formRef = el as HTMLJustifiPostalCodeFormElement} />
        ) : (
          <justifi-billing-information-form ref={(el) => this.formRef = el as HTMLJustifiBillingInformationFormElement} />
        )}
      </div>
    );
  }
}
