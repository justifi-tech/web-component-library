import { Component, h, State, Prop, Method } from '@stencil/core';
import { BillingFormFields, billingFormSchema } from './billing-form-schema';
import { billingForm } from '../../../styles/parts';
import { Header3 } from '../../../ui-components';
import { FormController } from '../../../ui-components/form/form';

@Component({
  tag: 'justifi-billing-form',
})
export class BillingForm {
  @State() formController: FormController;
  @State() billingInfo: {}
  @State() errors: any = {};

  @Prop({ mutable: true }) legend?: string;
  @Prop() hideCardBillingForm?: boolean;
  @Prop() hideBankAccountBillingForm?: boolean;
  @Prop() paymentMethodType?: string;

  componentWillLoad() {
    const postalOnly = this.isPostalOnlyMode
    this.formController = new FormController(billingFormSchema(postalOnly));
  }

  componentDidLoad() {
    this.formController.values.subscribe(values =>
      this.billingInfo = { ...values }
    );
    this.formController.errors.subscribe(errors => {
      this.errors = { ...errors };
    });
  }

  inputHandler = (name: string, value: string) => {
    this.formController.setValues({
      ...this.formController.values.getValue(),
      [name]: value,
    });
  }

  private get isPostalOnlyMode() {
    return this.paymentMethodType === 'card' && this.hideCardBillingForm;
  }

  private get hideAllBillingFields() {
    return this.paymentMethodType === 'bankAccount' && this.hideBankAccountBillingForm;
  }

  @Method()
  async getValues(): Promise<BillingFormFields> {
    return this.formController.values.getValue();
  }

  @Method()
  async fill(fields: BillingFormFields) {
    this.formController.setInitialValues(fields);
  }

  @Method()
  async validate(): Promise<{ isValid: boolean, errors: any }> {
    const isValid: boolean = await this.formController.validate();
    const errors = this.formController.errors.getValue();
    return { isValid, errors };
  }

  render() {
    const showHeader = !this.isPostalOnlyMode && !this.hideAllBillingFields;

    return (
      <div part={billingForm} class="mt-4" hidden={this.hideAllBillingFields}>
        {showHeader && <Header3 text="Billing address" class="fs-6 fw-bold lh-lg mb-4" />}
        {this.legend && <legend>{this.legend}</legend>}
        {this.isPostalOnlyMode ? (
          <justifi-postal-code-form />
        ) : (
          <justifi-billing-information-form />
        )}
      </div>
    );
  }
}
