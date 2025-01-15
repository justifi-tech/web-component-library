import { Component, h, Prop, Method, Host } from '@stencil/core';
import { BillingFormFields, PostalFormFields } from './billing-form-schema';
import { billingForm } from '../../styles/parts';
import { Header3 } from '../../ui-components';

@Component({
  tag: 'justifi-billing-form-wrapper',
})
export class BillingFormWrapper {
  private billingFormRef: HTMLBillingFormElement;
  private postalFormRef: HTMLPostalFormElement;

  /**
   * (Optional) A label for the form.
   */
  @Prop({ mutable: true }) legend?: string;
  @Prop() hideCardBillingForm?: boolean;
  @Prop() paymentMethodType?: string;

  get hideFullBillingForm() {
    return this.hideCardBillingForm && this.paymentMethodType === 'card';
  }

  @Method()
  async fill(fields: BillingFormFields | PostalFormFields) {
    if (this.hideFullBillingForm) {
      this.postalFormRef.fill(fields as PostalFormFields);
    } else {
      this.billingFormRef.fill(fields as BillingFormFields);
    }
  }

  @Method()
  async getValues(): Promise<BillingFormFields | PostalFormFields> {
    if (this.hideFullBillingForm) {
      return this.postalFormRef.getValues();
    } else {
      return this.billingFormRef.getValues();
    }
  }

  @Method()
  async validate(): Promise<{ isValid: boolean }> {
    if (this.hideFullBillingForm) {
      return this.postalFormRef.validate();
    } else {
      return this.billingFormRef.validate();
    }
  }

  get renderedForm() {
    if (this.hideFullBillingForm) {
      return (
        <postal-form ref={(el) => (this.postalFormRef = el)}></postal-form>
      );
    } else {
      return (
        <div>
          <Header3 text="Billing address" class="fs-6 fw-bold lh-lg mb-4" />
          <billing-form ref={(el) => (this.billingFormRef = el)}></billing-form>
        </div>
      );
    }
  }

  render() {
    return (
      <Host>
        <div part={billingForm}>
          {this.renderedForm}
        </div>
      </Host>
    );
  }
}
