import { Component, h, State, Prop, Method } from '@stencil/core';
import { BillingFormFields, fullBillingSchema } from './billing-form-schema';
import { billingForm } from '../../../styles/parts';
import { Header3 } from '../../../ui-components';
import StateOptions from '../../../utils/state-options';
import { FormController } from '../../../ui-components/form/form';
import { checkoutStore, onChange } from '../../../store/checkout.store';

@Component({
  tag: 'billing-form-full',
})
export class BillingFormFull {
  @State() formController: FormController;
  @State() billingInfo: {}
  @State() errors: any = {};

  @Prop({ mutable: true }) legend?: string;

  private unsubscribeFromStore?: () => void;

  componentWillLoad() {
    this.formController = new FormController(fullBillingSchema());
    const fields = checkoutStore.billingFormFields;
    if (fields && Object.keys(fields).some((k) => (fields as any)[k])) {
      this.formController.setInitialValues(fields);
    }

    this.formController.values.subscribe(values =>
      this.billingInfo = { ...values }
    );
    this.formController.errors.subscribe(errors => {
      this.errors = { ...errors };
    });
  }

  componentDidLoad() {
    this.unsubscribeFromStore = onChange('billingFormFields', (newValue) => {
      this.formController.setInitialValues(newValue);
    });
  }

  disconnectedCallback() {
    this.unsubscribeFromStore?.();
  }

  inputHandler = (name: string, value: string) => {
    this.formController.setValues({
      ...this.formController.values.getValue(),
      [name]: value,
    });
  }

  @Method()
  async getValues(): Promise<BillingFormFields> {
    return this.formController.values.getValue();
  }

  @Method()
  async validate(): Promise<{ isValid: boolean, errors: any }> {
    const isValid: boolean = await this.formController.validate();
    const errors = this.formController.errors.getValue();
    return { isValid, errors };
  }

  render() {
    if (!this.formController) {
      return null;
    }

    const billingFormDefaultValue = this.formController.getInitialValues();

    return (
      <div part={billingForm} class="mt-4">
        <Header3 text="Billing address" class="fs-6 fw-bold lh-lg mb-4" />
        <form>
          <fieldset>
            {this.legend && (
              <legend>{this.legend}</legend>
            )}
            <div class="row gy-3">
              <div class="col-12">
                <form-control-text
                  name='name'
                  label='Full Name'
                  defaultValue={billingFormDefaultValue.name}
                  errorText={this.errors.name}
                  inputHandler={this.inputHandler}
                />
              </div>
              <div class="col-12">
                <form-control-text
                  name='address_line1'
                  label='Street Address'
                  defaultValue={billingFormDefaultValue.address_line1}
                  errorText={this.errors.address_line1}
                  inputHandler={this.inputHandler}
                />
              </div>
              <div class="col-12">
                <form-control-text
                  name='address_line2'
                  label="Apartment, Suite, etc. (optional)"
                  defaultValue={billingFormDefaultValue.address_line2}
                  errorText={this.errors.address_line2}
                  inputHandler={this.inputHandler}
                />
              </div>
              <div class="col-12">
                <form-control-text
                  name='address_city'
                  label="City"
                  defaultValue={billingFormDefaultValue.address_city}
                  errorText={this.errors.address_city}
                  inputHandler={this.inputHandler}
                />
              </div>
              <div class="col-12">
                <form-control-select
                  name='address_state'
                  label='State'
                  options={StateOptions}
                  defaultValue={billingFormDefaultValue.address_state}
                  errorText={this.errors.address_state}
                  inputHandler={this.inputHandler}
                />
              </div>
              <div class="col-12">
                <form-control-text
                  name='address_postal_code'
                  label="Postal Code"
                  defaultValue={billingFormDefaultValue.address_postal_code}
                  errorText={this.errors.address_postal_code}
                  inputHandler={this.inputHandler}
                  maxLength={7}
                />
              </div>
            </div>
          </fieldset>
        </form>
      </div>
    );
  }
}
