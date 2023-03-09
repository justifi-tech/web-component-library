import { Component, Host, h, State, Listen } from '@stencil/core';
import { ValidationError } from 'yup';
import BillingFormSchema from './billing-form-schema';

interface BillingFormFields {
  address_line1: string;
  address_line2?: string;
  address_city: string;
  address_state: string;
  address_postal_code: string;
}

@Component({
  tag: 'billing-form',
  styleUrl: 'billing-form.css',
  shadow: true,
})
export class BillingForm {
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

  async validate() {
    const newErrors = {};

    try {
      await BillingFormSchema.validate(this.billingFields, { abortEarly: false })
    } catch (err) {
      err.inner.map((item: ValidationError) => {
        newErrors[item.path] = item.message;
      });

      this.billingFieldsErrors = newErrors;
    }
  }

  render() {
    return (
      <Host>
        <fieldset>
          <text-field
            name="address_line1"
            label="Street Address"
            defaultValue={this.billingFields.address_line1}
            error={this.billingFieldsErrors.address_line1}>
          </text-field>

          <text-field
            name="address_line2"
            label="Apartment, Suite, etc. (optional)"
            defaultValue={this.billingFields.address_line2}
            error={this.billingFieldsErrors.address_line2}>
          </text-field>

          <text-field
            name="address_city"
            label="City"
            defaultValue={this.billingFields.address_city}
            error={this.billingFieldsErrors.address_city}>
          </text-field>

          <text-field
            name="address_state"
            label="State"
            defaultValue={this.billingFields.address_state}
            error={this.billingFieldsErrors.address_state}>
          </text-field>

          <text-field
            name="address_postal_code"
            label="ZIP"
            defaultValue={this.billingFields.address_postal_code}
            error={this.billingFieldsErrors.address_postal_code}>
          </text-field>

          <button onClick={() => this.validate()}>Validate</button>
        </fieldset>
      </Host>
    );
  }

}
