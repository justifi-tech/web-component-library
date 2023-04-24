import { Component, Host, h, State, Listen, Method, Prop } from '@stencil/core';
import { ValidationError } from 'yup';
import BillingFormSchema, { BillingFormFields } from './billing-form-schema';
import StateOptions from './state-options';

@Component({
  tag: 'justifi-billing-form',
  styleUrl: 'billing-form.scss',
  shadow: true,
})
export class BillingForm {
  @Prop() legend?: string;
  @State() billingFields: BillingFormFields = {
    address_line1: '',
    address_line2: '',
    address_city: '',
    address_state: '',
    address_postal_code: ''
  };

  @State() billingFieldsErrors: any = {};

  @Listen('fieldReceivedInput')
  setFormValue(event) {
    const data = event.detail;
    const billingFieldsClone = { ...this.billingFields };
    if (data.name) {
      billingFieldsClone[data.name] = data.value;
      this.billingFields = billingFieldsClone;
    }
  }

  @Method()
  async fill(fields: BillingFormFields) {
    this.billingFields = { ...fields };
  }

  @Method()
  async validate() {
    const newErrors = {};
    let isValid: boolean = true;

    try {
      await BillingFormSchema.validate(this.billingFields, { abortEarly: false })
    } catch (err) {
      isValid = false;
      err.inner.map((item: ValidationError) => {
        newErrors[item.path] = item.message;
      });
    }

    this.billingFieldsErrors = newErrors;

    return { isValid: isValid };
  }

  @Method()
  async getValues() {
    return this.billingFields;
  }

  legendBlock = (
    <legend>{this.legend}</legend>
  );

  render() {
    return (
      <Host exportparts="label,input,input-invalid">
        <fieldset>
          {this.legend && this.legendBlock}
          <div class="row gy-3">
            <div class="col-12">
              <text-input
                name="address_line1"
                label="Street Address"
                defaultValue={this.billingFields.address_line1}
                error={this.billingFieldsErrors.address_line1} />
            </div>
            <div class="col-12">
              <text-input
                name="address_line2"
                label="Apartment, Suite, etc. (optional)"
                defaultValue={this.billingFields.address_line2}
                error={this.billingFieldsErrors.address_line2} />
            </div>
            <div class="col-12">
              <text-input
                name="address_city"
                label="City"
                defaultValue={this.billingFields.address_city}
                error={this.billingFieldsErrors.address_city} />
            </div>
            <div class="col-12">
              <select-input
                name="address_state"
                label="State"
                options={StateOptions}
                defaultValue={this.billingFields.address_state}
                error={this.billingFieldsErrors.address_state} />
            </div>
            <div class="col-12">
              <text-input
                name="address_postal_code"
                label="ZIP"
                defaultValue={this.billingFields.address_postal_code}
                error={this.billingFieldsErrors.address_postal_code} />
            </div>
          </div>
        </fieldset>
      </Host>
    );
  }

}
